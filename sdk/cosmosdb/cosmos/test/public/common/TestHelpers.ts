// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  ClientConfigDiagnostic,
  Container,
  CosmosClientOptions,
  CosmosDiagnostics,
  Database,
  DatabaseDefinition,
  FailedRequestAttemptDiagnostic,
  GatewayStatistics,
  MetadataLookUpDiagnostic,
  PartitionKey,
  PartitionKeyDefinition,
  PartitionKeyRange,
  PermissionDefinition,
  QueryIterator,
  RequestOptions,
  Response,
  UserDefinition,
} from "../../../src/index.js";
import {
  ClientContext,
  ConnectionMode,
  ConsistencyLevel,
  Constants,
  CosmosClient,
  CosmosDbDiagnosticLevel,
  GlobalEndpointManager,
  MetadataLookUpType,
} from "../../../src/index.js";
import type {
  ItemDefinition,
  ItemResponse,
  PermissionResponse,
  Resource,
  User,
} from "../../../src/index.js";
import type { UserResponse } from "../../../src/index.js";
import { endpoint } from "../common/_testConfig.js";
import { masterKey } from "../common/_fakeTestSecrets.js";
import type { DatabaseRequest } from "../../../src/index.js";
import type { ContainerRequest } from "../../../src/index.js";
import {
  DiagnosticNodeInternal,
  DiagnosticNodeType,
} from "../../../src/diagnostics/DiagnosticNodeInternal.js";
import type { ExtractPromise } from "../../../src/utils/diagnostics.js";
import { getCurrentTimestampInMs } from "../../../src/utils/time.js";
import { extractPartitionKeys } from "../../../src/extractPartitionKey.js";
import fs from "node:fs";
import path from "node:path";
import { assert, expect, vi } from "vitest";
import { AssertionError } from "assertion-error";

const defaultRoutingGatewayPort: string = ":8081";
const defaultComputeGatewayPort: string = ":8903";

export function getDefaultClient(): CosmosClient {
  return new CosmosClient({
    endpoint,
    key: masterKey,
    connectionPolicy: { enableBackgroundEndpointRefreshing: false },
    diagnosticLevel: CosmosDbDiagnosticLevel.info,
  });
}

export function getDefaultComputeGatewayClient(): CosmosClient {
  return new CosmosClient({
    endpoint: endpoint.replace(defaultRoutingGatewayPort, defaultComputeGatewayPort),
    key: masterKey,
    connectionPolicy: { enableBackgroundEndpointRefreshing: false },
  });
}

export function addEntropy(name: string): string {
  return name + getEntropy();
}

export function getEntropy(): string {
  return `${Math.floor(Math.random() * 10000)}`;
}

export async function removeAllDatabases(client?: CosmosClient): Promise<void> {
  try {
    if (!client) {
      client = getDefaultClient();
    }
    const { resources: databases } = await client.databases.readAll().fetchAll();
    const length = databases.length;

    if (length === 0) {
      return;
    }

    await Promise.all(
      databases.map<Promise<Response<DatabaseDefinition>>>(async (database: DatabaseDefinition) =>
        client.database(database.id).delete(),
      ),
    );
  } catch (err: any) {
    console.log("An error occured", err);
    assert.fail(err);
    throw err;
  }
}

export function createDummyDiagnosticNode(
  diagnosticLevel: CosmosDbDiagnosticLevel = CosmosDbDiagnosticLevel.info,
): DiagnosticNodeInternal {
  return new DiagnosticNodeInternal(diagnosticLevel, DiagnosticNodeType.CLIENT_REQUEST_NODE, null);
}

/**
 * A type used to validate CosmosDiagnostic Object.
 */
export type CosmosDiagnosticsTestSpec = {
  requestStartTimeUTCInMsLowerLimit?: number; // The CosmosDiagnostic obj is expected to have a timestamp later than this.
  requestDurationInMsUpperLimit?: number; // The CosmosDiagnostic obj is expected to have a duration less than this value.
  retryCount?: number; // The CosmosDiagnostic obj is expected to have this many retries.
  metadataCallCount?: number; // The CosmosDiagnostic obj is expected to have this many metadata calls.
  locationEndpointsContacted?: number; // The CosmosDiagnostic obj is expected to have this many endpoints contacted.
  gatewayStatisticsTestSpec?: Partial<GatewayStatistics>[]; // List of expected Partial gateway statistics
};

/**
 * Utility function which can be used to wrap any code returning a Response
 * type object. (ResourceResponse, FeedResponse, BatchResponse, ErrorResponse)
 * along with CosmosDiagnosticTestSpec, it will extract the diagnostic object
 * and validate it is according to the spec provided.
 * @param parallelExecutions - Is true if the CosmosDiagnostic was generated for an operation, which might have made parallel
 * backend requests. Is used to skip certain tests. For example sum of durations of all metadata requests would be less than
 * total time, only if they are executed sequentially.
 * @returns
 */
export async function testForDiagnostics<Callback extends () => Promise<any>>(
  callback: Callback,
  spec: CosmosDiagnosticsTestSpec,
  parallelExecutions: boolean = false,
): Promise<ExtractPromise<ReturnType<Callback>>> {
  try {
    if (!spec.requestStartTimeUTCInMsLowerLimit) {
      spec.requestStartTimeUTCInMsLowerLimit = getCurrentTimestampInMs();
    }
    const response = await callback();
    if (!spec.requestDurationInMsUpperLimit) {
      spec.requestDurationInMsUpperLimit =
        getCurrentTimestampInMs() - spec.requestStartTimeUTCInMsLowerLimit;
    }
    assert.isDefined(
      response.diagnostics,
      "Diagnostics object should not be undefined or null, in Response object",
    );
    validateDiagnostics(response.diagnostics, spec, parallelExecutions);
    return response;
  } catch (ex) {
    if (ex instanceof AssertionError) {
      throw ex;
    }
    if (!spec.requestDurationInMsUpperLimit) {
      spec.requestDurationInMsUpperLimit =
        getCurrentTimestampInMs() - spec.requestStartTimeUTCInMsLowerLimit;
    }
    assert.isDefined(
      ex.diagnostics,
      "Diagnostics object should not be undefined or null, in Exception objection",
    );
    validateDiagnostics(ex.diagnostics, spec, parallelExecutions);
    throw ex;
  }
}

/**
 * Checks a instance of CosmosDiagnostic object against CosmosDiagnosticTestSpec.
 * @param parallelExecutions - Is true if the CosmosDiagnostic was generated for an operation, which might have made parallel
 * backend requests. Is used to skip certain tests. For example sum of durations of all metadata requests would be less than
 * total time, only if they are executed sequentially.
 */
export function validateDiagnostics(
  diagnostics: CosmosDiagnostics,
  spec: CosmosDiagnosticsTestSpec,
  parallelExecutions: boolean,
): void {
  assert.isDefined(diagnostics, "Diagnostics object should not be undefined or null");

  validateRequestStartTimeForDiagnostics(spec, diagnostics);

  validateRequestDurationForDiagnostics(spec, diagnostics);

  validateRequestPayloadSizeForDiagnostics(diagnostics);

  validateRetriesForDiagnostics(spec, diagnostics, parallelExecutions);

  validateMetadataCallsForDiagnostics(spec, diagnostics, parallelExecutions);

  validateLocationEndpointsContactedForDiagnostics(spec, diagnostics);

  validateGatewayStatisticsForDiagnostics(spec, diagnostics, parallelExecutions);

  if (!parallelExecutions) {
    const totalTimeSpentInMetadataRequest =
      diagnostics.clientSideRequestStatistics.metadataDiagnostics.metadataLookups.reduce(
        (total, current) => total + current.durationInMs,
        0,
      );
    const totalTimeSpentInRetries =
      diagnostics.clientSideRequestStatistics.retryDiagnostics.failedAttempts.reduce(
        (total, current) => total + current.durationInMs,
        0,
      );
    const timeInMainRequest = diagnostics.clientSideRequestStatistics.gatewayStatistics.reduce(
      (total, current) => total + current.durationInMs,
      0,
    );
    const totalOperationTime = diagnostics.clientSideRequestStatistics.requestDurationInMs;
    expect(
      totalTimeSpentInMetadataRequest + totalTimeSpentInRetries + timeInMainRequest,
      "In CosmosDiagnostics, Sum of time spent in metadata request, retries and main requests should be less than\
       total operation time, for Sequential operations.",
    ).to.be.lte(totalOperationTime);
  }
}

function validateGatewayStatisticsForDiagnostics(
  spec: CosmosDiagnosticsTestSpec,
  diagnostics: CosmosDiagnostics,
  parallelExecutions: boolean,
): void {
  const gatewayStatistics = diagnostics.clientSideRequestStatistics.gatewayStatistics;
  if (spec.gatewayStatisticsTestSpec !== undefined) {
    assert.isDefined(
      gatewayStatistics,
      "In CosmosDiagnostics, gatewayStatistics should have existed.",
    );
    assert.equal(
      gatewayStatistics.length,
      spec.gatewayStatisticsTestSpec.length,
      "In CosmosDiagnostics, Number of gatewayStatistics should match the spec.",
    );

    for (let i = 0; i < spec.gatewayStatisticsTestSpec.length; i++) {
      const gatewayStatisticsSpec: Partial<GatewayStatistics> = spec.gatewayStatisticsTestSpec[i];
      const currentGatewayStatistics: GatewayStatistics = gatewayStatistics[i];
      compareObjects(
        currentGatewayStatistics,
        gatewayStatisticsSpec,
        "In CosmosDiagnostics, gatewayStatisticsSpec properties should match the spec.",
      );
    }
  }

  const activityIds = new Set();
  gatewayStatistics.forEach((gatewayStat) => {
    if (gatewayStat.resourceType !== "") {
      expect(
        gatewayStat.activityId,
        "In CosmosDiagnostics, ActivityId for gatewayStatistics should not be empty.",
      ).to.not.be.empty;
      expect(
        activityIds.has(gatewayStat.activityId),
        "In CosmosDiagnostics, gatewayStatistics should not contain duplicate activityId.",
      ).to.be.false;
    }
  });

  if (!parallelExecutions) {
    verifyForOverlappingRanges(
      gatewayStatistics,
      "In CosmosDiagnostics, Verifying gatewayStatistics",
    );
  }
}

function compareObjects(test: any, target: any, message: string): void {
  const mismatchedProperties = [];

  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key) && target[key] !== undefined) {
      try {
        expect(test[key]).to.deep.equal(target[key]);
      } catch (error) {
        mismatchedProperties.push(key);
      }
    }
  }

  if (mismatchedProperties.length > 0) {
    const errorMessage = `${message} Properties [${mismatchedProperties.join(
      ", ",
    )}] did not match.`;
    throw new AssertionError(errorMessage);
  }
}

function verifyForOverlappingRanges(
  ranges: MetadataLookUpDiagnostic[] | FailedRequestAttemptDiagnostic[] | GatewayStatistics[],
  msg: string,
): void {
  ranges.sort((a, b) =>
    a.startTimeUTCInMs === b.startTimeUTCInMs
      ? a.durationInMs - b.durationInMs
      : a.startTimeUTCInMs - b.startTimeUTCInMs,
  ); // Sort ranges by start time
  for (let i = 1; i < ranges.length; i++) {
    expect(
      ranges[i].startTimeUTCInMs,
      msg +
        `. Overlapping Ranges: [${ranges[i - 1].startTimeUTCInMs}, ${
          ranges[i - 1].durationInMs
        }] & [${ranges[i].startTimeUTCInMs}, ${ranges[i].durationInMs}]`,
    ).to.be.gte(ranges[i - 1].startTimeUTCInMs + ranges[i - 1].durationInMs);
  }
}

function validateLocationEndpointsContactedForDiagnostics(
  spec: CosmosDiagnosticsTestSpec,
  diagnostics: CosmosDiagnostics,
): void {
  if (spec.locationEndpointsContacted !== undefined) {
    expect(
      diagnostics.clientSideRequestStatistics.locationEndpointsContacted,
      "In CosmosDiagnostics, locationEndpointsContacted should have existed.",
    ).to.exist;
    // This check is only reliable for emulator (always contacts only 1 endpoint).
    // For staging/prod accounts with multiple regions, the number of endpoints contacted will vary.
    if (endpoint.includes("https://localhost")) {
      expect(
        diagnostics.clientSideRequestStatistics.locationEndpointsContacted.length,
        "In CosmosDiagnostics, Number of locationEndpointsContacted should match the spec.",
      ).to.be.equal(spec.locationEndpointsContacted);
    }
  }
}

function validateMetadataCallsForDiagnostics(
  spec: CosmosDiagnosticsTestSpec,
  diagnostics: CosmosDiagnostics,
  parallelExecutions: boolean,
): void {
  const metadataLookups =
    diagnostics.clientSideRequestStatistics.metadataDiagnostics.metadataLookups;
  if (spec.metadataCallCount !== undefined) {
    expect(
      metadataLookups,
      "In CosmosDiagnostics, metadataDiagnostics.metadataLookups should have existed.",
    ).to.exist;
    expect(
      metadataLookups.length,
      "In CosmosDiagnostics, Number of metadataLookups should match the spec.",
    ).to.be.equal(spec.metadataCallCount);
  }

  const activityIds = new Set();
  metadataLookups.forEach((metadataLookup) => {
    if (
      metadataLookup.metaDataType !== MetadataLookUpType.DatabaseAccountLookUp &&
      metadataLookup.metaDataType !== MetadataLookUpType.QueryPlanLookUp
    ) {
      expect(
        metadataLookup.activityId,
        "In CosmosDiagnostics, metadataLookups should contain activityId.",
      ).to.not.be.empty;
      expect(
        activityIds.has(metadataLookup.activityId),
        "In CosmosDiagnostics, metadataLookups should not contain duplicate activityId.",
      ).to.be.false;
    }
  });
  if (!parallelExecutions) {
    verifyForOverlappingRanges(metadataLookups, "In CosmosDiagnostics, Verifying metadatalookups");
  }
}

function validateRetriesForDiagnostics(
  spec: CosmosDiagnosticsTestSpec,
  diagnostics: CosmosDiagnostics,
  parallelExecutions: boolean,
): void {
  if (spec.retryCount !== undefined) {
    expect(
      diagnostics.clientSideRequestStatistics.retryDiagnostics.failedAttempts,
      "In CosmosDiagnostics, retryDiagnostics.failedAttempts should have existed.",
    ).to.exist;
    expect(
      diagnostics.clientSideRequestStatistics.retryDiagnostics.failedAttempts.length,
      "In CosmosDiagnostics, Number of failedAttempts should match the spec.",
    ).to.be.equal(spec.retryCount);
  }
  if (!parallelExecutions) {
    verifyForOverlappingRanges(
      diagnostics.clientSideRequestStatistics.retryDiagnostics.failedAttempts,
      "In CosmosDiagnostics, Verifying retryDiagnostics",
    );
  }
}

function validateRequestPayloadSizeForDiagnostics(diagnostics: CosmosDiagnostics): void {
  const totalRequestPayloadForGatewayRequests =
    diagnostics.clientSideRequestStatistics.gatewayStatistics.reduce(
      (total, current) => total + current.requestPayloadLengthInBytes,
      0,
    );
  expect(
    diagnostics.clientSideRequestStatistics.totalRequestPayloadLengthInBytes,
    "In CosmosDiagnostics, totalRequestPayloadLengthInBytes should be greater than or equal to cumulative payload lengths of all gatewayStatistics",
  ).to.be.greaterThanOrEqual(totalRequestPayloadForGatewayRequests);
}

function validateRequestDurationForDiagnostics(
  spec: CosmosDiagnosticsTestSpec,
  diagnostics: CosmosDiagnostics,
): void {
  if (spec.requestDurationInMsUpperLimit !== undefined) {
    expect(
      diagnostics.clientSideRequestStatistics.requestDurationInMs,
      "In CosmosDiagnostics, clientSideRequestStatistics.requestDurationInMs should exist",
    ).to.exist;
    expect(
      spec.requestDurationInMsUpperLimit,
      "In CosmosDiagnostics, requestDurationInMs should be less than given limit.",
    ).to.be.greaterThanOrEqual(diagnostics.clientSideRequestStatistics.requestDurationInMs);
  } else {
    expect(
      diagnostics.clientSideRequestStatistics.requestDurationInMs,
      "In CosmosDiagnostics, clientSideRequestStatistics.requestDurationInMs should not be 0.",
    ).is.not.eqls(0);
  }
}

function validateRequestStartTimeForDiagnostics(
  spec: CosmosDiagnosticsTestSpec,
  diagnostics: CosmosDiagnostics,
): void {
  if (spec.requestStartTimeUTCInMsLowerLimit !== undefined) {
    expect(
      diagnostics.clientSideRequestStatistics.requestStartTimeUTCInMs,
      "In CosmosDiagnostics, requestStartTimeUTCInMs should exist",
    ).to.exist;
    expect(
      spec.requestStartTimeUTCInMsLowerLimit,
      "In CosmosDiagnostics, requestStartTimeUTCInMs should be later than given timestamp.",
    ).to.be.lessThanOrEqual(diagnostics.clientSideRequestStatistics.requestStartTimeUTCInMs);
  } else {
    expect(
      diagnostics.clientSideRequestStatistics.requestStartTimeUTCInMs,
      "In CosmosDiagnostics, clientSideRequestStatistics.requestStartTimeUTCInMs should not be 0.",
    ).is.not.eqls(0);
  }
}

export async function getTestDatabase(
  testName: string,
  client?: CosmosClient,
  attrs?: Partial<DatabaseRequest>,
): Promise<Database> {
  if (!client) {
    client = getDefaultClient();
  }
  const entropy = Math.floor(Math.random() * 10000);
  const id = `${testName.replace(" ", "").substring(0, 30)}${entropy}`;
  await client.databases.create({ id, ...attrs });
  return client.database(id);
}

export async function getTestContainer(
  testName: string,
  client?: CosmosClient,
  containerDef?: ContainerRequest,
  options?: RequestOptions,
): Promise<Container> {
  if (!client) {
    client = getDefaultClient();
  }
  const db = await getTestDatabase(testName, client);
  const entropy = Math.floor(Math.random() * 10000);
  const id = `${testName.replace(" ", "").substring(0, 30)}${entropy}`;
  await db.containers.create({ ...containerDef, ...{ id } }, options);
  return db.container(id);
}

export async function bulkInsertItems(
  container: Container,
  documents: any[],
): Promise<Array<ItemDefinition & Resource>> {
  return Promise.all(
    documents.map(async (doc) => {
      const { resource: document } = await container.items.create(doc);
      return document;
    }),
  );
}

export async function bulkReadItems(
  container: Container,
  documents: any[],
  partitionKeyDef: PartitionKeyDefinition,
): Promise<void[]> {
  return Promise.all(
    documents.map(async (document) => {
      const partitionKey = extractPartitionKeys(document, partitionKeyDef);

      // TODO: should we block or do all requests in parallel?
      const { resource: doc } = await container.item(document.id, partitionKey).read();
      assert.deepStrictEqual(doc, document);
    }),
  );
}

export async function bulkReplaceItems(
  container: Container,
  documents: any[],
  partitionKeyDef: PartitionKeyDefinition,
): Promise<any[]> {
  return Promise.all(
    documents.map(async (document) => {
      const partitionKey = extractPartitionKeys(document, partitionKeyDef);
      const { resource: doc } = await container.item(document.id, partitionKey).replace(document);
      const { _etag: _1, _ts: _2, ...expectedModifiedDocument } = document;
      const { _etag: _4, _ts: _3, ...actualModifiedDocument } = doc;
      assert.deepStrictEqual(expectedModifiedDocument, actualModifiedDocument);
      return doc;
    }),
  );
}

export async function bulkDeleteItems(
  container: Container,
  documents: any[],
  partitionKeyDef: PartitionKeyDefinition,
): Promise<void> {
  await Promise.all(
    documents.map(async (document) => {
      const partitionKey = extractPartitionKeys(document, partitionKeyDef);

      await container.item(document.id, partitionKey).delete();
    }),
  );
}

export async function bulkQueryItemsWithPartitionKey(
  container: Container,
  documents: any[],
  query: string,
  parameterGenerator: (doc: any) => { name: string; value: any }[],
): Promise<void> {
  for (const document of documents) {
    const parameters = parameterGenerator(document);
    const shouldSkip = parameters.reduce(
      (previous, current) => previous || current["value"] === undefined,
      false,
    );
    if (shouldSkip) {
      continue;
    }
    const querySpec = {
      query: query,
      parameters: parameters,
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    assert.equal(
      resources.length,
      1,
      `Expected exactly 1 document, doc: ${JSON.stringify(
        document,
      )}, query: '${query}', parameters: ${JSON.stringify(parameters)}`,
    );
    assert.equal(JSON.stringify(resources[0]), JSON.stringify(document));
  }
}

// Item
export async function createOrUpsertItem(
  container: Container,
  body: unknown,
  options: RequestOptions,
  isUpsertTest: boolean,
): Promise<ItemResponse<any>> {
  if (isUpsertTest) {
    return container.items.upsert(body, options);
  } else {
    return container.items.create(body, options);
  }
}

export async function replaceOrUpsertItem(
  container: Container,
  body: unknown,
  options: RequestOptions,
  isUpsertTest: boolean,
  partitionKey?: PartitionKey,
): Promise<ItemResponse<any>> {
  if (isUpsertTest) {
    return container.items.upsert(body, options);
  } else {
    const bodyWithId = body as { id: string };
    return container.item(bodyWithId.id, partitionKey).replace(body, options);
  }
}

// User
export function createOrUpsertUser(
  database: Database,
  body: UserDefinition,
  options: RequestOptions,
  isUpsertTest: boolean,
): Promise<UserResponse> {
  if (isUpsertTest) {
    return database.users.upsert(body, options);
  } else {
    return database.users.create(body, options);
  }
}

export function createOrUpsertPermission(
  user: User,
  body: PermissionDefinition,
  options: RequestOptions,
  isUpsertTest: boolean,
): Promise<PermissionResponse> {
  if (isUpsertTest) {
    return user.permissions.upsert(body, options);
  } else {
    return user.permissions.create(body, options);
  }
}

export function replaceOrUpsertPermission(
  user: User,
  body: PermissionDefinition,
  options: RequestOptions,
  isUpsertTest: boolean,
): Promise<PermissionResponse> {
  if (isUpsertTest) {
    return user.permissions.upsert(body, options);
  } else {
    return user.permission(body.id).replace(body, options);
  }
}

export function generateDocuments(docSize: number): {
  id: string;
  name: string;
  spam: string;
  cnt: number;
  key: string;
  spam2: string | number;
  spam3: string;
  boolVar: boolean;
  number: number;
}[] {
  const docs = [];
  for (let i = 0; i < docSize; i++) {
    const d = {
      id: i.toString(),
      name: "sample document",
      spam: "eggs" + i.toString(),
      cnt: i,
      key: "value",
      spam2: i === 3 ? "eggs" + i.toString() : i,
      spam3: `eggs${i % 3}`,
      boolVar: i % 2 === 0,
      number: 1.1 * i,
    };
    docs.push(d);
  }
  return docs;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function assertThrowsAsync(test: () => Promise<any>, error?: any): Promise<string> {
  try {
    await test();
  } catch (e: any) {
    if (!error || e instanceof error) return "everything is fine";
  }
  throw new AssertionError(`Missing rejection ${error} with ${error.name || ""}`);
}

// helper functions for testing change feed allVersionsAndDeletes mode
export async function changeFeedAllVersionsInsertItems(
  container: Container,
  startIndex: number,
  endIndex: number,
): Promise<void> {
  for (let i = startIndex; i <= endIndex; i++) {
    await container.items.create({ id: `sample1+${i}`, name: "sample1", key: i });
    await container.items.create({ id: `sample1+${i}`, name: "sample2", key: i });
    await container.items.create({ id: `sample1+${i}`, name: "sample3", key: i });
    await container.items.create({ id: `sample1+${i}`, name: "sample4", key: i });
  }
}

export async function changeFeedAllVersionsUpsertItems(
  container: Container,
  startIndex: number,
  endIndex: number,
  newValue: number,
): Promise<void> {
  for (let i = startIndex; i <= endIndex; i++) {
    await container.items.upsert({ id: `sample1+${i}`, name: "sample1", key: newValue });
    await container.items.upsert({ id: `sample1+${i}`, name: "sample2", key: newValue });
    await container.items.upsert({ id: `sample1+${i}`, name: "sample3", key: newValue });
    await container.items.upsert({ id: `sample1+${i}`, name: "sample4", key: newValue });
  }
}

export async function changeFeedAllVersionsDeleteItems(
  container: Container,
  startIndex: number,
  endIndex: number,
): Promise<void> {
  for (let i = startIndex; i <= endIndex; i++) {
    await container.item(`sample1+${i}`, "sample1").delete();
    await container.item(`sample1+${i}`, "sample2").delete();
    await container.item(`sample1+${i}`, "sample3").delete();
    await container.item(`sample1+${i}`, "sample4").delete();
  }
}

export function isValidV4UUID(uuid: string): boolean {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(uuid);
}

export function readAndParseJSONFile(fileName: string): any {
  const filePath = path.join(__dirname, fileName);
  const rawData = fs.readFileSync(filePath, "utf-8");
  let parsedData: any;
  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    console.error("Error parsing JSON file:", error);
  }
  return parsedData;
}

export function initializeMockPartitionKeyRanges(
  createMockPartitionKeyRange: (
    id: string,
    minInclusive: string,
    maxExclusive: string,
  ) => {
    id: string; // Range ID
    _rid: string; // Resource ID of the partition key range
    minInclusive: string; // Minimum value of the partition key range
    maxExclusive: string; // Maximum value of the partition key range
    _etag: string; // ETag for concurrency control
    _self: string; // Self-link
    throughputFraction: number; // Throughput assigned to this partition
    status: string;
  },
  clientContext: ClientContext,
  ranges: [string, string][],
): void {
  const partitionKeyRanges = ranges.map((range, index) =>
    createMockPartitionKeyRange(index.toString(), range[0], range[1]),
  );

  const fetchAllInternalStub = vi.fn().mockResolvedValue({
    resources: partitionKeyRanges,
    headers: { "x-ms-request-charge": "1.23" },
    code: 200,
  });
  vi.spyOn(clientContext, "queryPartitionKeyRanges").mockReturnValue({
    fetchAllInternal: fetchAllInternalStub, // Add fetchAllInternal to mimic expected structure
  } as unknown as QueryIterator<PartitionKeyRange>);
}

export function createTestClientContext(
  options: Partial<CosmosClientOptions>,
  diagnosticLevel: CosmosDbDiagnosticLevel,
): ClientContext {
  const clientOps: CosmosClientOptions = {
    endpoint: "",
    connectionPolicy: {
      connectionMode: ConnectionMode.Gateway,
      requestTimeout: 60000,
      enableEndpointDiscovery: true,
      preferredLocations: [],
      retryOptions: {
        maxRetryAttemptCount: 9,
        fixedRetryIntervalInMilliseconds: 0,
        maxWaitTimeInSeconds: 30,
      },
      useMultipleWriteLocations: true,
      endpointRefreshRateInMs: 300000,
      enableBackgroundEndpointRefreshing: true,
    },
    ...options,
  };
  const globalEndpointManager = new GlobalEndpointManager(
    clientOps,
    async (diagnosticNode: DiagnosticNodeInternal, opts: RequestOptions) => {
      expect(opts).to.exist;
      const dummyAccount: any = diagnosticNode;
      return dummyAccount;
    },
  );
  const clientConfig: ClientConfigDiagnostic = {
    endpoint: "",
    resourceTokensConfigured: true,
    tokenProviderConfigured: true,
    aadCredentialsConfigured: true,
    connectionPolicyConfigured: true,
    consistencyLevel: ConsistencyLevel.BoundedStaleness,
    defaultHeaders: {},
    agentConfigured: true,
    userAgentSuffix: "",
    pluginsConfigured: true,
    sDKVersion: Constants.SDKVersion,
    ...options,
  };
  const clientContext = new ClientContext(
    clientOps,
    globalEndpointManager,
    clientConfig,
    diagnosticLevel,
  );
  return clientContext;
}
