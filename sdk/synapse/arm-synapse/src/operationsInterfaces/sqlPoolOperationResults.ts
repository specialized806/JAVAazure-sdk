/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PollerLike, PollOperationState } from "@azure/core-lro";
import {
  SqlPoolOperationResultsGetLocationHeaderResultOptionalParams,
  SqlPoolOperationResultsGetLocationHeaderResultResponse
} from "../models/index.js";

/** Interface representing a SqlPoolOperationResults. */
export interface SqlPoolOperationResults {
  /**
   * Get the status of a SQL pool operation
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param sqlPoolName SQL pool name
   * @param operationId Operation ID
   * @param options The options parameters.
   */
  beginGetLocationHeaderResult(
    resourceGroupName: string,
    workspaceName: string,
    sqlPoolName: string,
    operationId: string,
    options?: SqlPoolOperationResultsGetLocationHeaderResultOptionalParams
  ): Promise<
    PollerLike<
      PollOperationState<
        SqlPoolOperationResultsGetLocationHeaderResultResponse
      >,
      SqlPoolOperationResultsGetLocationHeaderResultResponse
    >
  >;
  /**
   * Get the status of a SQL pool operation
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param sqlPoolName SQL pool name
   * @param operationId Operation ID
   * @param options The options parameters.
   */
  beginGetLocationHeaderResultAndWait(
    resourceGroupName: string,
    workspaceName: string,
    sqlPoolName: string,
    operationId: string,
    options?: SqlPoolOperationResultsGetLocationHeaderResultOptionalParams
  ): Promise<SqlPoolOperationResultsGetLocationHeaderResultResponse>;
}
