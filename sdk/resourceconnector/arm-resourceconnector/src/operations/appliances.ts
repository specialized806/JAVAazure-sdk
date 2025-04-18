/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { Appliances } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { ResourceConnectorManagementClient } from "../resourceConnectorManagementClient.js";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl.js";
import {
  ApplianceOperation,
  AppliancesListOperationsNextOptionalParams,
  AppliancesListOperationsOptionalParams,
  AppliancesListOperationsResponse,
  Appliance,
  AppliancesListBySubscriptionNextOptionalParams,
  AppliancesListBySubscriptionOptionalParams,
  AppliancesListBySubscriptionResponse,
  AppliancesListByResourceGroupNextOptionalParams,
  AppliancesListByResourceGroupOptionalParams,
  AppliancesListByResourceGroupResponse,
  AppliancesGetTelemetryConfigOptionalParams,
  AppliancesGetTelemetryConfigResponse,
  AppliancesGetOptionalParams,
  AppliancesGetResponse,
  AppliancesCreateOrUpdateOptionalParams,
  AppliancesCreateOrUpdateResponse,
  AppliancesDeleteOptionalParams,
  AppliancesUpdateOptionalParams,
  AppliancesUpdateResponse,
  AppliancesListClusterUserCredentialOptionalParams,
  AppliancesListClusterUserCredentialResponse,
  AppliancesListKeysOptionalParams,
  AppliancesListKeysResponse,
  AppliancesGetUpgradeGraphOptionalParams,
  AppliancesGetUpgradeGraphResponse,
  AppliancesListOperationsNextResponse,
  AppliancesListBySubscriptionNextResponse,
  AppliancesListByResourceGroupNextResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing Appliances operations. */
export class AppliancesImpl implements Appliances {
  private readonly client: ResourceConnectorManagementClient;

  /**
   * Initialize a new instance of the class Appliances class.
   * @param client Reference to the service client
   */
  constructor(client: ResourceConnectorManagementClient) {
    this.client = client;
  }

  /**
   * Lists all available Appliances operations.
   * @param options The options parameters.
   */
  public listOperations(
    options?: AppliancesListOperationsOptionalParams
  ): PagedAsyncIterableIterator<ApplianceOperation> {
    const iter = this.listOperationsPagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listOperationsPagingPage(options, settings);
      }
    };
  }

  private async *listOperationsPagingPage(
    options?: AppliancesListOperationsOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<ApplianceOperation[]> {
    let result: AppliancesListOperationsResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listOperations(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listOperationsNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listOperationsPagingAll(
    options?: AppliancesListOperationsOptionalParams
  ): AsyncIterableIterator<ApplianceOperation> {
    for await (const page of this.listOperationsPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Gets a list of Appliances in the specified subscription. The operation returns properties of each
   * Appliance
   * @param options The options parameters.
   */
  public listBySubscription(
    options?: AppliancesListBySubscriptionOptionalParams
  ): PagedAsyncIterableIterator<Appliance> {
    const iter = this.listBySubscriptionPagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listBySubscriptionPagingPage(options, settings);
      }
    };
  }

  private async *listBySubscriptionPagingPage(
    options?: AppliancesListBySubscriptionOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Appliance[]> {
    let result: AppliancesListBySubscriptionResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listBySubscription(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listBySubscriptionNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listBySubscriptionPagingAll(
    options?: AppliancesListBySubscriptionOptionalParams
  ): AsyncIterableIterator<Appliance> {
    for await (const page of this.listBySubscriptionPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Gets a list of Appliances in the specified subscription and resource group. The operation returns
   * properties of each Appliance.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  public listByResourceGroup(
    resourceGroupName: string,
    options?: AppliancesListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<Appliance> {
    const iter = this.listByResourceGroupPagingAll(resourceGroupName, options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listByResourceGroupPagingPage(
          resourceGroupName,
          options,
          settings
        );
      }
    };
  }

  private async *listByResourceGroupPagingPage(
    resourceGroupName: string,
    options?: AppliancesListByResourceGroupOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Appliance[]> {
    let result: AppliancesListByResourceGroupResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByResourceGroup(resourceGroupName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByResourceGroupNext(
        resourceGroupName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByResourceGroupPagingAll(
    resourceGroupName: string,
    options?: AppliancesListByResourceGroupOptionalParams
  ): AsyncIterableIterator<Appliance> {
    for await (const page of this.listByResourceGroupPagingPage(
      resourceGroupName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Lists all available Appliances operations.
   * @param options The options parameters.
   */
  private _listOperations(
    options?: AppliancesListOperationsOptionalParams
  ): Promise<AppliancesListOperationsResponse> {
    return this.client.sendOperationRequest(
      { options },
      listOperationsOperationSpec
    );
  }

  /**
   * Gets a list of Appliances in the specified subscription. The operation returns properties of each
   * Appliance
   * @param options The options parameters.
   */
  private _listBySubscription(
    options?: AppliancesListBySubscriptionOptionalParams
  ): Promise<AppliancesListBySubscriptionResponse> {
    return this.client.sendOperationRequest(
      { options },
      listBySubscriptionOperationSpec
    );
  }

  /**
   * Gets the telemetry config.
   * @param options The options parameters.
   */
  getTelemetryConfig(
    options?: AppliancesGetTelemetryConfigOptionalParams
  ): Promise<AppliancesGetTelemetryConfigResponse> {
    return this.client.sendOperationRequest(
      { options },
      getTelemetryConfigOperationSpec
    );
  }

  /**
   * Gets a list of Appliances in the specified subscription and resource group. The operation returns
   * properties of each Appliance.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  private _listByResourceGroup(
    resourceGroupName: string,
    options?: AppliancesListByResourceGroupOptionalParams
  ): Promise<AppliancesListByResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listByResourceGroupOperationSpec
    );
  }

  /**
   * Gets the details of an Appliance with a specified resource group and name.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    resourceName: string,
    options?: AppliancesGetOptionalParams
  ): Promise<AppliancesGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, resourceName, options },
      getOperationSpec
    );
  }

  /**
   * Creates or updates an Appliance in the specified Subscription and Resource Group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param parameters Parameters supplied to create or update an Appliance.
   * @param options The options parameters.
   */
  async beginCreateOrUpdate(
    resourceGroupName: string,
    resourceName: string,
    parameters: Appliance,
    options?: AppliancesCreateOrUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<AppliancesCreateOrUpdateResponse>,
      AppliancesCreateOrUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<AppliancesCreateOrUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, resourceName, parameters, options },
      spec: createOrUpdateOperationSpec
    });
    const poller = await createHttpPoller<
      AppliancesCreateOrUpdateResponse,
      OperationState<AppliancesCreateOrUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Creates or updates an Appliance in the specified Subscription and Resource Group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param parameters Parameters supplied to create or update an Appliance.
   * @param options The options parameters.
   */
  async beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    resourceName: string,
    parameters: Appliance,
    options?: AppliancesCreateOrUpdateOptionalParams
  ): Promise<AppliancesCreateOrUpdateResponse> {
    const poller = await this.beginCreateOrUpdate(
      resourceGroupName,
      resourceName,
      parameters,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Deletes an Appliance with the specified Resource Name, Resource Group, and Subscription Id.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    resourceName: string,
    options?: AppliancesDeleteOptionalParams
  ): Promise<SimplePollerLike<OperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, resourceName, options },
      spec: deleteOperationSpec
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Deletes an Appliance with the specified Resource Name, Resource Group, and Subscription Id.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    resourceName: string,
    options?: AppliancesDeleteOptionalParams
  ): Promise<void> {
    const poller = await this.beginDelete(
      resourceGroupName,
      resourceName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Updates an Appliance with the specified Resource Name in the specified Resource Group and
   * Subscription.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    resourceName: string,
    options?: AppliancesUpdateOptionalParams
  ): Promise<AppliancesUpdateResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, resourceName, options },
      updateOperationSpec
    );
  }

  /**
   * Returns the cluster user credentials for the dedicated appliance.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param options The options parameters.
   */
  listClusterUserCredential(
    resourceGroupName: string,
    resourceName: string,
    options?: AppliancesListClusterUserCredentialOptionalParams
  ): Promise<AppliancesListClusterUserCredentialResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, resourceName, options },
      listClusterUserCredentialOperationSpec
    );
  }

  /**
   * Returns the cluster customer credentials for the dedicated appliance.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param options The options parameters.
   */
  listKeys(
    resourceGroupName: string,
    resourceName: string,
    options?: AppliancesListKeysOptionalParams
  ): Promise<AppliancesListKeysResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, resourceName, options },
      listKeysOperationSpec
    );
  }

  /**
   * Gets the upgrade graph of an Appliance with a specified resource group and name and specific release
   * train.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceName Appliances name.
   * @param upgradeGraph Upgrade graph version, ex - stable
   * @param options The options parameters.
   */
  getUpgradeGraph(
    resourceGroupName: string,
    resourceName: string,
    upgradeGraph: string,
    options?: AppliancesGetUpgradeGraphOptionalParams
  ): Promise<AppliancesGetUpgradeGraphResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, resourceName, upgradeGraph, options },
      getUpgradeGraphOperationSpec
    );
  }

  /**
   * ListOperationsNext
   * @param nextLink The nextLink from the previous successful call to the ListOperations method.
   * @param options The options parameters.
   */
  private _listOperationsNext(
    nextLink: string,
    options?: AppliancesListOperationsNextOptionalParams
  ): Promise<AppliancesListOperationsNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listOperationsNextOperationSpec
    );
  }

  /**
   * ListBySubscriptionNext
   * @param nextLink The nextLink from the previous successful call to the ListBySubscription method.
   * @param options The options parameters.
   */
  private _listBySubscriptionNext(
    nextLink: string,
    options?: AppliancesListBySubscriptionNextOptionalParams
  ): Promise<AppliancesListBySubscriptionNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listBySubscriptionNextOperationSpec
    );
  }

  /**
   * ListByResourceGroupNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param nextLink The nextLink from the previous successful call to the ListByResourceGroup method.
   * @param options The options parameters.
   */
  private _listByResourceGroupNext(
    resourceGroupName: string,
    nextLink: string,
    options?: AppliancesListByResourceGroupNextOptionalParams
  ): Promise<AppliancesListByResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listByResourceGroupNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationsOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.ResourceConnector/operations",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceOperationsList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const listBySubscriptionOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.ResourceConnector/appliances",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const getTelemetryConfigOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.ResourceConnector/telemetryconfig",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceGetTelemetryConfigResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const listByResourceGroupOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Appliance
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.Appliance
    },
    201: {
      bodyMapper: Mappers.Appliance
    },
    202: {
      bodyMapper: Mappers.Appliance
    },
    204: {
      bodyMapper: Mappers.Appliance
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.parameters,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}",
  httpMethod: "DELETE",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const updateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.Appliance
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: {
    parameterPath: { tags: ["options", "tags"] },
    mapper: { ...Mappers.PatchableAppliance, required: true }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const listClusterUserCredentialOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}/listClusterUserCredential",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceListCredentialResults
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listKeysOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}/listkeys",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceListKeysResults
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getUpgradeGraphOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ResourceConnector/appliances/{resourceName}/upgradeGraphs/{upgradeGraph}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.UpgradeGraph
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceName,
    Parameters.upgradeGraph
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listOperationsNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceOperationsList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [Parameters.$host, Parameters.nextLink],
  headerParameters: [Parameters.accept],
  serializer
};
const listBySubscriptionNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listByResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ApplianceListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
