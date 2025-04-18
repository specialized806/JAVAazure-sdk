// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  TextAnalyticsErrorResult,
  TextAnalyticsSuccessResult,
} from "./textAnalyticsResult.js";
import {
  makeTextAnalyticsErrorResult,
  makeTextAnalyticsSuccessResult,
} from "./textAnalyticsResult.js";
import type { DocumentKeyPhrases, TextAnalyticsError } from "./generated/models/index.js";

/**
 * The result of the extract key phrases operation on a single document.
 */
export type ExtractKeyPhrasesResult = ExtractKeyPhrasesSuccessResult | ExtractKeyPhrasesErrorResult;

/**
 * The result of the extract key phrases operation on a single document,
 * containing a collection of the key phrases identified in that document.
 */
export interface ExtractKeyPhrasesSuccessResult extends TextAnalyticsSuccessResult {
  /**
   * A list of representative words or phrases. The number of key phrases returned is proportional
   * to the number of words in the input document.
   */
  keyPhrases: string[];
}

/**
 * An error result from the extract key phrases operation on a single document.
 */
export type ExtractKeyPhrasesErrorResult = TextAnalyticsErrorResult;

/**
 * @internal
 */
export function makeExtractKeyPhrasesResult(
  result: DocumentKeyPhrases,
): ExtractKeyPhrasesSuccessResult {
  const { id, warnings, statistics, keyPhrases } = result;
  return {
    ...makeTextAnalyticsSuccessResult(id, warnings, statistics),
    keyPhrases,
  };
}

/**
 * @internal
 */
export function makeExtractKeyPhrasesErrorResult(
  id: string,
  error: TextAnalyticsError,
): ExtractKeyPhrasesErrorResult {
  return makeTextAnalyticsErrorResult(id, error);
}
