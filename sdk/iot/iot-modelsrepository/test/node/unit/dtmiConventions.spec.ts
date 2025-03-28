// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as lib from "../../../src/dtmiConventions.js";
import { describe, it, assert, expect } from "vitest";

interface TestCase {
  dtmi: string;
  valid: boolean;
  expectedPath?: string;
  expectedURL?: string;
}

const testCases: TestCase[] = [
  {
    dtmi: "dtmi:azure:DeviceManagement:DeviceInformation;1",
    valid: true,
    expectedPath: "dtmi/azure/devicemanagement/deviceinformation-1.json",
    expectedURL: "https://contoso.com/dtmi/azure/devicemanagement/deviceinformation-1.json",
  },
  {
    dtmi: "dtmiazure:DeviceManagement:DeviceInformation;1",
    valid: false,
  },
  {
    dtmi: "dtmi:foobar:DeviceInformation;1",
    valid: true,
    expectedPath: "dtmi/foobar/deviceinformation-1.json",
    expectedURL: "https://contoso.com/dtmi/foobar/deviceinformation-1.json",
  },
];

const fakeBasePath = "https://contoso.com";

describe("dtmiConventions", () => {
  testCases.forEach((testCase) => {
    describe("isValidDtmi", () => {
      if (testCase.valid) {
        it(`valid dtmi - ${testCase.dtmi}`, () => {
          const result = lib.isValidDtmi(testCase.dtmi);
          assert(result, `${testCase.dtmi} was incorrectly labelled invalid.`);
        });
      } else {
        it(`invalid dtmi - ${testCase.dtmi}`, () => {
          const result = lib.isValidDtmi(testCase.dtmi);
          expect(result, `${testCase.dtmi} was incorrectly labelled as valid.`).to.equal(false);
        });
      }
    });
  });

  testCases.forEach((testCase) => {
    describe("convertDtmiToPath", () => {
      if (testCase.valid) {
        it(`converts dtmi to path - ${testCase.dtmi}`, () => {
          const result = lib.convertDtmiToPath(testCase.dtmi, false);
          expect(result).to.deep.equal(testCase.expectedPath);
        });
        it(`converts dtmi to expanded path - ${testCase.dtmi}`, () => {
          const result = lib.convertDtmiToPath(testCase.dtmi, true);
          const expected = testCase.expectedPath?.replace(".json", ".expanded.json");
          expect(result).to.deep.equal(expected);
        });
      } else {
        it(`throw error on invalid dtmi - ${testCase.dtmi}`, () => {
          expect(() => {
            lib.convertDtmiToPath(testCase.dtmi, false);
          }).to.throw("DTMI provided is invalid. Ensure it follows DTMI conventions.");
        });
      }
    });
  });

  testCases.forEach((testCase) => {
    describe("getModelUri", () => {
      if (testCase.valid) {
        it(`generates model uri - ${testCase.dtmi}`, () => {
          const result = lib.getModelUri(testCase.dtmi, fakeBasePath, false);
          expect(result).to.equal(testCase.expectedURL);
        });

        it(`generates expanded model uri - ${testCase.dtmi}`, () => {
          const result = lib.getModelUri(testCase.dtmi, fakeBasePath, true);
          const expected = testCase.expectedURL?.replace(".json", ".expanded.json");
          expect(result).to.equal(expected);
        });
      } else {
        it("should fail if the dtmi is not formatted correctly", () => {
          expect(() => {
            lib.getModelUri(testCase.dtmi, fakeBasePath, false);
          }).to.throw("DTMI provided is invalid. Ensure it follows DTMI conventions.");
        });
      }
    });
  });
});
