/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { DeploymentStacksClient } from "@azure/arm-resourcesdeploymentstacks";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Gets a Deployment stack with a given name at Resource Group scope.
 *
 * @summary Gets a Deployment stack with a given name at Resource Group scope.
 * x-ms-original-file: specification/resources/resource-manager/Microsoft.Resources/stable/2024-03-01/examples/DeploymentStackResourceGroupGet.json
 */
async function deploymentStacksResourceGroupGet(): Promise<void> {
  const subscriptionId =
    process.env["RESOURCESDEPLOYMENTSTACKS_SUBSCRIPTION_ID"] ||
    "00000000-0000-0000-0000-000000000000";
  const resourceGroupName =
    process.env["RESOURCESDEPLOYMENTSTACKS_RESOURCE_GROUP"] ||
    "deploymentStacksRG";
  const deploymentStackName = "simpleDeploymentStack";
  const credential = new DefaultAzureCredential();
  const client = new DeploymentStacksClient(credential, subscriptionId);
  const result = await client.deploymentStacks.getAtResourceGroup(
    resourceGroupName,
    deploymentStackName,
  );
  console.log(result);
}

async function main(): Promise<void> {
  deploymentStacksResourceGroupGet();
}

main().catch(console.error);
