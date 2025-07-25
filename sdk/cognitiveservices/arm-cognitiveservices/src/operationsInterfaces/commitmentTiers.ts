/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  CommitmentTier,
  CommitmentTiersListOptionalParams,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a CommitmentTiers. */
export interface CommitmentTiers {
  /**
   * List Commitment Tiers.
   * @param location Resource location.
   * @param options The options parameters.
   */
  list(
    location: string,
    options?: CommitmentTiersListOptionalParams,
  ): PagedAsyncIterableIterator<CommitmentTier>;
}
