/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { FabricOperationsStatus } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { AzureSiteRecoveryManagementServiceAPI } from "../azureSiteRecoveryManagementServiceAPI.js";
import {
  FabricOperationsStatusGetOptionalParams,
  FabricOperationsStatusGetResponse
} from "../models/index.js";

/** Class containing FabricOperationsStatus operations. */
export class FabricOperationsStatusImpl implements FabricOperationsStatus {
  private readonly client: AzureSiteRecoveryManagementServiceAPI;

  /**
   * Initialize a new instance of the class FabricOperationsStatus class.
   * @param client Reference to the service client
   */
  constructor(client: AzureSiteRecoveryManagementServiceAPI) {
    this.client = client;
  }

  /**
   * Tracks the results of an asynchronous operation on the fabric.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param fabricName The fabric name.
   * @param operationId The ID of an ongoing async operation.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    fabricName: string,
    operationId: string,
    options?: FabricOperationsStatusGetOptionalParams
  ): Promise<FabricOperationsStatusGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, fabricName, operationId, options },
      getOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataReplication/replicationFabrics/{fabricName}/operations/{operationId}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.OperationStatus
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
    Parameters.fabricName,
    Parameters.operationId
  ],
  headerParameters: [Parameters.accept],
  serializer
};
