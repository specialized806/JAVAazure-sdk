/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  DataConnectorsCheckRequirementsUnion,
  DataConnectorsCheckRequirementsPostOptionalParams,
  DataConnectorsCheckRequirementsPostResponse
} from "../models/index.js";

/** Interface representing a DataConnectorsCheckRequirementsOperations. */
export interface DataConnectorsCheckRequirementsOperations {
  /**
   * Get requirements state for a data connector type.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param workspaceName The name of the workspace.
   * @param dataConnectorsCheckRequirements The parameters for requirements check message
   * @param options The options parameters.
   */
  post(
    resourceGroupName: string,
    workspaceName: string,
    dataConnectorsCheckRequirements: DataConnectorsCheckRequirementsUnion,
    options?: DataConnectorsCheckRequirementsPostOptionalParams
  ): Promise<DataConnectorsCheckRequirementsPostResponse>;
}
