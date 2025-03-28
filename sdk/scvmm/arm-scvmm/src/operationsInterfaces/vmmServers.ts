/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { SimplePollerLike, OperationState } from "@azure/core-lro";
import {
  VmmServer,
  VmmServersListBySubscriptionOptionalParams,
  VmmServersListByResourceGroupOptionalParams,
  VmmServersGetOptionalParams,
  VmmServersGetResponse,
  VmmServersCreateOrUpdateOptionalParams,
  VmmServersCreateOrUpdateResponse,
  VmmServerTagsUpdate,
  VmmServersUpdateOptionalParams,
  VmmServersUpdateResponse,
  VmmServersDeleteOptionalParams,
  VmmServersDeleteResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a VmmServers. */
export interface VmmServers {
  /**
   * List of VmmServers in a subscription.
   * @param options The options parameters.
   */
  listBySubscription(
    options?: VmmServersListBySubscriptionOptionalParams,
  ): PagedAsyncIterableIterator<VmmServer>;
  /**
   * List of VmmServers in a resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  listByResourceGroup(
    resourceGroupName: string,
    options?: VmmServersListByResourceGroupOptionalParams,
  ): PagedAsyncIterableIterator<VmmServer>;
  /**
   * Implements VmmServer GET method.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    vmmServerName: string,
    options?: VmmServersGetOptionalParams,
  ): Promise<VmmServersGetResponse>;
  /**
   * Onboards the SCVmm fabric as an Azure VmmServer resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param resource Resource create parameters.
   * @param options The options parameters.
   */
  beginCreateOrUpdate(
    resourceGroupName: string,
    vmmServerName: string,
    resource: VmmServer,
    options?: VmmServersCreateOrUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<VmmServersCreateOrUpdateResponse>,
      VmmServersCreateOrUpdateResponse
    >
  >;
  /**
   * Onboards the SCVmm fabric as an Azure VmmServer resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param resource Resource create parameters.
   * @param options The options parameters.
   */
  beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    vmmServerName: string,
    resource: VmmServer,
    options?: VmmServersCreateOrUpdateOptionalParams,
  ): Promise<VmmServersCreateOrUpdateResponse>;
  /**
   * Updates the VmmServers resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param properties The resource properties to be updated.
   * @param options The options parameters.
   */
  beginUpdate(
    resourceGroupName: string,
    vmmServerName: string,
    properties: VmmServerTagsUpdate,
    options?: VmmServersUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<VmmServersUpdateResponse>,
      VmmServersUpdateResponse
    >
  >;
  /**
   * Updates the VmmServers resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param properties The resource properties to be updated.
   * @param options The options parameters.
   */
  beginUpdateAndWait(
    resourceGroupName: string,
    vmmServerName: string,
    properties: VmmServerTagsUpdate,
    options?: VmmServersUpdateOptionalParams,
  ): Promise<VmmServersUpdateResponse>;
  /**
   * Removes the SCVmm fabric from Azure.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param options The options parameters.
   */
  beginDelete(
    resourceGroupName: string,
    vmmServerName: string,
    options?: VmmServersDeleteOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<VmmServersDeleteResponse>,
      VmmServersDeleteResponse
    >
  >;
  /**
   * Removes the SCVmm fabric from Azure.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param vmmServerName Name of the VmmServer.
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceGroupName: string,
    vmmServerName: string,
    options?: VmmServersDeleteOptionalParams,
  ): Promise<VmmServersDeleteResponse>;
}
