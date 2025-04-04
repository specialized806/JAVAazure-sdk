/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { StorageMoverClient } from "@azure/arm-storagemover";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Gets a Job Definition resource.
 *
 * @summary Gets a Job Definition resource.
 * x-ms-original-file: specification/storagemover/resource-manager/Microsoft.StorageMover/stable/2024-07-01/examples/JobDefinitions_Get.json
 */
async function jobDefinitionsGet(): Promise<void> {
  const subscriptionId =
    process.env["STORAGEMOVER_SUBSCRIPTION_ID"] ||
    "60bcfc77-6589-4da2-b7fd-f9ec9322cf95";
  const resourceGroupName =
    process.env["STORAGEMOVER_RESOURCE_GROUP"] || "examples-rg";
  const storageMoverName = "examples-storageMoverName";
  const projectName = "examples-projectName";
  const jobDefinitionName = "examples-jobDefinitionName";
  const credential = new DefaultAzureCredential();
  const client = new StorageMoverClient(credential, subscriptionId);
  const result = await client.jobDefinitions.get(
    resourceGroupName,
    storageMoverName,
    projectName,
    jobDefinitionName,
  );
  console.log(result);
}

async function main(): Promise<void> {
  jobDefinitionsGet();
}

main().catch(console.error);
