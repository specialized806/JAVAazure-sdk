// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { AccessToken, TokenCredential } from "@azure/core-auth";
import { credentialLogger, formatError } from "../util/logging.js";

const BrowserNotSupportedError = new Error(
  "AzurePowerShellCredential is not supported in the browser.",
);
const logger = credentialLogger("AzurePowerShellCredential");

/**
 * This credential will use the currently-logged-in user's login information via the Azure Power Shell command line tool.
 */
export class AzurePowerShellCredential implements TokenCredential {
  /**
   * Only available in Node.js
   */
  constructor() {
    logger.info(formatError("", BrowserNotSupportedError));
    throw BrowserNotSupportedError;
  }

  getToken(): Promise<AccessToken | null> {
    logger.getToken.info(formatError("", BrowserNotSupportedError));
    throw BrowserNotSupportedError;
  }
}
