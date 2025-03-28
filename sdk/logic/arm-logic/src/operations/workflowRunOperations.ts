/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { WorkflowRunOperations } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { LogicManagementClient } from "../logicManagementClient.js";
import {
  WorkflowRunOperationsGetOptionalParams,
  WorkflowRunOperationsGetResponse
} from "../models/index.js";

/** Class containing WorkflowRunOperations operations. */
export class WorkflowRunOperationsImpl implements WorkflowRunOperations {
  private readonly client: LogicManagementClient;

  /**
   * Initialize a new instance of the class WorkflowRunOperations class.
   * @param client Reference to the service client
   */
  constructor(client: LogicManagementClient) {
    this.client = client;
  }

  /**
   * Gets an operation for a run.
   * @param resourceGroupName The resource group name.
   * @param workflowName The workflow name.
   * @param runName The workflow run name.
   * @param operationId The workflow operation id.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    workflowName: string,
    runName: string,
    operationId: string,
    options?: WorkflowRunOperationsGetOptionalParams
  ): Promise<WorkflowRunOperationsGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, workflowName, runName, operationId, options },
      getOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/runs/{runName}/operations/{operationId}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WorkflowRun
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
    Parameters.workflowName,
    Parameters.runName,
    Parameters.operationId
  ],
  headerParameters: [Parameters.accept],
  serializer
};
