/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  env,
  Recorder,
  RecorderStartOptions,
  delay,
  isPlaybackMode,
} from "@azure-tools/test-recorder";
import { createTestCredential } from "@azure-tools/test-credential";
import { assert } from "chai";
import { Context } from "mocha";
import { AzureMapsManagementClient } from "../src/azureMapsManagementClient";

const replaceableVariables: Record<string, string> = {
  AZURE_CLIENT_ID: "azure_client_id",
  AZURE_CLIENT_SECRET: "azure_client_secret",
  AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
  SUBSCRIPTION_ID: "azure_subscription_id"
};

const recorderOptions: RecorderStartOptions = {
  envSetupForPlayback: replaceableVariables,
  removeCentralSanitizers: [
    "AZSDK3493", // .name in the body is not a secret and is listed below in the beforeEach section
    "AZSDK3430", // .id in the body is not a secret and is listed below in the beforeEach section
  ],
};

export const testPollingOptions = {
  updateIntervalInMs: isPlaybackMode() ? 0 : undefined,
};

describe("maps test", () => {
  let recorder: Recorder;
  let subscriptionId: string;
  let client: AzureMapsManagementClient;
  let location: string;
  let resourceGroup: string;
  let resourcename: string;

  beforeEach(async function (this: Context) {
    recorder = new Recorder(this.currentTest);
    await recorder.start(recorderOptions);
    subscriptionId = env.SUBSCRIPTION_ID || '';
    // This is an example of how the environment variables are used
    const credential = createTestCredential();
    client = new AzureMapsManagementClient(credential, subscriptionId, recorder.configureClientOptions({}));
    location = "eastus";
    resourceGroup = "myjstest";
    resourcename = "resourcetest";

  });

  afterEach(async function () {
    await recorder.stop();
  });

  it("accounts create test", async function () {
    const res = await client.accounts.createOrUpdate(
      resourceGroup,
      resourcename,
      {
        identity: {
          type: "SystemAssigned"
        },
        kind: "Gen2",
        location,
        properties: {
          disableLocalAuth: false,
          linkedResources: [
            {
              id:
                "/subscriptions/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/providers/Microsoft.Storage/storageAccounts/czwtestaccount230808",
              uniqueName: "myBatchStorageAccount"
            },
            {
              id:
                "/subscriptions/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/providers/Microsoft.Storage/storageAccounts/czwtestaccount230808",
              uniqueName: "myBlobDataSource"
            }
          ]
        },
        sku: { name: "G2" },
        tags: { test: "true" }
      });
    assert.equal(res.name, resourcename);
  });

  it("accounts get test", async function () {
    const res = await client.accounts.get(resourceGroup,
      resourcename);
    assert.equal(res.name, resourcename);
  });

  it("accounts list test", async function () {
    const resArray = new Array();
    for await (let item of client.accounts.listByResourceGroup(resourceGroup)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 1);
  });

  //should run this case several minutes later
  it("accounts delete test", async function () {
    const resArray = new Array();
    const res = await client.accounts.delete(resourceGroup, resourcename
    )
    for await (let item of client.accounts.listByResourceGroup(resourceGroup)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 0);
  });
})
