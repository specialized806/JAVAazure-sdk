/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  PolicyStatesSummarizeForPolicySetDefinitionOptionalParams,
  PolicyInsightsClient,
} from "@azure/arm-policyinsights";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Summarizes policy states for the subscription level policy set definition.
 *
 * @summary Summarizes policy states for the subscription level policy set definition.
 * x-ms-original-file: specification/policyinsights/resource-manager/Microsoft.PolicyInsights/stable/2024-10-01/examples/PolicyStates_SummarizeSubscriptionLevelPolicySetDefinitionScope.json
 */
async function summarizeAtPolicySetDefinitionScope(): Promise<void> {
  const policyStatesSummaryResource = "latest";
  const subscriptionId = "fffedd8f-ffff-fffd-fffd-fffed2f84852";
  const policySetDefinitionName = "3e3807c1-65c9-49e0-a406-82d8ae3e338c";
  const top = 1;
  const fromParam = new Date("2019-10-05T18:00:00Z");
  const to = new Date("2019-10-06T18:00:00Z");
  const filter = "PolicyDefinitionAction eq 'deny'";
  const options: PolicyStatesSummarizeForPolicySetDefinitionOptionalParams = {
    top,
    fromParam,
    to,
    filter,
  };
  const credential = new DefaultAzureCredential();
  const client = new PolicyInsightsClient(credential);
  const result = await client.policyStates.summarizeForPolicySetDefinition(
    policyStatesSummaryResource,
    subscriptionId,
    policySetDefinitionName,
    options,
  );
  console.log(result);
}

async function main(): Promise<void> {
  summarizeAtPolicySetDefinitionScope();
}

main().catch(console.error);
