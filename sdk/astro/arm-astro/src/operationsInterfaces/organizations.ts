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
  OrganizationResource,
  OrganizationsListBySubscriptionOptionalParams,
  OrganizationsListByResourceGroupOptionalParams,
  OrganizationsGetOptionalParams,
  OrganizationsGetResponse,
  OrganizationsCreateOrUpdateOptionalParams,
  OrganizationsCreateOrUpdateResponse,
  OrganizationResourceUpdate,
  OrganizationsUpdateOptionalParams,
  OrganizationsUpdateResponse,
  OrganizationsDeleteOptionalParams,
  OrganizationsDeleteResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Organizations. */
export interface Organizations {
  /**
   * List OrganizationResource resources by subscription ID
   * @param options The options parameters.
   */
  listBySubscription(
    options?: OrganizationsListBySubscriptionOptionalParams,
  ): PagedAsyncIterableIterator<OrganizationResource>;
  /**
   * List OrganizationResource resources by resource group
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  listByResourceGroup(
    resourceGroupName: string,
    options?: OrganizationsListByResourceGroupOptionalParams,
  ): PagedAsyncIterableIterator<OrganizationResource>;
  /**
   * Get a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    organizationName: string,
    options?: OrganizationsGetOptionalParams,
  ): Promise<OrganizationsGetResponse>;
  /**
   * Create a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param resource Resource create parameters.
   * @param options The options parameters.
   */
  beginCreateOrUpdate(
    resourceGroupName: string,
    organizationName: string,
    resource: OrganizationResource,
    options?: OrganizationsCreateOrUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<OrganizationsCreateOrUpdateResponse>,
      OrganizationsCreateOrUpdateResponse
    >
  >;
  /**
   * Create a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param resource Resource create parameters.
   * @param options The options parameters.
   */
  beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    organizationName: string,
    resource: OrganizationResource,
    options?: OrganizationsCreateOrUpdateOptionalParams,
  ): Promise<OrganizationsCreateOrUpdateResponse>;
  /**
   * Update a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param properties The resource properties to be updated.
   * @param options The options parameters.
   */
  beginUpdate(
    resourceGroupName: string,
    organizationName: string,
    properties: OrganizationResourceUpdate,
    options?: OrganizationsUpdateOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<OrganizationsUpdateResponse>,
      OrganizationsUpdateResponse
    >
  >;
  /**
   * Update a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param properties The resource properties to be updated.
   * @param options The options parameters.
   */
  beginUpdateAndWait(
    resourceGroupName: string,
    organizationName: string,
    properties: OrganizationResourceUpdate,
    options?: OrganizationsUpdateOptionalParams,
  ): Promise<OrganizationsUpdateResponse>;
  /**
   * Delete a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param options The options parameters.
   */
  beginDelete(
    resourceGroupName: string,
    organizationName: string,
    options?: OrganizationsDeleteOptionalParams,
  ): Promise<
    SimplePollerLike<
      OperationState<OrganizationsDeleteResponse>,
      OrganizationsDeleteResponse
    >
  >;
  /**
   * Delete a OrganizationResource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param organizationName Name of the Organizations resource
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceGroupName: string,
    organizationName: string,
    options?: OrganizationsDeleteOptionalParams,
  ): Promise<OrganizationsDeleteResponse>;
}
