// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { describe, it, assert, beforeEach, afterEach } from "vitest";
import type { AppleRegistrationDescription } from "../../src/models/index.js";
import { createAppleRegistrationDescription } from "../../src/models/index.js";
import type { NotificationHubsClientContext } from "../../src/api/index.js";
import {
  createRegistration,
  deleteRegistration,
  listRegistrationsByTag,
} from "../../src/api/index.js";
import { Recorder } from "@azure-tools/test-recorder";
import { createRecordedClientContext } from "./utils/recordedClient.js";

describe("listRegistrationsByTag()", () => {
  let recorder: Recorder;
  let context: NotificationHubsClientContext;
  const registrationIds: string[] = [];
  const deviceToken = "00fc13adff785122b4ad28809a3420982341241421348097878e577c991de8f0";

  beforeEach(async (ctx) => {
    recorder = new Recorder(ctx);
    await recorder.setMatcher("BodilessMatcher");
    context = await createRecordedClientContext(recorder);

    for (let i = 0; i < 3; i++) {
      let registration = createAppleRegistrationDescription({
        deviceToken,
        tags: ["likes_football", "likes_hockey"],
      });

      registration = (await createRegistration(
        context,
        registration,
      )) as AppleRegistrationDescription;
      registrationIds.push(registration.registrationId!);
    }
  });

  afterEach(async () => {
    for (const registrationId of registrationIds) {
      await deleteRegistration(context, registrationId);
    }

    await recorder.stop();
  });

  it("should list all registrations", async () => {
    const tag = "likes_football";
    const registrations = listRegistrationsByTag(context, tag);

    let numberOfItems = 0;
    const foundRegistrations: string[] = [];
    for await (const registration of registrations) {
      numberOfItems++;
      foundRegistrations.push(registration.registrationId!);
    }

    assert.isTrue(numberOfItems > 0);
    assert.isTrue(
      registrationIds.some((registrationId) => foundRegistrations.includes(registrationId)),
    );
  });
});
