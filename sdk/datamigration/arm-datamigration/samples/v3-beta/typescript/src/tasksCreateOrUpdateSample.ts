/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  ProjectTask,
  DataMigrationManagementClient,
} from "@azure/arm-datamigration";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to The tasks resource is a nested, proxy-only resource representing work performed by a DMS (classic) instance. The PUT method creates a new task or updates an existing one, although since tasks have no mutable custom properties, there is little reason to update an existing one.
 *
 * @summary The tasks resource is a nested, proxy-only resource representing work performed by a DMS (classic) instance. The PUT method creates a new task or updates an existing one, although since tasks have no mutable custom properties, there is little reason to update an existing one.
 * x-ms-original-file: specification/datamigration/resource-manager/Microsoft.DataMigration/preview/2025-03-15-preview/examples/Tasks_CreateOrUpdate.json
 */
async function tasksCreateOrUpdate(): Promise<void> {
  const subscriptionId =
    process.env["DATAMIGRATION_SUBSCRIPTION_ID"] ||
    "fc04246f-04c5-437e-ac5e-206a19e7193f";
  const groupName = "DmsSdkRg";
  const serviceName = "DmsSdkService";
  const projectName = "DmsSdkProject";
  const taskName = "DmsSdkTask";
  const parameters: ProjectTask = {
    properties: {
      input: {
        targetConnectionInfo: {
          type: "SqlConnectionInfo",
          authentication: "SqlAuthentication",
          dataSource: "ssma-test-server.database.windows.net",
          encryptConnection: true,
          password: "testpassword",
          trustServerCertificate: true,
          userName: "testuser",
        },
      },
      taskType: "ConnectToTarget.SqlDb",
    },
  };
  const credential = new DefaultAzureCredential();
  const client = new DataMigrationManagementClient(credential, subscriptionId);
  const result = await client.tasks.createOrUpdate(
    groupName,
    serviceName,
    projectName,
    taskName,
    parameters,
  );
  console.log(result);
}

async function main(): Promise<void> {
  await tasksCreateOrUpdate();
}

main().catch(console.error);
