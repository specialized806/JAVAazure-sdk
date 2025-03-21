// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { VirtualMachinesListParameters } from "@azure-rest/arm-compute";
import createComputeManagementClient, { paginate } from "@azure-rest/arm-compute";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Lists all of the virtual machines in the specified resource group. Use the nextLink property in the response to get the next page of virtual machines.
 *
 * @summary Lists all of the virtual machines in the specified resource group. Use the nextLink property in the response to get the next page of virtual machines.
 * x-ms-original-file: specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-08-01/examples/virtualMachineExamples/VirtualMachines_List_MaximumSet_Gen.json
 */
async function virtualMachinesListMaximumSetGen(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const client = createComputeManagementClient(credential);
  const subscriptionId = "";
  const resourceGroupName = "rgcompute";
  const options: VirtualMachinesListParameters = {
    queryParameters: {
      $filter: "aaaaaaaaaaaaaaaaaaaaaaa",
      "api-version": "2022-08-01",
    },
  };
  const initialResponse = await client
    .path(
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines",
      subscriptionId,
      resourceGroupName,
    )
    .get(options);
  const pageData = paginate(client, initialResponse);
  const result = [];
  for await (const item of pageData) {
    result.push(item);
  }
  console.log(result);
}

virtualMachinesListMaximumSetGen().catch(console.error);
/**
 * This sample demonstrates how to Lists all of the virtual machines in the specified resource group. Use the nextLink property in the response to get the next page of virtual machines.
 *
 * @summary Lists all of the virtual machines in the specified resource group. Use the nextLink property in the response to get the next page of virtual machines.
 * x-ms-original-file: specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-08-01/examples/virtualMachineExamples/VirtualMachines_List_MinimumSet_Gen.json
 */
async function virtualMachinesListMinimumSetGen(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const client = createComputeManagementClient(credential);
  const subscriptionId = "";
  const resourceGroupName = "rgcompute";
  const options: VirtualMachinesListParameters = {
    queryParameters: { "api-version": "2022-08-01" },
  };
  const initialResponse = await client
    .path(
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines",
      subscriptionId,
      resourceGroupName,
    )
    .get(options);
  const pageData = paginate(client, initialResponse);
  const result = [];
  for await (const item of pageData) {
    result.push(item);
  }
  console.log(result);
}

virtualMachinesListMinimumSetGen().catch(console.error);
