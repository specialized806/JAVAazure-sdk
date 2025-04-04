// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Edm, TableClient, TableEntity, TableEntityResult } from "../../src/index.js";
import { odata } from "../../src/index.js";
import { Recorder } from "@azure-tools/test-recorder";
import { delay, isNodeLike } from "@azure/core-util";
import type { FullOperationResponse, OperationOptions } from "@azure/core-client";
import { createTableClient } from "./utils/recordedClient.js";
import { describe, it, assert, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { toSupportTracing } from "@azure-tools/test-utils-vitest";
import { isPlaybackMode } from "../utils/injectables.js";

expect.extend({ toSupportTracing });

const waitTimeout = isPlaybackMode() ? 0 : 2000;

// Add a helper function to safely delete an entity if it exists.
async function deleteEntityIfExists(
  client: TableClient,
  partitionKey: string,
  rowKey: string,
): Promise<void> {
  try {
    await client.deleteEntity(partitionKey, rowKey);
  } catch (error) {
    // Entity doesn't exist. Ignore errors.
  }
}

describe("special characters", () => {
  const tableName = `SpecialChars`;
  let recorder: Recorder;
  let client: TableClient;

  beforeEach(async (ctx) => {
    recorder = new Recorder(ctx);
    client = await createTableClient(tableName, "TokenCredential", recorder);
  });

  afterEach(async () => {
    await recorder.stop();
  });

  it("should handle partition and row keys with special chars", async () => {
    await client.createTable();

    try {
      const partitionKey = "A'aaa_bbbb2\"";
      const rowKey = `"A'aaa_bbbb2`;
      const expectedValue = `"A'aaa_bbbb2`;
      await client.createEntity({
        partitionKey,
        rowKey,
        test: expectedValue,
      });

      const entity = await client.getEntity(partitionKey, rowKey);
      assert.equal(entity.partitionKey, partitionKey);
      assert.equal(entity.rowKey, rowKey);
      assert.equal(entity.test, expectedValue);
    } finally {
      await client.deleteTable();
      delay(waitTimeout);
    }
  });
});

// Run the test against each of the supported auth modes
describe(`TableClient`, () => {
  let client: TableClient;
  let unRecordedClient: TableClient;
  let recorder: Recorder;
  const suffix = isNodeLike ? "node" : "browser";
  const tableName = `tableClientTest${suffix}`;
  const listPartitionKey = "listEntitiesTest";

  beforeEach(async (ctx) => {
    recorder = new Recorder(ctx);
    client = await createTableClient(tableName, "TokenCredential", recorder);
  });

  beforeAll(async () => {
    if (!isPlaybackMode()) {
      unRecordedClient = await createTableClient(tableName, "TokenCredential");
      await unRecordedClient.createTable();
    }
  });

  afterEach(async () => {
    await recorder.stop();
  });

  afterAll(async () => {
    if (!isPlaybackMode()) {
      unRecordedClient = await createTableClient(tableName, "TokenCredential");
      await unRecordedClient.deleteTable();
    }
  });

  describe("listEntities", () => {
    // Create required entities for testing list operations
    beforeAll(async () => {
      unRecordedClient = await createTableClient(tableName, "TokenCredential");
      if (!isPlaybackMode()) {
        await unRecordedClient.createEntity({
          partitionKey: listPartitionKey,
          rowKey: "binary1",
          foo: new Uint8Array([66, 97, 114]),
        });

        for (let i = 0; i < 20; i++) {
          await unRecordedClient.createEntity({
            partitionKey: listPartitionKey,
            rowKey: `${i}`,
            foo: "testEntity",
          });
        }
      }
    });
    type StringEntity = { foo: string };
    type NumberEntity = { foo: number };
    type DateEntity = { foo: Date };
    type BooleanEntity = { foo: boolean };
    type Int64Entity = { foo: Edm<"Int64"> };
    type Int32Entity = { foo: Edm<"Int32"> };
    type BinaryEntity = { foo: Uint8Array };
    type TestEntity =
      | TableEntity<StringEntity>
      | TableEntity<NumberEntity>
      | TableEntity<DateEntity>
      | TableEntity<BooleanEntity>
      | TableEntity<Int64Entity>
      | TableEntity<Int32Entity>
      | TableEntity<BinaryEntity>;

    it("should list all", { timeout: 10000 }, async () => {
      const totalItems = 21;
      const entities = client.listEntities<TestEntity>({
        queryOptions: { filter: odata`PartitionKey eq ${listPartitionKey}` },
      });
      const all: TestEntity[] = [];
      for await (const entity of entities) {
        all.push(entity);
      }

      assert.lengthOf(all, totalItems);
    });

    it("should list by page", async () => {
      const barItems = 20;
      const maxPageSize = 5;
      const entities = client.listEntities<TestEntity>({
        queryOptions: { filter: odata`PartitionKey eq ${listPartitionKey}` },
      });
      let all: TestEntity[] = [];
      for await (const entity of entities.byPage({
        maxPageSize,
      })) {
        all = [...all, ...entity];
      }
      for (let i = 0; i < barItems; i++) {
        assert.isTrue(
          all.some((e) => e.rowKey === `${i}`),
          `Couldn't find entity with row key ${i}`,
        );
      }

      assert.isTrue(
        all.some((e) => e.rowKey === `binary1`),
        `Couldn't find entity with row key binary1`,
      );
    });

    it("should list with filter", async () => {
      const barItems = 20;
      const strValue = "testEntity";
      const entities = client.listEntities<TableEntity<StringEntity>>({
        queryOptions: { filter: odata`foo eq ${strValue}` },
      });
      let all: TableEntity<StringEntity>[] = [];
      for await (const entity of entities) {
        all = [...all, entity];
      }

      for (let i = 0; i < barItems; i++) {
        assert.isTrue(
          all.some((e) => e.rowKey === `${i}`),
          `Couldn't find entity with row key ${i}`,
        );
      }
    });

    it("should list binary with filter", async () => {
      const strValue = "binary1";
      const entities = client.listEntities<TableEntity<BinaryEntity>>({
        queryOptions: { filter: odata`RowKey eq ${strValue}` },
      });
      let all: TableEntity<BinaryEntity>[] = [];
      for await (const entity of entities) {
        assert.isDefined(entity.timestamp, "Expected timestamp to be defined in the entity");
        assert.isDefined(entity.etag, "Expected etag");
        all = [...all, entity];
      }

      if (isNodeLike) {
        assert.deepEqual(all[0].foo, Buffer.from("Bar"));
      }

      if (!isNodeLike) {
        assert.deepEqual(String.fromCharCode(...all[0].foo), "Bar");
      }
    });

    it("should filter dates correctly", async () => {
      const propertyName = "date";
      const comparisonDate = new Date("2019-07-10T12:00:00-0700");

      const entities = [
        {
          partitionKey: "p1",
          rowKey: "r1",
          [propertyName]: new Date(comparisonDate.valueOf() - 1),
        },
        {
          partitionKey: "p1",
          rowKey: "r2",
          [propertyName]: comparisonDate,
        },
        {
          partitionKey: "p1",
          rowKey: "r3",
          [propertyName]: new Date(comparisonDate.valueOf() + 1),
        },
      ];

      for (const entity of entities) {
        await client.createEntity(entity);
      }

      const entityIterable = client.listEntities({
        queryOptions: {
          filter: odata`${propertyName} lt ${comparisonDate}`,
        },
      });

      const responseDates = [];
      for await (const entity of entityIterable) {
        assert.property(entity, propertyName);
        assert.typeOf(entity[propertyName], "Date");
        responseDates.push(entity[propertyName] as Date);
      }

      assert.deepEqual(new Set(responseDates), new Set([entities[0][propertyName]]));
    });
  });

  describe("createEntity, getEntity and delete", () => {
    it("should createEntity with only primitives", async () => {
      type TestType = { testField: string };
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P2_${suffix}`,
        rowKey: "R1",
        testField: "testEntity",
      };
      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;

      // Ensure the entity does not already exist.
      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<TestType>(testEntity.partitionKey, testEntity.rowKey);
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.equal(result.testField, testEntity.testField);
    });

    it("should createEntity empty partition and row keys", async () => {
      type TestType = { testField: string };
      const testEntity: TableEntity<TestType> = {
        partitionKey: "",
        rowKey: "",
        testField: "testEntity",
      };
      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<TestType>(testEntity.partitionKey, testEntity.rowKey);
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.equal(result.testField, testEntity.testField);
    });

    it("should create binary entities as primitive and metadata", async () => {
      const primitive = new Uint8Array([66, 97, 114]);
      interface TestEntity extends TableEntity {
        binary: Uint8Array;
        binaryMetadata: Edm<"Binary">;
      }

      interface TestResult extends TableEntityResult<Record<string, unknown>> {
        binary: Uint8Array;
        binaryMetadata: Uint8Array;
      }

      const expected: TestEntity = {
        partitionKey: `CreateBinary_${suffix}`,
        rowKey: `first_${suffix}`,
        binary: primitive,
        binaryMetadata: {
          type: "Binary",
          value: "QmFy",
        },
      };

      await deleteEntityIfExists(client, expected.partitionKey, expected.rowKey);

      await client.createEntity(expected);

      const result = await client.getEntity<TestResult>(expected.partitionKey, expected.rowKey);

      if (isNodeLike) {
        assert.deepEqual(result.binary, Buffer.from("Bar"));
        assert.deepEqual(result.binaryMetadata, Buffer.from("Bar"));
      }

      if (!isNodeLike) {
        assert.deepEqual(String.fromCharCode(...result.binary), "Bar");
        assert.deepEqual(String.fromCharCode(...result.binaryMetadata), "Bar");
      }
    });

    it("should create binary entities without automatic type conversion", async () => {
      const primitive = new Uint8Array([66, 97, 114]);
      const base64Value = "QmFy";
      interface TestEntity extends TableEntity {
        binary: Uint8Array;
        binaryMetadata: Edm<"Binary">;
      }

      interface TestResult extends TableEntityResult<Record<string, unknown>> {
        binary: Edm<"Binary">;
        binaryMetadata: Edm<"Binary">;
      }

      const expected: TestEntity = {
        partitionKey: `CreateBinary_${suffix}`,
        rowKey: `second_${suffix}`,
        binary: primitive,
        binaryMetadata: {
          type: "Binary",
          value: base64Value,
        },
      };

      await deleteEntityIfExists(client, expected.partitionKey, expected.rowKey);

      await client.createEntity(expected);

      const result = await client.getEntity<TestResult>(expected.partitionKey, expected.rowKey, {
        disableTypeConversion: true,
      });

      assert.deepEqual(result.binary.value, base64Value);
      assert.deepEqual(result.binaryMetadata.value, base64Value);
    });

    it("should select specific properties", async () => {
      const testEntity = {
        partitionKey: `P2_${suffix}`,
        rowKey: "R1",
        foo: "testEntity",
        bar: 123,
        baz: true,
      };

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      await client.createEntity(testEntity);

      const result = await client.getEntity(testEntity.partitionKey, testEntity.rowKey, {
        queryOptions: { select: ["baz", "partitionKey", "rowKey", "etag"] },
      });

      assert.isDefined(result.etag);
      assert.equal(result.baz, testEntity.baz);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);

      // properties not included in select should be undefined in the result
      assert.isUndefined(result.bar);
      assert.isUndefined(result.foo);
    });

    it("should createEntity with Date", async () => {
      const testDate = "2020-09-17T00:00:00.111Z";
      const testEntity = {
        partitionKey: `P2_${suffix}`,
        rowKey: "R2",
        testField: new Date(testDate),
      };
      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;
      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity(testEntity.partitionKey, testEntity.rowKey);
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.deepEqual(result.testField, new Date(testDate));
    });

    it("should createEntity with Guid", async () => {
      type TestType = {
        testField: Edm<"Guid">;
      };

      const testGuid: Edm<"Guid"> = {
        value: "cf8ef051-1b7d-4e93-a1e5-a3944d7e441c",
        type: "Guid",
      };
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P3_${suffix}`,
        rowKey: "R3",
        testField: testGuid,
      };

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;
      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<TestType>(testEntity.partitionKey, testEntity.rowKey);
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.deepEqual(result.testField, testGuid);
    });

    it("should createEntity with Int64", async () => {
      type TestType = {
        testField: Edm<"Int64">;
      };
      const testInt64: Edm<"Int64"> = {
        value: "12345543221",
        type: "Int64",
      };
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P4_${suffix}`,
        rowKey: "R4",
        testField: testInt64,
      };

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;
      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity(testEntity.partitionKey, testEntity.rowKey);
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.equal(typeof result.testField, "bigint");
      assert.deepEqual(result.testField, BigInt(testInt64.value));
    });

    it("should createEntity with Int32", async () => {
      type TestType = {
        testField: Edm<"Int32">;
      };

      type ResponseType = {
        testField: number;
      };

      const testInt32: Edm<"Int32"> = {
        value: 123,
        type: "Int32",
      };
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P5_${suffix}`,
        rowKey: "R5",
        testField: testInt32,
      };

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;
      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<ResponseType>(
        testEntity.partitionKey,
        testEntity.rowKey,
      );
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);

      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.deepEqual(result.testField, 123);
    });

    it("should createEntity with Boolean", async () => {
      type TestType = {
        testField: Edm<"Boolean">;
      };

      type ResponseType = {
        testField: boolean;
      };

      const testBoolean: Edm<"Boolean"> = {
        value: true,
        type: "Boolean",
      };
      // Check this API interaction!
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P6_${suffix}`,
        rowKey: "R6",
        testField: testBoolean,
      };

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;
      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<ResponseType>(
        testEntity.partitionKey,
        testEntity.rowKey,
      );
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.equal(result.testField, true);
    });

    it("should createEntity with DateTime", async () => {
      type TestType = {
        testField: Edm<"DateTime">;
      };
      const testDate = "2020-09-17T00:00:00.99999Z";
      const testDateTime: Edm<"DateTime"> = {
        value: testDate,
        type: "DateTime",
      };
      // Check this API interaction!
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P7_${suffix}`,
        rowKey: "R7",
        testField: testDateTime,
      };
      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<TestType>(testEntity.partitionKey, testEntity.rowKey, {
        disableTypeConversion: true,
      });
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.deepEqual(result.testField.value, testDate);
    });

    it("should createEntity with primitive int and float", async () => {
      type TestType = { integerNumber: number; floatingPointNumber: number };
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P8_${suffix}`,
        rowKey: "R8",
        integerNumber: 3,
        floatingPointNumber: 3.14,
      };
      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      await client.createEntity(testEntity, { onResponse: (res) => (createResult = res) });
      const result = await client.getEntity<TestType>(testEntity.partitionKey, testEntity.rowKey);
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.equal(result.integerNumber, 3);
      assert.equal(result.floatingPointNumber, 3.14);
    });

    it("should createEntity with double number in scientific notation", async () => {
      const inputEntity = {
        partitionKey: "doubleSci",
        rowKey: "0",
        Value: { value: "1.23456789012346e+24", type: "Double" },
      };

      await deleteEntityIfExists(client, inputEntity.partitionKey, inputEntity.rowKey);

      await client.createEntity(inputEntity);

      const result = await client.getEntity(inputEntity.partitionKey, inputEntity.rowKey, {
        disableTypeConversion: true,
      });

      assert.deepEqual(result.Value, inputEntity.Value);
    });

    it("should createEntity with empty string", async () => {
      const inputEntity = {
        partitionKey: "emptyString",
        rowKey: "0",
        value: { value: "", type: "String" },
      };

      await deleteEntityIfExists(client, inputEntity.partitionKey, inputEntity.rowKey);

      await client.createEntity(inputEntity);

      const result = await client.getEntity(inputEntity.partitionKey, inputEntity.rowKey, {
        disableTypeConversion: true,
      });

      assert.deepEqual(result.value, inputEntity.value);
    });

    it("should createEntity with primitive int and float without automatic type conversion", async () => {
      type TestType = {
        integerNumber: number;
        floatingPointNumber: number;
        booleanValue: boolean;
      };
      const testEntity: TableEntity<TestType> = {
        partitionKey: `P8_${suffix}`,
        rowKey: "R8",
        integerNumber: 3,
        floatingPointNumber: 3.14,
        booleanValue: true,
      };
      let createResult: FullOperationResponse | undefined;
      let deleteResult: FullOperationResponse | undefined;

      await deleteEntityIfExists(client, testEntity.partitionKey, testEntity.rowKey);

      await client.createEntity(testEntity, {
        onResponse: (res) => (createResult = res),
      });
      const result = await client.getEntity(testEntity.partitionKey, testEntity.rowKey, {
        disableTypeConversion: true,
      });
      await client.deleteEntity(testEntity.partitionKey, testEntity.rowKey, {
        onResponse: (res) => (deleteResult = res),
      });

      assert.equal(deleteResult?.status, 204);
      assert.equal(createResult?.status, 204);
      assert.equal(result.partitionKey, testEntity.partitionKey);
      assert.equal(result.rowKey, testEntity.rowKey);
      assert.deepEqual(result.integerNumber, {
        value: "3",
        type: "Int32",
      });
      assert.deepEqual(result.floatingPointNumber, {
        value: "3.14",
        type: "Double",
      });
      assert.deepEqual(result.booleanValue, {
        value: "true",
        type: "Boolean",
      });
    });
  });

  describe("tracing", () => {
    it("should trace through the various operations", async () => {
      await expect(async (options: OperationOptions) => {
        await client.createTable(options);
        const entity = {
          partitionKey: "A'aaa_bbbb2\"",
          rowKey: `"A'aaa_bbbb2`,
        };
        await client.createEntity(entity, options);
        await client.upsertEntity(entity, "Replace", options);
        await client.getEntity(entity.partitionKey, entity.rowKey, options);
        await client.updateEntity(entity, "Replace", options);
        await client.listEntities(options).byPage().next();
        await client.deleteEntity(entity.partitionKey, entity.rowKey, options);
        await client.deleteTable(options);
      }).toSupportTracing([
        "TableClient.createTable",
        "TableClient.createEntity",
        "TableClient.upsertEntity",
        "TableClient.getEntity",
        "TableClient.updateEntity",
        "TableClient.listEntitiesPage",
        "TableClient.deleteEntity",
        "TableClient.deleteTable",
      ]);
    });
  });
});
