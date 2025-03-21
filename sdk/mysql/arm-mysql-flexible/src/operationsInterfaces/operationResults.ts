/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  OperationResultsGetOptionalParams,
  OperationResultsGetResponse,
} from "../models/index.js";

/** Interface representing a OperationResults. */
export interface OperationResults {
  /**
   * Get the operation result for a long running operation.
   * @param locationName The name of the location.
   * @param operationId The operation Id.
   * @param options The options parameters.
   */
  get(
    locationName: string,
    operationId: string,
    options?: OperationResultsGetOptionalParams,
  ): Promise<OperationResultsGetResponse>;
}
