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
import type {
  DetectedLanguage,
  DocumentLanguage,
  TextAnalyticsError,
} from "./generated/models/index.js";

/**
 * The result of the detect language operation on a single document.
 */
export type DetectLanguageResult = DetectLanguageSuccessResult | DetectLanguageErrorResult;

/**
 * The result of the detect language operation on a single document,
 * containing a prediction of what language the document is written in.
 */
export interface DetectLanguageSuccessResult extends TextAnalyticsSuccessResult {
  /**
   * The top detected language by confidence score.
   */
  readonly primaryLanguage: DetectedLanguage;
}

/**
 * An error result from the detect languge operation on a single document.
 */
export type DetectLanguageErrorResult = TextAnalyticsErrorResult;

/**
 * @internal
 */
export function makeDetectLanguageResult(response: DocumentLanguage): DetectLanguageSuccessResult {
  const { id, warnings, statistics, detectedLanguage } = response;
  return {
    ...makeTextAnalyticsSuccessResult(id, warnings, statistics),
    primaryLanguage: detectedLanguage,
  };
}

/**
 * @internal
 */
export function makeDetectLanguageErrorResult(
  id: string,
  error: TextAnalyticsError,
): DetectLanguageErrorResult {
  return makeTextAnalyticsErrorResult(id, error);
}
