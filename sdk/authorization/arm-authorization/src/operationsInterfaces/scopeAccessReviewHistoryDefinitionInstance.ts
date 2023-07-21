/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  ScopeAccessReviewHistoryDefinitionInstanceGenerateDownloadUriOptionalParams,
  ScopeAccessReviewHistoryDefinitionInstanceGenerateDownloadUriResponse
} from "../models";

/** Interface representing a ScopeAccessReviewHistoryDefinitionInstance. */
export interface ScopeAccessReviewHistoryDefinitionInstance {
  /**
   * Generates a uri which can be used to retrieve review history data. This URI has a TTL of 1 day and
   * can be retrieved by fetching the accessReviewHistoryDefinition object.
   * @param scope The scope of the resource.
   * @param historyDefinitionId The id of the access review history definition.
   * @param instanceId The id of the access review history definition instance to generate a URI for.
   * @param options The options parameters.
   */
  generateDownloadUri(
    scope: string,
    historyDefinitionId: string,
    instanceId: string,
    options?: ScopeAccessReviewHistoryDefinitionInstanceGenerateDownloadUriOptionalParams
  ): Promise<
    ScopeAccessReviewHistoryDefinitionInstanceGenerateDownloadUriResponse
  >;
}