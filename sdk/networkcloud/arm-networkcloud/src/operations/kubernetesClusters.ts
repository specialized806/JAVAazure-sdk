/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { KubernetesClusters } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { NetworkCloud } from "../networkCloud";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl";
import {
  KubernetesCluster,
  KubernetesClustersListBySubscriptionNextOptionalParams,
  KubernetesClustersListBySubscriptionOptionalParams,
  KubernetesClustersListBySubscriptionResponse,
  KubernetesClustersListByResourceGroupNextOptionalParams,
  KubernetesClustersListByResourceGroupOptionalParams,
  KubernetesClustersListByResourceGroupResponse,
  KubernetesClustersGetOptionalParams,
  KubernetesClustersGetResponse,
  KubernetesClustersCreateOrUpdateOptionalParams,
  KubernetesClustersCreateOrUpdateResponse,
  KubernetesClustersDeleteOptionalParams,
  KubernetesClustersUpdateOptionalParams,
  KubernetesClustersUpdateResponse,
  KubernetesClusterRestartNodeParameters,
  KubernetesClustersRestartNodeOptionalParams,
  KubernetesClustersRestartNodeResponse,
  KubernetesClustersListBySubscriptionNextResponse,
  KubernetesClustersListByResourceGroupNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing KubernetesClusters operations. */
export class KubernetesClustersImpl implements KubernetesClusters {
  private readonly client: NetworkCloud;

  /**
   * Initialize a new instance of the class KubernetesClusters class.
   * @param client Reference to the service client
   */
  constructor(client: NetworkCloud) {
    this.client = client;
  }

  /**
   * Get a list of Kubernetes clusters in the provided subscription.
   * @param options The options parameters.
   */
  public listBySubscription(
    options?: KubernetesClustersListBySubscriptionOptionalParams
  ): PagedAsyncIterableIterator<KubernetesCluster> {
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
    options?: KubernetesClustersListBySubscriptionOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<KubernetesCluster[]> {
    let result: KubernetesClustersListBySubscriptionResponse;
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
    options?: KubernetesClustersListBySubscriptionOptionalParams
  ): AsyncIterableIterator<KubernetesCluster> {
    for await (const page of this.listBySubscriptionPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Get a list of Kubernetes clusters in the provided resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  public listByResourceGroup(
    resourceGroupName: string,
    options?: KubernetesClustersListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<KubernetesCluster> {
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
    options?: KubernetesClustersListByResourceGroupOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<KubernetesCluster[]> {
    let result: KubernetesClustersListByResourceGroupResponse;
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
    options?: KubernetesClustersListByResourceGroupOptionalParams
  ): AsyncIterableIterator<KubernetesCluster> {
    for await (const page of this.listByResourceGroupPagingPage(
      resourceGroupName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Get a list of Kubernetes clusters in the provided subscription.
   * @param options The options parameters.
   */
  private _listBySubscription(
    options?: KubernetesClustersListBySubscriptionOptionalParams
  ): Promise<KubernetesClustersListBySubscriptionResponse> {
    return this.client.sendOperationRequest(
      { options },
      listBySubscriptionOperationSpec
    );
  }

  /**
   * Get a list of Kubernetes clusters in the provided resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  private _listByResourceGroup(
    resourceGroupName: string,
    options?: KubernetesClustersListByResourceGroupOptionalParams
  ): Promise<KubernetesClustersListByResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listByResourceGroupOperationSpec
    );
  }

  /**
   * Get properties of the provided the Kubernetes cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    kubernetesClusterName: string,
    options?: KubernetesClustersGetOptionalParams
  ): Promise<KubernetesClustersGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, kubernetesClusterName, options },
      getOperationSpec
    );
  }

  /**
   * Create a new Kubernetes cluster or update the properties of the existing one.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param kubernetesClusterParameters The request body.
   * @param options The options parameters.
   */
  async beginCreateOrUpdate(
    resourceGroupName: string,
    kubernetesClusterName: string,
    kubernetesClusterParameters: KubernetesCluster,
    options?: KubernetesClustersCreateOrUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<KubernetesClustersCreateOrUpdateResponse>,
      KubernetesClustersCreateOrUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<KubernetesClustersCreateOrUpdateResponse> => {
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
      args: {
        resourceGroupName,
        kubernetesClusterName,
        kubernetesClusterParameters,
        options
      },
      spec: createOrUpdateOperationSpec
    });
    const poller = await createHttpPoller<
      KubernetesClustersCreateOrUpdateResponse,
      OperationState<KubernetesClustersCreateOrUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Create a new Kubernetes cluster or update the properties of the existing one.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param kubernetesClusterParameters The request body.
   * @param options The options parameters.
   */
  async beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    kubernetesClusterName: string,
    kubernetesClusterParameters: KubernetesCluster,
    options?: KubernetesClustersCreateOrUpdateOptionalParams
  ): Promise<KubernetesClustersCreateOrUpdateResponse> {
    const poller = await this.beginCreateOrUpdate(
      resourceGroupName,
      kubernetesClusterName,
      kubernetesClusterParameters,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Delete the provided Kubernetes cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    kubernetesClusterName: string,
    options?: KubernetesClustersDeleteOptionalParams
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
      args: { resourceGroupName, kubernetesClusterName, options },
      spec: deleteOperationSpec
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Delete the provided Kubernetes cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    kubernetesClusterName: string,
    options?: KubernetesClustersDeleteOptionalParams
  ): Promise<void> {
    const poller = await this.beginDelete(
      resourceGroupName,
      kubernetesClusterName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Patch the properties of the provided Kubernetes cluster, or update the tags associated with the
   * Kubernetes cluster. Properties and tag updates can be done independently.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param options The options parameters.
   */
  async beginUpdate(
    resourceGroupName: string,
    kubernetesClusterName: string,
    options?: KubernetesClustersUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<KubernetesClustersUpdateResponse>,
      KubernetesClustersUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<KubernetesClustersUpdateResponse> => {
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
      args: { resourceGroupName, kubernetesClusterName, options },
      spec: updateOperationSpec
    });
    const poller = await createHttpPoller<
      KubernetesClustersUpdateResponse,
      OperationState<KubernetesClustersUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Patch the properties of the provided Kubernetes cluster, or update the tags associated with the
   * Kubernetes cluster. Properties and tag updates can be done independently.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param options The options parameters.
   */
  async beginUpdateAndWait(
    resourceGroupName: string,
    kubernetesClusterName: string,
    options?: KubernetesClustersUpdateOptionalParams
  ): Promise<KubernetesClustersUpdateResponse> {
    const poller = await this.beginUpdate(
      resourceGroupName,
      kubernetesClusterName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Restart a targeted node of a Kubernetes cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param kubernetesClusterRestartNodeParameters The request body.
   * @param options The options parameters.
   */
  async beginRestartNode(
    resourceGroupName: string,
    kubernetesClusterName: string,
    kubernetesClusterRestartNodeParameters: KubernetesClusterRestartNodeParameters,
    options?: KubernetesClustersRestartNodeOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<KubernetesClustersRestartNodeResponse>,
      KubernetesClustersRestartNodeResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<KubernetesClustersRestartNodeResponse> => {
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
      args: {
        resourceGroupName,
        kubernetesClusterName,
        kubernetesClusterRestartNodeParameters,
        options
      },
      spec: restartNodeOperationSpec
    });
    const poller = await createHttpPoller<
      KubernetesClustersRestartNodeResponse,
      OperationState<KubernetesClustersRestartNodeResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Restart a targeted node of a Kubernetes cluster.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param kubernetesClusterName The name of the Kubernetes cluster.
   * @param kubernetesClusterRestartNodeParameters The request body.
   * @param options The options parameters.
   */
  async beginRestartNodeAndWait(
    resourceGroupName: string,
    kubernetesClusterName: string,
    kubernetesClusterRestartNodeParameters: KubernetesClusterRestartNodeParameters,
    options?: KubernetesClustersRestartNodeOptionalParams
  ): Promise<KubernetesClustersRestartNodeResponse> {
    const poller = await this.beginRestartNode(
      resourceGroupName,
      kubernetesClusterName,
      kubernetesClusterRestartNodeParameters,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * ListBySubscriptionNext
   * @param nextLink The nextLink from the previous successful call to the ListBySubscription method.
   * @param options The options parameters.
   */
  private _listBySubscriptionNext(
    nextLink: string,
    options?: KubernetesClustersListBySubscriptionNextOptionalParams
  ): Promise<KubernetesClustersListBySubscriptionNextResponse> {
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
    options?: KubernetesClustersListByResourceGroupNextOptionalParams
  ): Promise<KubernetesClustersListByResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listByResourceGroupNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listBySubscriptionOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.NetworkCloud/kubernetesClusters",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesClusterList
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
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/kubernetesClusters",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesClusterList
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
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/kubernetesClusters/{kubernetesClusterName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesCluster
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
    Parameters.kubernetesClusterName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/kubernetesClusters/{kubernetesClusterName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesCluster
    },
    201: {
      bodyMapper: Mappers.KubernetesCluster
    },
    202: {
      bodyMapper: Mappers.KubernetesCluster
    },
    204: {
      bodyMapper: Mappers.KubernetesCluster
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.kubernetesClusterParameters,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.kubernetesClusterName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/kubernetesClusters/{kubernetesClusterName}",
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
    Parameters.kubernetesClusterName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const updateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/kubernetesClusters/{kubernetesClusterName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesCluster
    },
    201: {
      bodyMapper: Mappers.KubernetesCluster
    },
    202: {
      bodyMapper: Mappers.KubernetesCluster
    },
    204: {
      bodyMapper: Mappers.KubernetesCluster
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.kubernetesClusterUpdateParameters,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.kubernetesClusterName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const restartNodeOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/kubernetesClusters/{kubernetesClusterName}/restartNode",
  httpMethod: "POST",
  responses: {
    200: {
      headersMapper: Mappers.KubernetesClustersRestartNodeHeaders
    },
    201: {
      headersMapper: Mappers.KubernetesClustersRestartNodeHeaders
    },
    202: {
      headersMapper: Mappers.KubernetesClustersRestartNodeHeaders
    },
    204: {
      headersMapper: Mappers.KubernetesClustersRestartNodeHeaders
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.kubernetesClusterRestartNodeParameters,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.kubernetesClusterName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const listBySubscriptionNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesClusterList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.nextLink,
    Parameters.subscriptionId
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listByResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KubernetesClusterList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.nextLink,
    Parameters.subscriptionId,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};