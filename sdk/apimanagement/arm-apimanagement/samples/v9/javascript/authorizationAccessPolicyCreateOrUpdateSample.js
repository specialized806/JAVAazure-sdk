/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { ApiManagementClient } = require("@azure/arm-apimanagement");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

/**
 * This sample demonstrates how to Creates or updates Authorization Access Policy.
 *
 * @summary Creates or updates Authorization Access Policy.
 * x-ms-original-file: specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2022-08-01/examples/ApiManagementCreateAuthorizationAccessPolicy.json
 */
async function apiManagementCreateAuthorizationAccessPolicy() {
  const subscriptionId = process.env["APIMANAGEMENT_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["APIMANAGEMENT_RESOURCE_GROUP"] || "rg1";
  const serviceName = "apimService1";
  const authorizationProviderId = "aadwithauthcode";
  const authorizationId = "authz1";
  const authorizationAccessPolicyId = "fe0bed83-631f-4149-bd0b-0464b1bc7cab";
  const parameters = {
    objectId: "fe0bed83-631f-4149-bd0b-0464b1bc7cab",
    tenantId: "13932a0d-5c63-4d37-901d-1df9c97722ff",
  };
  const credential = new DefaultAzureCredential();
  const client = new ApiManagementClient(credential, subscriptionId);
  const result = await client.authorizationAccessPolicy.createOrUpdate(
    resourceGroupName,
    serviceName,
    authorizationProviderId,
    authorizationId,
    authorizationAccessPolicyId,
    parameters
  );
  console.log(result);
}

async function main() {
  apiManagementCreateAuthorizationAccessPolicy();
}

main().catch(console.error);