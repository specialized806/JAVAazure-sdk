/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { MaintenanceConfigurationsForResourceGroup } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { MaintenanceManagementClient } from "../maintenanceManagementClient";
import {
  MaintenanceConfiguration,
  MaintenanceConfigurationsForResourceGroupListOptionalParams,
  MaintenanceConfigurationsForResourceGroupListResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing MaintenanceConfigurationsForResourceGroup operations. */
export class MaintenanceConfigurationsForResourceGroupImpl
  implements MaintenanceConfigurationsForResourceGroup {
  private readonly client: MaintenanceManagementClient;

  /**
   * Initialize a new instance of the class MaintenanceConfigurationsForResourceGroup class.
   * @param client Reference to the service client
   */
  constructor(client: MaintenanceManagementClient) {
    this.client = client;
  }

  /**
   * Get Configuration records within a subscription and resource group
   * @param resourceGroupName Resource Group Name
   * @param options The options parameters.
   */
  public list(
    resourceGroupName: string,
    options?: MaintenanceConfigurationsForResourceGroupListOptionalParams
  ): PagedAsyncIterableIterator<MaintenanceConfiguration> {
    const iter = this.listPagingAll(resourceGroupName, options);
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
        return this.listPagingPage(resourceGroupName, options, settings);
      }
    };
  }

  private async *listPagingPage(
    resourceGroupName: string,
    options?: MaintenanceConfigurationsForResourceGroupListOptionalParams,
    _settings?: PageSettings
  ): AsyncIterableIterator<MaintenanceConfiguration[]> {
    let result: MaintenanceConfigurationsForResourceGroupListResponse;
    result = await this._list(resourceGroupName, options);
    yield result.value || [];
  }

  private async *listPagingAll(
    resourceGroupName: string,
    options?: MaintenanceConfigurationsForResourceGroupListOptionalParams
  ): AsyncIterableIterator<MaintenanceConfiguration> {
    for await (const page of this.listPagingPage(resourceGroupName, options)) {
      yield* page;
    }
  }

  /**
   * Get Configuration records within a subscription and resource group
   * @param resourceGroupName Resource Group Name
   * @param options The options parameters.
   */
  private _list(
    resourceGroupName: string,
    options?: MaintenanceConfigurationsForResourceGroupListOptionalParams
  ): Promise<MaintenanceConfigurationsForResourceGroupListResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Maintenance/maintenanceConfigurations",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ListMaintenanceConfigurationsResult
    },
    default: {
      bodyMapper: Mappers.MaintenanceError
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