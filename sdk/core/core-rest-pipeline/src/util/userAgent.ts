// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getHeaderName, setPlatformSpecificData } from "./userAgentPlatform.js";
import { SDK_VERSION } from "../constants.js";

function getUserAgentString(telemetryInfo: Map<string, string>): string {
  const parts: string[] = [];
  for (const [key, value] of telemetryInfo) {
    const token = value ? `${key}/${value}` : key;
    parts.push(token);
  }
  return parts.join(" ");
}

/**
 * @internal
 */
export function getUserAgentHeaderName(): string {
  return getHeaderName();
}

/**
 * @internal
 */
export async function getUserAgentValue(prefix?: string): Promise<string> {
  const runtimeInfo = new Map<string, string>();
  runtimeInfo.set("core-rest-pipeline", SDK_VERSION);
  await setPlatformSpecificData(runtimeInfo);
  const defaultAgent = getUserAgentString(runtimeInfo);
  const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
  return userAgentValue;
}
