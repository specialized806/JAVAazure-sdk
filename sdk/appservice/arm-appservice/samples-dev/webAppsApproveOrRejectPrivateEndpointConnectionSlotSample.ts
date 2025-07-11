/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  RemotePrivateEndpointConnectionARMResource,
  WebSiteManagementClient,
} from "@azure/arm-appservice";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Description for Approves or rejects a private endpoint connection
 *
 * @summary Description for Approves or rejects a private endpoint connection
 * x-ms-original-file: specification/web/resource-manager/Microsoft.Web/stable/2024-11-01/examples/ApproveRejectSitePrivateEndpointConnectionSlot.json
 */
async function approvesOrRejectsAPrivateEndpointConnectionForASite(): Promise<void> {
  const subscriptionId =
    process.env["APPSERVICE_SUBSCRIPTION_ID"] ||
    "34adfa4f-cedf-4dc0-ba29-b6d1a69ab345";
  const resourceGroupName = process.env["APPSERVICE_RESOURCE_GROUP"] || "rg";
  const name = "testSite";
  const privateEndpointConnectionName = "connection";
  const slot = "stage";
  const privateEndpointWrapper: RemotePrivateEndpointConnectionARMResource = {
    privateLinkServiceConnectionState: {
      description: "Approved by admin.",
      actionsRequired: "",
      status: "Approved",
    },
  };
  const credential = new DefaultAzureCredential();
  const client = new WebSiteManagementClient(credential, subscriptionId);
  const result =
    await client.webApps.beginApproveOrRejectPrivateEndpointConnectionSlotAndWait(
      resourceGroupName,
      name,
      privateEndpointConnectionName,
      slot,
      privateEndpointWrapper,
    );
  console.log(result);
}

async function main(): Promise<void> {
  await approvesOrRejectsAPrivateEndpointConnectionForASite();
}

main().catch(console.error);
