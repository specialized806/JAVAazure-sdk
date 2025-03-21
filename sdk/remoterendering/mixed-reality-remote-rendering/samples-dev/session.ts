// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @summary Demonstrates using the Azure Remote Rendering SDK to start a session.
 */

import { randomUUID } from "node:crypto";
import type {
  RenderingSessionSettings,
  RenderingSessionPollerLike,
  RenderingSession,
} from "@azure/mixed-reality-remote-rendering";
import { RemoteRenderingClient } from "@azure/mixed-reality-remote-rendering";
import { AzureKeyCredential } from "@azure/core-auth";
import "dotenv/config";

// You will need to set this environment variables or edit the following values
const accountDomain = process.env["REMOTERENDERING_ARR_ACCOUNT_DOMAIN"] || "<account domain>";
const accountId = process.env["REMOTERENDERING_ARR_ACCOUNT_ID"] || "<account ID>";
const accountKey = process.env["REMOTERENDERING_ARR_ACCOUNT_KEY"] || "<account key>";

const serviceEndpoint = process.env["REMOTERENDERING_ARR_SERVICE_ENDPOINT"] || "<serviceEndpoint>";

export async function main(): Promise<void> {
  console.log("== Start a session example ==");

  console.log("== Creating a client ==");

  const credential = new AzureKeyCredential(accountKey);

  const client = new RemoteRenderingClient(serviceEndpoint, accountId, accountDomain, credential);

  console.log("== Starting the session ==");

  const sessionSettings: RenderingSessionSettings = {
    maxLeaseTimeInMinutes: 4,
    size: "Standard",
  };

  // A randomly generated UUID is a good choice for a conversionId.
  const sessionId = randomUUID();

  const sessionPoller: RenderingSessionPollerLike = await client.beginSession(
    sessionId,
    sessionSettings,
  );

  console.log("== Polling ==");

  const session: RenderingSession = await sessionPoller.pollUntilDone();

  console.log("== Check results ==");

  if (session.status === "Ready") {
    console.log("The rendering session is ready");
  } else if (session.status === "Error") {
    console.log("The rendering session encountered an error: " + session.error.message);
  }

  await client.endSession(sessionId);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
