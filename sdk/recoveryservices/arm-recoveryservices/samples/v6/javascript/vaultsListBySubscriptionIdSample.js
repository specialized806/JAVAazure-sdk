/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

const { RecoveryServicesClient } = require("@azure/arm-recoveryservices");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv/config");

/**
 * This sample demonstrates how to Fetches all the resources of the specified type in the subscription.
 *
 * @summary Fetches all the resources of the specified type in the subscription.
 * x-ms-original-file: specification/recoveryservices/resource-manager/Microsoft.RecoveryServices/stable/2025-02-01/examples/ListBySubscriptionIds.json
 */
async function listOfRecoveryServicesResourcesInSubscriptionId() {
  const subscriptionId =
    process.env["RECOVERYSERVICES_SUBSCRIPTION_ID"] || "77777777-b0c6-47a2-b37c-d8e65a629c18";
  const credential = new DefaultAzureCredential();
  const client = new RecoveryServicesClient(credential, subscriptionId);
  const resArray = new Array();
  for await (const item of client.vaults.listBySubscriptionId()) {
    resArray.push(item);
  }
  console.log(resArray);
}

async function main() {
  await listOfRecoveryServicesResourcesInSubscriptionId();
}

main().catch(console.error);
