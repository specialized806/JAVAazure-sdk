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
  isPlaybackMode,
} from "@azure-tools/test-recorder";
import { createTestCredential } from "@azure-tools/test-credential";
import { describe, it, assert, beforeEach, afterEach } from "vitest";
import { DeploymentsClient } from "../src/deploymentsClient.js";

const replaceableVariables: Record<string, string> = {
  SUBSCRIPTION_ID: "88888888-8888-8888-8888-888888888888"
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

describe("Deployments test", () => {
  let recorder: Recorder;
  let subscriptionId: string;
  let client: DeploymentsClient;

  beforeEach(async (ctx) => {
    recorder = new Recorder(ctx);
    await recorder.start(recorderOptions);
    subscriptionId = env.SUBSCRIPTION_ID || '';
    // This is an example of how the environment variables are used
    const credential = createTestCredential();
    client = new DeploymentsClient(credential, subscriptionId, recorder.configureClientOptions({}));
  });

  afterEach(async () => {
    await recorder.stop();
  });

  it("deployments calculateTemplateHash test", async function () {
    const template: Record<string, unknown> = {
      $schema:
        "http://schemas.management.azure.com/deploymentTemplate?api-version=2014-04-01-preview",
      contentVersion: "1.0.0.0",
      outputs: { string: { type: "string", value: "myvalue" } },
      parameters: { string: { type: "string" } },
      resources: [],
      variables: {
        array: [1, 2, 3, 4],
        bool: true,
        int: 42,
        object: { object: { location: "West US", vmSize: "Large" } },
        string: "string",
      },
    };
    const res = await client.deployments.calculateTemplateHash(template);
    assert.ok(res);
  });

})
