/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  ConfigurationAssignmentsForSubscriptionsGetOptionalParams,
  ConfigurationAssignmentsForSubscriptionsGetResponse,
  ConfigurationAssignment,
  ConfigurationAssignmentsForSubscriptionsCreateOrUpdateOptionalParams,
  ConfigurationAssignmentsForSubscriptionsCreateOrUpdateResponse,
  ConfigurationAssignmentsForSubscriptionsUpdateOptionalParams,
  ConfigurationAssignmentsForSubscriptionsUpdateResponse,
  ConfigurationAssignmentsForSubscriptionsDeleteOptionalParams,
  ConfigurationAssignmentsForSubscriptionsDeleteResponse,
} from "../models/index.js";

/** Interface representing a ConfigurationAssignmentsForSubscriptions. */
export interface ConfigurationAssignmentsForSubscriptions {
  /**
   * Get configuration assignment for resource..
   * @param configurationAssignmentName Configuration assignment name
   * @param options The options parameters.
   */
  get(
    configurationAssignmentName: string,
    options?: ConfigurationAssignmentsForSubscriptionsGetOptionalParams,
  ): Promise<ConfigurationAssignmentsForSubscriptionsGetResponse>;
  /**
   * Register configuration for resource.
   * @param configurationAssignmentName Configuration assignment name
   * @param configurationAssignment The configurationAssignment
   * @param options The options parameters.
   */
  createOrUpdate(
    configurationAssignmentName: string,
    configurationAssignment: ConfigurationAssignment,
    options?: ConfigurationAssignmentsForSubscriptionsCreateOrUpdateOptionalParams,
  ): Promise<ConfigurationAssignmentsForSubscriptionsCreateOrUpdateResponse>;
  /**
   * Register configuration for resource.
   * @param configurationAssignmentName Configuration assignment name
   * @param configurationAssignment The configurationAssignment
   * @param options The options parameters.
   */
  update(
    configurationAssignmentName: string,
    configurationAssignment: ConfigurationAssignment,
    options?: ConfigurationAssignmentsForSubscriptionsUpdateOptionalParams,
  ): Promise<ConfigurationAssignmentsForSubscriptionsUpdateResponse>;
  /**
   * Unregister configuration for resource.
   * @param configurationAssignmentName Unique configuration assignment name
   * @param options The options parameters.
   */
  delete(
    configurationAssignmentName: string,
    options?: ConfigurationAssignmentsForSubscriptionsDeleteOptionalParams,
  ): Promise<ConfigurationAssignmentsForSubscriptionsDeleteResponse>;
}
