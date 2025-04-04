/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { Workflows } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { WebSiteManagementClient } from "../webSiteManagementClient.js";
import {
  RegenerateActionParameter,
  WorkflowsRegenerateAccessKeyOptionalParams,
  Workflow,
  WorkflowsValidateOptionalParams,
} from "../models/index.js";

/** Class containing Workflows operations. */
export class WorkflowsImpl implements Workflows {
  private readonly client: WebSiteManagementClient;

  /**
   * Initialize a new instance of the class Workflows class.
   * @param client Reference to the service client
   */
  constructor(client: WebSiteManagementClient) {
    this.client = client;
  }

  /**
   * Regenerates the callback URL access key for request triggers.
   * @param resourceGroupName Name of the resource group to which the resource belongs.
   * @param name Site name.
   * @param workflowName The workflow name.
   * @param keyType The access key type.
   * @param options The options parameters.
   */
  regenerateAccessKey(
    resourceGroupName: string,
    name: string,
    workflowName: string,
    keyType: RegenerateActionParameter,
    options?: WorkflowsRegenerateAccessKeyOptionalParams,
  ): Promise<void> {
    return this.client.sendOperationRequest(
      { resourceGroupName, name, workflowName, keyType, options },
      regenerateAccessKeyOperationSpec,
    );
  }

  /**
   * Validates the workflow definition.
   * @param resourceGroupName Name of the resource group to which the resource belongs.
   * @param name Site name.
   * @param workflowName The workflow name.
   * @param validate The workflow.
   * @param options The options parameters.
   */
  validate(
    resourceGroupName: string,
    name: string,
    workflowName: string,
    validate: Workflow,
    options?: WorkflowsValidateOptionalParams,
  ): Promise<void> {
    return this.client.sendOperationRequest(
      { resourceGroupName, name, workflowName, validate, options },
      validateOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const regenerateAccessKeyOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{name}/hostruntime/runtime/webhooks/workflow/api/management/workflows/{workflowName}/regenerateAccessKey",
  httpMethod: "POST",
  responses: {
    200: {},
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  requestBody: Parameters.keyType1,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.name,
    Parameters.workflowName1,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const validateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{name}/hostruntime/runtime/webhooks/workflow/api/management/workflows/{workflowName}/validate",
  httpMethod: "POST",
  responses: {
    200: {},
    default: {
      bodyMapper: Mappers.ErrorResponse,
    },
  },
  requestBody: Parameters.validate,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.name,
    Parameters.workflowName1,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
