// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { AdminRulesCreateOrUpdateParameters } from "@azure-rest/arm-network";
import createNetworkManagementClient from "@azure-rest/arm-network";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Creates or updates an admin rule.
 *
 * @summary Creates or updates an admin rule.
 * x-ms-original-file: specification/network/resource-manager/Microsoft.Network/stable/2022-05-01/examples/NetworkManagerDefaultAdminRulePut.json
 */
async function createADefaultAdminRule(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const client = createNetworkManagementClient(credential);
  const subscriptionId = "";
  const resourceGroupName = "rg1";
  const networkManagerName = "testNetworkManager";
  const configurationName = "myTestSecurityConfig";
  const ruleCollectionName = "testRuleCollection";
  const ruleName = "SampleDefaultAdminRule";
  const options: AdminRulesCreateOrUpdateParameters = {
    body: { kind: "Default", properties: { flag: "AllowVnetInbound" } },
    queryParameters: { "api-version": "2022-05-01" },
  };
  const result = await client
    .path(
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/securityAdminConfigurations/{configurationName}/ruleCollections/{ruleCollectionName}/rules/{ruleName}",
      subscriptionId,
      resourceGroupName,
      networkManagerName,
      configurationName,
      ruleCollectionName,
      ruleName,
    )
    .put(options);
  console.log(result);
}

createADefaultAdminRule().catch(console.error);
/**
 * This sample demonstrates how to Creates or updates an admin rule.
 *
 * @summary Creates or updates an admin rule.
 * x-ms-original-file: specification/network/resource-manager/Microsoft.Network/stable/2022-05-01/examples/NetworkManagerAdminRulePut.json
 */
async function createAnAdminRule(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const client = createNetworkManagementClient(credential);
  const subscriptionId = "";
  const resourceGroupName = "rg1";
  const networkManagerName = "testNetworkManager";
  const configurationName = "myTestSecurityConfig";
  const ruleCollectionName = "testRuleCollection";
  const ruleName = "SampleAdminRule";
  const options: AdminRulesCreateOrUpdateParameters = {
    body: {
      kind: "Custom",
      properties: {
        description: "This is Sample Admin Rule",
        access: "Deny",
        destinationPortRanges: ["22"],
        destinations: [{ addressPrefix: "*", addressPrefixType: "IPPrefix" }],
        direction: "Inbound",
        priority: 1,
        sourcePortRanges: ["0-65535"],
        sources: [{ addressPrefix: "Internet", addressPrefixType: "ServiceTag" }],
        protocol: "Tcp",
      },
    },
    queryParameters: { "api-version": "2022-05-01" },
  };
  const result = await client
    .path(
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkManagers/{networkManagerName}/securityAdminConfigurations/{configurationName}/ruleCollections/{ruleCollectionName}/rules/{ruleName}",
      subscriptionId,
      resourceGroupName,
      networkManagerName,
      configurationName,
      ruleCollectionName,
      ruleName,
    )
    .put(options);
  console.log(result);
}

createAnAdminRule().catch(console.error);
