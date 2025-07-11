// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CloudHealthClient } from "@azure/arm-cloudhealth";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to delete a AuthenticationSetting
 *
 * @summary delete a AuthenticationSetting
 * x-ms-original-file: 2025-05-01-preview/AuthenticationSettings_Delete.json
 */
async function authenticationSettingsDelete(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "00000000-0000-0000-0000-000000000000";
  const client = new CloudHealthClient(credential, subscriptionId);
  await client.authenticationSettings.delete(
    "my-resource-group",
    "my-health-model",
    "my-auth-setting",
  );
}

async function main(): Promise<void> {
  await authenticationSettingsDelete();
}

main().catch(console.error);
