// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  PipelineResponse,
  PipelineRequest,
  TransferProgressEvent,
} from "@azure/core-rest-pipeline";
import { RestError } from "@azure/core-rest-pipeline";
import type { ServiceClient, OperationOptions, FullOperationResponse } from "@azure/core-client";
import { parseXML, stringifyXML } from "@azure/core-xml";

import * as Constants from "./constants.js";
import { administrationLogger as logger } from "../log.js";
import { Buffer } from "buffer";

import { parseURL } from "./parseUrl.js";
import { isJSONLikeObject } from "./utils.js";
import { isDefined } from "@azure/core-util";
import type { OperationTracingOptions } from "@azure/core-tracing";
import type { AbortSignalLike } from "@azure/abort-controller";
import type { InternalQueueOptions } from "../serializers/queueResourceSerializer.js";
import type { InternalTopicOptions } from "../serializers/topicResourceSerializer.js";
import type { InternalSubscriptionOptions } from "../serializers/subscriptionResourceSerializer.js";
import type { CreateRuleOptions } from "../serializers/ruleResourceSerializer.js";

/**
 * @internal
 * Represents the internal ATOM XML serializer interface
 */
export interface AtomXmlSerializer {
  serialize(requestBodyInJson: object): Record<string, unknown>;

  deserialize(response: FullOperationResponse): Promise<FullOperationResponse>;
}

/**
   applies options to the pipeline request.
  */
function applyRequestOptions(
  request: PipelineRequest,
  options: {
    headers?: Record<string, string>;
    onUploadProgress?: (progress: TransferProgressEvent) => void;
    onDownloadProgress?: (progress: TransferProgressEvent) => void;
    abortSignal?: AbortSignalLike;
    tracingOptions?: OperationTracingOptions;
    timeout: number;
  },
): void {
  if (options.headers) {
    const headers = options.headers;
    for (const headerName of Object.keys(headers)) {
      request.headers.set(headerName, headers[headerName]);
    }
  }
  request.onDownloadProgress = options.onDownloadProgress;
  request.onUploadProgress = options.onUploadProgress;
  request.abortSignal = options.abortSignal;
  request.timeout = options.timeout;
  if (options.tracingOptions) {
    request.tracingOptions = options.tracingOptions;
  }
}

/**
 * @internal
 * Utility to execute Atom XML operations as HTTP requests
 */
export async function executeAtomXmlOperation(
  serviceBusAtomManagementClient: ServiceClient,
  request: PipelineRequest,
  serializer: AtomXmlSerializer,
  operationOptions: OperationOptions,
  requestObject?:
    | InternalQueueOptions
    | InternalTopicOptions
    | InternalSubscriptionOptions
    | CreateRuleOptions,
): Promise<FullOperationResponse> {
  if (requestObject) {
    request.body = stringifyXML(serializer.serialize(requestObject), { rootName: "entry" });
    if (request.method === "PUT") {
      request.headers.set("content-length", Buffer.byteLength(request.body));
    }
  }

  logger.verbose(`Executing ATOM based HTTP request body: ${request.body}`);

  const reqPrepareOptions = {
    headers: operationOptions.requestOptions?.customHeaders,
    onUploadProgress: operationOptions.requestOptions?.onUploadProgress,
    onDownloadProgress: operationOptions.requestOptions?.onDownloadProgress,
    abortSignal: operationOptions.abortSignal,
    tracingOptions: operationOptions.tracingOptions,
    disableJsonStringifyOnBody: true,
    timeout: operationOptions.requestOptions?.timeout || 0,
  };
  applyRequestOptions(request, reqPrepareOptions);
  const response: PipelineResponse = await serviceBusAtomManagementClient.sendRequest(request);

  logger.verbose(`Received ATOM based HTTP response: ${response.bodyAsText}`);

  try {
    if (response.bodyAsText) {
      (response as FullOperationResponse).parsedBody = await parseXML(response.bodyAsText, {
        includeRoot: true,
      });
    }
  } catch (err: any) {
    const error = new RestError(
      `Error occurred while parsing the response body - expected the service to return valid xml content.`,
      {
        code: RestError.PARSE_ERROR,
        statusCode: response.status,
        request: response.request,
        response,
      },
    );
    logger.logError(err, "Error parsing response body from Service");
    throw error;
  }

  return serializer.deserialize(response);
}

/**
 * @internal
 * The key-value pairs having undefined/null as the values would lead to the empty tags in the serialized XML request.
 * Empty tags in the request body is problematic because of the following reasons.
 * - ATOM based management operations throw a "Bad Request" error if empty tags are included in the XML request body at top level.
 * - At the inner levels, Service assigns the empty strings as values to the empty tags instead of throwing an error.
 *
 * This method recursively removes the key-value pairs with undefined/null as the values from the request object that is to be serialized.
 *
 */
export function sanitizeSerializableObject(resource: { [key: string]: any }): void {
  Object.keys(resource).forEach(function (property) {
    if (!isDefined(resource[property])) {
      delete resource[property];
    } else if (isJSONLikeObject(resource[property])) {
      sanitizeSerializableObject(resource[property]);
    }
  });
}

/**
 * @internal
 * Serializes input information to construct the Atom XML request
 * @param resourceName - Name of the resource to be serialized like `QueueDescription`
 * @param resource - The entity details
 * @param allowedProperties - The set of properties that are allowed by the service for the
 * associated operation(s);
 */
export function serializeToAtomXmlRequest(
  resourceName: string,
  resource: unknown,
): Record<string, unknown> {
  const content: any = {};

  content[resourceName] = Object.assign({}, resource);
  sanitizeSerializableObject(content[resourceName]);

  content[resourceName][Constants.XML_METADATA_MARKER] = {
    xmlns: "http://schemas.microsoft.com/netservices/2010/10/servicebus/connect",
    "xmlns:i": "http://www.w3.org/2001/XMLSchema-instance",
  };

  content[Constants.XML_METADATA_MARKER] = { type: "application/xml" };
  const requestDetails: Record<string, unknown> = {
    updated: new Date().toISOString(),
    content: content,
  };
  requestDetails[Constants.XML_METADATA_MARKER] = {
    xmlns: "http://www.w3.org/2005/Atom",
  };
  return requestDetails;
}

/**
 * @internal
 * Transforms response to contain the parsed data.
 * @param nameProperties - The set of 'name' properties to be constructed on the
 * resultant object e.g., QueueName, TopicName, etc.
 */
export async function deserializeAtomXmlResponse(
  nameProperties: string[],
  response: FullOperationResponse,
): Promise<FullOperationResponse> {
  // If received data is a non-valid HTTP response, the body is expected to contain error information
  if (response.status < 200 || response.status >= 300) {
    throw buildError(response);
  }

  parseAtomResult(response, nameProperties);

  return response;
}

/**
 * @internal
 * Utility to deserialize the given JSON content in response body based on
 * if it's a single `entry` or `feed` and updates the `response.parsedBody` to hold the evaluated output.
 * @param response - Response containing the JSON value in `response.parsedBody`
 * @param nameProperties - The set of 'name' properties to be constructed on the
 * resultant object e.g., QueueName, TopicName, etc.
 * */
function parseAtomResult(response: FullOperationResponse, nameProperties: string[]): void {
  const atomResponseInJson = response.parsedBody;

  let result: any;
  if (!atomResponseInJson) {
    response.parsedBody = undefined;
    return;
  }

  if (atomResponseInJson.feed) {
    result = parseFeedResult(atomResponseInJson.feed);
  } else if (atomResponseInJson.entry) {
    result = parseEntryResult(atomResponseInJson.entry);
  }

  if (result) {
    if (Array.isArray(result)) {
      result.forEach((entry) => {
        setName(entry, nameProperties);
      });
    } else {
      setName(result, nameProperties);
    }
    response.parsedBody = result;
    return;
  }

  logger.warning(
    "Failure in parsing response body from service. Expected response to be in Atom XML format and have either feed or entry components, but received - %0",
    atomResponseInJson,
  );
  throw new RestError(
    "Error occurred while parsing the response body - expected the service to return atom xml content with either feed or entry elements.",
    {
      code: RestError.PARSE_ERROR,
      statusCode: response.status,
      request: response.request,
      response,
    },
  );
}

/**
 * @internal
 * Utility to help parse given `entry` result
 */
function parseEntryResult(entry: any): Record<string, unknown> | undefined {
  let result: any;

  if (
    typeof entry !== "object" ||
    entry == null ||
    typeof entry.content !== "object" ||
    entry.content == null
  ) {
    return undefined;
  }

  const contentElementNames = Object.keys(entry.content).filter(function (key) {
    return key !== Constants.XML_METADATA_MARKER;
  });

  if (contentElementNames && contentElementNames[0]) {
    const contentRootElementName = contentElementNames[0];
    delete entry.content[contentRootElementName][Constants.XML_METADATA_MARKER];
    result = entry.content[contentRootElementName];

    if (result) {
      if (entry[Constants.XML_METADATA_MARKER]) {
        result[Constants.ATOM_METADATA_MARKER] = entry[Constants.XML_METADATA_MARKER];
      } else {
        result[Constants.ATOM_METADATA_MARKER] = {};
      }

      result[Constants.ATOM_METADATA_MARKER]["ContentRootElement"] = contentRootElementName;

      Object.keys(entry).forEach((property: string) => {
        if (property !== "content" && property !== Constants.XML_METADATA_MARKER) {
          result[Constants.ATOM_METADATA_MARKER][property] = entry[property];
        }
      });

      return result;
    }
  }

  return undefined;
}

/**
 * @internal
 * Utility to help parse link info from the given `feed` result
 */
function parseLinkInfo(
  feedLink: { [Constants.XML_METADATA_MARKER]: { rel: string; href: string } }[],
  relationship: "self" | "next",
): string | undefined {
  if (!feedLink || !Array.isArray(feedLink)) {
    return undefined;
  }
  for (const linkInfo of feedLink) {
    if (linkInfo[Constants.XML_METADATA_MARKER].rel === relationship) {
      return linkInfo[Constants.XML_METADATA_MARKER].href;
    }
  }
  return undefined;
}

/**
 * @internal
 * Utility to help parse given `feed` result
 */
function parseFeedResult(feed: any): Record<string, unknown>[] & { nextLink?: string } {
  const result: Record<string, unknown>[] & { nextLink?: string } = [];
  if (typeof feed === "object" && feed != null && feed.entry) {
    if (Array.isArray(feed.entry)) {
      feed.entry.forEach((entry: any) => {
        const parsedEntryResult = parseEntryResult(entry);
        if (parsedEntryResult) {
          result.push(parsedEntryResult);
        }
      });
    } else {
      const parsedEntryResult = parseEntryResult(feed.entry);
      if (parsedEntryResult) {
        result.push(parsedEntryResult);
      }
    }
    result.nextLink = parseLinkInfo(feed.link, "next");
  }
  return result;
}

/**
 * @internal
 */
function isKnownResponseCode(
  statusCode: number,
): statusCode is keyof typeof Constants.HttpResponseCodes {
  return !!(Constants.HttpResponseCodes as { [statusCode: number]: string })[statusCode];
}

/**
 * @internal
 * Extracts the applicable entity name(s) from the URL based on the known structure
 * and instantiates the corresponding name properties to the deserialized response
 *
 * The pattern matching checks to extract entity names are based on following
 * constraints dictated by the service
 * - '/' is allowed in Queue and Topic names
 * - '/' is not allowed in Namespace, Subscription and Rule names
 * - Valid pathname URL structures used in the ATOM based management API are
 *     - `<namespace-component>/<topic-name>/Subscriptions/<subscription-name>/Rules/<rule-name>`
 *     - `<namespace-component>/<topic-name>/Subscriptions/<subscription-name>`
 *     - `<namespace-component>/<any-entity-name>`
 *
 */
function setName(entry: any, nameProperties: any): any {
  if (entry[Constants.ATOM_METADATA_MARKER]) {
    let rawUrl = entry[Constants.ATOM_METADATA_MARKER].id;

    // The parsedUrl gets constructed differently for browser vs Node.
    // It is specifically behaves different for some of the Atom based management API where
    // the received URL in "id" element is of type "sb:// ... " and not a standard HTTP one
    // Hence, normalizing the URL for parsing to work as expected in browser
    if (rawUrl.startsWith("sb://")) {
      rawUrl = "https://" + rawUrl.substring(5);
    }

    const parsedUrl = parseURL(rawUrl);
    const pathname: string = parsedUrl.pathname;

    const firstIndexOfDelimiter = pathname.indexOf("/");

    if (pathname.match("(.*)/(.*)/Subscriptions/(.*)/Rules/(.*)")) {
      const lastIndexOfSubscriptionsDelimiter = pathname.lastIndexOf("/Subscriptions/");
      const firstIndexOfRulesDelimiter = pathname.indexOf("/Rules/");
      entry[nameProperties[0]] = pathname.substring(
        firstIndexOfDelimiter + 1,
        lastIndexOfSubscriptionsDelimiter,
      );
      entry[nameProperties[1]] = pathname.substring(
        lastIndexOfSubscriptionsDelimiter + 15,
        firstIndexOfRulesDelimiter,
      );
      entry[nameProperties[2]] = pathname.substring(firstIndexOfRulesDelimiter + 7);
    } else if (pathname.match("(.*)/(.*)/Subscriptions/(.*)")) {
      const lastIndexOfSubscriptionsDelimiter = pathname.lastIndexOf("/Subscriptions/");
      entry[nameProperties[0]] = pathname.substring(
        firstIndexOfDelimiter + 1,
        lastIndexOfSubscriptionsDelimiter,
      );
      entry[nameProperties[1]] = pathname.substring(lastIndexOfSubscriptionsDelimiter + 15);
    } else if (pathname.match("(.*)/(.*)")) {
      entry[nameProperties[0]] = pathname.substring(firstIndexOfDelimiter + 1);
    }
  }
}

/**
 * @internal
 * Utility to help construct the normalized `RestError` object based on given error
 * information and other data present in the received `response` object.
 */
export function buildError(response: FullOperationResponse): RestError {
  if (!isKnownResponseCode(response.status)) {
    throw new RestError(
      `Service returned an error response with an unrecognized HTTP status code - ${response.status}`,
      {
        code: "ServiceError",
        statusCode: response.status,
        request: response.request,
        response,
      },
    );
  }

  const errorBody = response.parsedBody;
  let errorMessage;
  if (typeof errorBody === "string") {
    errorMessage = errorBody;
  } else {
    if (
      !isDefined(errorBody) ||
      !isDefined(errorBody.Error) ||
      !isDefined(errorBody.Error.Detail)
    ) {
      errorMessage =
        "Detailed error message information not available. Look at the 'code' property on error for more information.";
    } else {
      errorMessage = errorBody.Error.Detail;
    }
  }

  const errorCode = getErrorCode(response, errorMessage);

  const error: RestError = new RestError(errorMessage, {
    code: errorCode,
    statusCode: response.status,
    request: response.request,
    response,
  });
  return error;
}

/**
 * @internal
 * Helper utility to construct user friendly error codes based on based on given error
 * information and other data present in the received `response` object.
 */
function getErrorCode(response: PipelineResponse, errorMessage: string): string {
  if (response.status === 401) {
    return "UnauthorizedRequestError";
  }
  if (response.status === 404) {
    return "MessageEntityNotFoundError";
  }
  if (response.status === 409) {
    if (response.request.method === "DELETE") {
      return "ServiceError";
    }

    if (response.request.method === "PUT" && response.request.headers.get("If-Match") === "*") {
      return "ServiceError";
    }

    if (errorMessage && errorMessage.toLowerCase().includes("subcode=40901")) {
      return "ServiceError";
    }

    return "MessageEntityAlreadyExistsError";
  }

  if (response.status === 403) {
    if (errorMessage && errorMessage.toLowerCase().includes("subcode=40301")) {
      return "InvalidOperationError";
    }
    return "QuotaExceededError";
  }

  if (response.status === 400) {
    return "ServiceError";
  }

  if (response.status === 503) {
    return "ServerBusyError";
  }

  return (Constants.HttpResponseCodes as { [statusCode: number]: string })[response.status];
}
