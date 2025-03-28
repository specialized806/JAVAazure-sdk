/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MicrosoftResourceHealth } from "@azure/arm-resourcehealth";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Gets Azure services' emerging issues.
 *
 * @summary Gets Azure services' emerging issues.
 * x-ms-original-file: specification/resourcehealth/resource-manager/Microsoft.ResourceHealth/stable/2022-10-01/examples/EmergingIssues_Get.json
 */
async function getEmergingIssues(): Promise<void> {
  const subscriptionId =
    process.env["RESOURCEHEALTH_SUBSCRIPTION_ID"] ||
    "00000000-0000-0000-0000-000000000000";
  const issueName = "default";
  const credential = new DefaultAzureCredential();
  const client = new MicrosoftResourceHealth(credential, subscriptionId);
  const result = await client.emergingIssues.get(issueName);
  console.log(result);
}

async function main(): Promise<void> {
  getEmergingIssues();
}

main().catch(console.error);
