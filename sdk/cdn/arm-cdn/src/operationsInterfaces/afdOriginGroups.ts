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
  AFDOriginGroup,
  AfdOriginGroupsListByProfileOptionalParams,
  Usage,
  AfdOriginGroupsListResourceUsageOptionalParams,
  AfdOriginGroupsGetOptionalParams,
  AfdOriginGroupsGetResponse,
  AfdOriginGroupsCreateOptionalParams,
  AfdOriginGroupsCreateResponse,
  AFDOriginGroupUpdateParameters,
  AfdOriginGroupsUpdateOptionalParams,
  AfdOriginGroupsUpdateResponse,
  AfdOriginGroupsDeleteOptionalParams,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a AfdOriginGroups. */
export interface AfdOriginGroups {
  /**
   * Lists all of the existing origin groups within a profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param options The options parameters.
   */
  listByProfile(
    resourceGroupName: string,
    profileName: string,
    options?: AfdOriginGroupsListByProfileOptionalParams,
  ): PagedAsyncIterableIterator<AFDOriginGroup>;
  /**
   * Checks the quota and actual usage of endpoints under the given Azure Front Door profile..
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the endpoint.
   * @param options The options parameters.
   */
  listResourceUsage(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    options?: AfdOriginGroupsListResourceUsageOptionalParams,
  ): PagedAsyncIterableIterator<Usage>;
  /**
   * Gets an existing origin group within a profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the endpoint.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    options?: AfdOriginGroupsGetOptionalParams,
  ): Promise<AfdOriginGroupsGetResponse>;
  /**
   * Creates a new origin group within the specified profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the endpoint.
   * @param originGroup Origin group properties
   * @param options The options parameters.
   */
  beginCreate(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    originGroup: AFDOriginGroup,
    options?: AfdOriginGroupsCreateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<AfdOriginGroupsCreateResponse>,
      AfdOriginGroupsCreateResponse
    >
  >;
  /**
   * Creates a new origin group within the specified profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the endpoint.
   * @param originGroup Origin group properties
   * @param options The options parameters.
   */
  beginCreateAndWait(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    originGroup: AFDOriginGroup,
    options?: AfdOriginGroupsCreateOptionalParams,
  ): Promise<AfdOriginGroupsCreateResponse>;
  /**
   * Updates an existing origin group within a profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the profile.
   * @param originGroupUpdateProperties Origin group properties
   * @param options The options parameters.
   */
  beginUpdate(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    originGroupUpdateProperties: AFDOriginGroupUpdateParameters,
    options?: AfdOriginGroupsUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<AfdOriginGroupsUpdateResponse>,
      AfdOriginGroupsUpdateResponse
    >
  >;
  /**
   * Updates an existing origin group within a profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the profile.
   * @param originGroupUpdateProperties Origin group properties
   * @param options The options parameters.
   */
  beginUpdateAndWait(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    originGroupUpdateProperties: AFDOriginGroupUpdateParameters,
    options?: AfdOriginGroupsUpdateOptionalParams,
  ): Promise<AfdOriginGroupsUpdateResponse>;
  /**
   * Deletes an existing origin group within a profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the profile.
   * @param options The options parameters.
   */
  beginDelete(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    options?: AfdOriginGroupsDeleteOptionalParams,
  ): Promise<SimplePollerLike<OperationState<void>, void>>;
  /**
   * Deletes an existing origin group within a profile.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param profileName Name of the Azure Front Door Standard or Azure Front Door Premium profile which
   *                    is unique within the resource group.
   * @param originGroupName Name of the origin group which is unique within the profile.
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceGroupName: string,
    profileName: string,
    originGroupName: string,
    options?: AfdOriginGroupsDeleteOptionalParams,
  ): Promise<void>;
}
