/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { WorkflowRunActionScopeRepetitions } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { LogicManagementClient } from "../logicManagementClient.js";
import {
  WorkflowRunActionRepetitionDefinition,
  WorkflowRunActionScopeRepetitionsListOptionalParams,
  WorkflowRunActionScopeRepetitionsListResponse,
  WorkflowRunActionScopeRepetitionsGetOptionalParams,
  WorkflowRunActionScopeRepetitionsGetResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing WorkflowRunActionScopeRepetitions operations. */
export class WorkflowRunActionScopeRepetitionsImpl
  implements WorkflowRunActionScopeRepetitions {
  private readonly client: LogicManagementClient;

  /**
   * Initialize a new instance of the class WorkflowRunActionScopeRepetitions class.
   * @param client Reference to the service client
   */
  constructor(client: LogicManagementClient) {
    this.client = client;
  }

  /**
   * List the workflow run action scoped repetitions.
   * @param resourceGroupName The resource group name.
   * @param workflowName The workflow name.
   * @param runName The workflow run name.
   * @param actionName The workflow action name.
   * @param options The options parameters.
   */
  public list(
    resourceGroupName: string,
    workflowName: string,
    runName: string,
    actionName: string,
    options?: WorkflowRunActionScopeRepetitionsListOptionalParams
  ): PagedAsyncIterableIterator<WorkflowRunActionRepetitionDefinition> {
    const iter = this.listPagingAll(
      resourceGroupName,
      workflowName,
      runName,
      actionName,
      options
    );
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
        return this.listPagingPage(
          resourceGroupName,
          workflowName,
          runName,
          actionName,
          options,
          settings
        );
      }
    };
  }

  private async *listPagingPage(
    resourceGroupName: string,
    workflowName: string,
    runName: string,
    actionName: string,
    options?: WorkflowRunActionScopeRepetitionsListOptionalParams,
    _settings?: PageSettings
  ): AsyncIterableIterator<WorkflowRunActionRepetitionDefinition[]> {
    let result: WorkflowRunActionScopeRepetitionsListResponse;
    result = await this._list(
      resourceGroupName,
      workflowName,
      runName,
      actionName,
      options
    );
    yield result.value || [];
  }

  private async *listPagingAll(
    resourceGroupName: string,
    workflowName: string,
    runName: string,
    actionName: string,
    options?: WorkflowRunActionScopeRepetitionsListOptionalParams
  ): AsyncIterableIterator<WorkflowRunActionRepetitionDefinition> {
    for await (const page of this.listPagingPage(
      resourceGroupName,
      workflowName,
      runName,
      actionName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * List the workflow run action scoped repetitions.
   * @param resourceGroupName The resource group name.
   * @param workflowName The workflow name.
   * @param runName The workflow run name.
   * @param actionName The workflow action name.
   * @param options The options parameters.
   */
  private _list(
    resourceGroupName: string,
    workflowName: string,
    runName: string,
    actionName: string,
    options?: WorkflowRunActionScopeRepetitionsListOptionalParams
  ): Promise<WorkflowRunActionScopeRepetitionsListResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, workflowName, runName, actionName, options },
      listOperationSpec
    );
  }

  /**
   * Get a workflow run action scoped repetition.
   * @param resourceGroupName The resource group name.
   * @param workflowName The workflow name.
   * @param runName The workflow run name.
   * @param actionName The workflow action name.
   * @param repetitionName The workflow repetition.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    workflowName: string,
    runName: string,
    actionName: string,
    repetitionName: string,
    options?: WorkflowRunActionScopeRepetitionsGetOptionalParams
  ): Promise<WorkflowRunActionScopeRepetitionsGetResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        workflowName,
        runName,
        actionName,
        repetitionName,
        options
      },
      getOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/runs/{runName}/actions/{actionName}/scopeRepetitions",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WorkflowRunActionRepetitionDefinitionCollection
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
    Parameters.actionName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/workflows/{workflowName}/runs/{runName}/actions/{actionName}/scopeRepetitions/{repetitionName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WorkflowRunActionRepetitionDefinition
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
    Parameters.actionName,
    Parameters.repetitionName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
