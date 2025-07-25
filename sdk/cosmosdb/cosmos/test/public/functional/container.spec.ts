// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { ContainerResponse, PartitionKeyDefinition } from "../../../src/index.js";
import {
  Constants,
  OperationType,
  PartitionKeyKind,
  ResourceType,
  StatusCodes,
} from "../../../src/index.js";
import type { ContainerDefinition, Database, Container } from "../../../src/index.js";
import type { ContainerRequest } from "../../../src/index.js";
import type { IndexedPath, IndexingPolicy } from "../../../src/index.js";
import { DataType, IndexingMode, IndexKind } from "../../../src/index.js";
import {
  getTestDatabase,
  removeAllDatabases,
  getTestContainer,
  assertThrowsAsync,
  addEntropy,
  testForDiagnostics,
} from "../common/TestHelpers.js";
import { SpatialType } from "../../../src/index.js";
import { GeospatialType } from "../../../src/index.js";
import { describe, it, assert, beforeEach, beforeAll } from "vitest";
import { skipTestForSignOff } from "../common/_testConfig.js";

describe("Containers", { timeout: 10000 }, () => {
  beforeEach(async () => {
    await removeAllDatabases();
  });

  describe("Container CRUD", () => {
    const containerCRUDTest = async function (
      partitionKey?: PartitionKeyDefinition,
      opts?: Partial<ContainerRequest>,
    ): Promise<void> {
      // create database
      const database = await getTestDatabase("Validate Container CRUD");

      // create a container
      const containerDefinition: ContainerRequest = {
        id: "sample container",
        indexingPolicy: { indexingMode: IndexingMode.consistent },
        throughput: 400,
        ...opts,
      };

      if (partitionKey) {
        containerDefinition.partitionKey = partitionKey;
      }

      const { resource: containerDef } = await testForDiagnostics(
        async () => {
          return database.containers.create(containerDefinition);
        },
        {
          locationEndpointsContacted: 1,
          // metadataCallCount: 2,
          retryCount: 0,
          gatewayStatisticsTestSpec: [
            {
              resourceType: ResourceType.container,
              operationType: OperationType.Create,
            },
          ],
        },
      );
      const container = database.container(containerDef.id);
      assert.equal(containerDefinition.id, containerDef.id);
      assert.equal("consistent", containerDef.indexingPolicy.indexingMode);
      if (containerDef.partitionKey) {
        const comparePaths =
          typeof containerDefinition.partitionKey === "string"
            ? [containerDefinition.partitionKey]
            : containerDefinition.partitionKey.paths;
        assert.deepStrictEqual(containerDef.partitionKey.paths, comparePaths);
      }
      // read containers after creation
      const { resources: containers } = await testForDiagnostics(
        async () => {
          return database.containers.readAll().fetchAll();
        },
        {
          locationEndpointsContacted: 1,
          // metadataCallCount: 2,
          retryCount: 0,
          gatewayStatisticsTestSpec: [
            {
              resourceType: ResourceType.container,
              operationType: OperationType.Query,
            },
          ],
        },
        false,
      );

      assert.equal(containers.length, 1, "create should increase the number of containers");
      // query containers
      const querySpec = {
        query: "SELECT * FROM root r WHERE r.id=@id",
        parameters: [
          {
            name: "@id",
            value: containerDefinition.id,
          },
        ],
      };
      const { resources: results } = await database.containers.query(querySpec).fetchAll();
      assert(results.length > 0, "number of results for the query should be > 0");

      const { resources: ranges } = await container.readPartitionKeyRanges().fetchAll();
      assert(ranges.length > 0, "container should have at least 1 partition");

      // Replacing indexing policy is allowed.
      containerDef.indexingPolicy.spatialIndexes = [
        {
          path: "/region/?",
          types: [SpatialType.Polygon],
          boundingBox: {
            xmin: 0,
            ymin: 0,
            xmax: 10,
            ymax: 10,
          },
        },
      ];

      containerDef.geospatialConfig.type = GeospatialType.Geometry;

      await testForDiagnostics(
        async () => {
          return container.replace(containerDef);
        },
        {
          locationEndpointsContacted: 1,
          // metadataCallCount: 2,
          retryCount: 0,
          gatewayStatisticsTestSpec: [
            {
              resourceType: ResourceType.container,
              operationType: OperationType.Replace,
            },
          ],
        },
      );

      // Replacing partition key is not allowed.
      try {
        containerDef.partitionKey = { paths: ["/key"] };
        await container.replace(containerDef);
        assert.fail("Replacing partitionKey must throw");
      } catch (err: any) {
        const badRequestErrorCode = 400;
        assert.equal(
          err.code,
          badRequestErrorCode,
          "response should return error code " + badRequestErrorCode,
        );
      } finally {
        containerDef.partitionKey = partitionKey; // Resume partition key
      }
      // Replacing id is not allowed.
      try {
        containerDef.id = "try_to_replace_id";
        await container.replace(containerDef);
        assert.fail("Replacing container id must throw");
      } catch (err: any) {
        const notFoundErrorCode = 400;
        assert.equal(err.code, notFoundErrorCode, "response should return error code 404");
      }

      // read container
      containerDef.id = containerDefinition.id; // Resume Id.
      const { resource: readcontainer } = await container.read();
      assert.equal(containerDefinition.id, readcontainer.id);

      // delete container
      await testForDiagnostics(
        async () => {
          return container.delete();
        },
        {
          locationEndpointsContacted: 1,
          // metadataCallCount: 2,
          retryCount: 0,
          gatewayStatisticsTestSpec: [
            {
              resourceType: ResourceType.container,
              operationType: OperationType.Delete,
            },
          ],
        },
      );
      // read container after deletion
      try {
        await testForDiagnostics(
          async () => {
            return container.read();
          },
          {
            locationEndpointsContacted: 1,
            // metadataCallCount: 2,
            retryCount: 0,
            gatewayStatisticsTestSpec: [
              {
                resourceType: ResourceType.container,
                operationType: OperationType.Read,
              },
            ],
          },
        );
        assert.fail("Must fail to read container after delete");
      } catch (err: any) {
        const notFoundErrorCode = 404;
        assert.equal(err.code, notFoundErrorCode, "response should return error code 404");
      }
    };

    it("Default partition key", async () => {
      await containerCRUDTest();
    });

    it("Custom partition key", async () => {
      await containerCRUDTest({ paths: ["/id"] });
    });

    it("Hierarchical partition key", async () => {
      await containerCRUDTest({
        paths: ["/id", "/id2"],
        version: 2,
        kind: PartitionKeyKind.MultiHash,
      });
    });

    describe("Bad partition key definition", async () => {
      it("Has 'paths' property as string", async () => {
        // create database
        const database = await getTestDatabase("container CRUD bad partition key");

        // create a container
        const badPartitionKeyDefinition: any = {
          paths: "/id", // This is invalid. Must be an array.
        };

        const containerDefinition: ContainerRequest = {
          id: "sample container",
          indexingPolicy: { indexingMode: IndexingMode.consistent },
          partitionKey: badPartitionKeyDefinition, // This is invalid, forced using type coercion
        };

        try {
          await testForDiagnostics(
            async () => {
              return database.containers.create(containerDefinition);
            },
            {
              locationEndpointsContacted: 1,
              // metadataCallCount: 2,
              retryCount: 0,
            },
          );
          assert.fail(
            `Container Creation should have failed, for partitionkey: ${badPartitionKeyDefinition}`,
          );
        } catch (err: any) {
          assert.equal(err.code, 400);
        }
      });
      it("Path contains anything other than AlphaNumeric + '_'", async () => {
        // create database
        const database = await getTestDatabase("container CRUD bad partition key");

        // create a container
        const badPartitionKeyDefinition = "/id ds";

        const containerDefinition: ContainerRequest = {
          id: "sample container",
          indexingPolicy: { indexingMode: IndexingMode.consistent },
          partitionKey: badPartitionKeyDefinition,
        };

        try {
          await database.containers.create(containerDefinition);
          assert.fail(
            `Container Creation should have failed, for partitionkey: ${badPartitionKeyDefinition}`,
          );
        } catch (err: any) {
          assert.strictEqual(
            true,
            err.message.includes(
              "Partition key paths must contain only valid characters and not contain a trailing slash or wildcard character",
            ),
          );
        }
      });
      it("Is missing leading '/'", async () => {
        // create database
        const database = await getTestDatabase("container CRUD bad partition key");

        // create a container
        const badPartitionKeyDefinition = "id";

        const containerDefinition: ContainerRequest = {
          id: "sample container",
          indexingPolicy: { indexingMode: IndexingMode.consistent },
          partitionKey: badPartitionKeyDefinition,
        };

        try {
          await database.containers.create(containerDefinition);
          assert.fail(
            `Container Creation should have failed, for partitionkey: ${badPartitionKeyDefinition}`,
          );
        } catch (err: any) {
          assert.equal(err.message, "Partition key must start with '/'");
        }
      });
      it("Is missing leading '/' - hierarchical partitions", async () => {
        // create database
        const database = await getTestDatabase("container CRUD bad partition key");

        // create a container
        const badPartitionKeyDefinition = ["id", "/id2"];

        const containerDefinition: ContainerRequest = {
          id: "sample container",
          indexingPolicy: { indexingMode: IndexingMode.consistent },
          partitionKey: {
            paths: badPartitionKeyDefinition,
            version: 2,
            kind: PartitionKeyKind.MultiHash,
          },
        };

        try {
          await database.containers.create(containerDefinition);
          assert.fail(
            `Container Creation should have failed, for partitionkey: ${badPartitionKeyDefinition}`,
          );
        } catch (err: any) {
          assert.strictEqual(
            true,
            err.message.includes(
              "The partition key component definition path 'id' could not be accepted",
            ),
          );
        }
      });
    });
  });

  describe("Indexing policy", () => {
    it("Create container with correct indexing policy", async () => {
      // create database
      const database = await getTestDatabase("container test database");

      // create container
      const { resource: containerDef } = await database.containers.create({
        id: "container test container",
      });
      const container = database.container(containerDef.id);

      assert.equal(
        containerDef.indexingPolicy.indexingMode,
        IndexingMode.consistent,
        "default indexing mode should be consistent",
      );
      await container.delete();

      const uniqueKeysContainerDefinition: ContainerDefinition = {
        id: "uniqueKeysContainer",
        uniqueKeyPolicy: { uniqueKeys: [{ paths: ["/foo"] }] },
      };

      const { resource: uniqueKeysContainerDef } = await database.containers.create(
        uniqueKeysContainerDefinition,
      );
      const uniqueKeysContainer = database.container(uniqueKeysContainerDef.id);

      assert.equal(uniqueKeysContainerDef.uniqueKeyPolicy.uniqueKeys[0].paths[0], "/foo");

      await uniqueKeysContainer.delete();

      const consistentcontainerDefinition: ContainerDefinition = {
        id: "lazy container",
        indexingPolicy: { indexingMode: "consistent" }, // tests the type flexibility
      };
      const { resource: consistentContainerDef } = await database.containers.create(
        consistentcontainerDefinition,
      );
      const consistentContainer = database.container(consistentContainerDef.id);
      assert.equal(
        containerDef.indexingPolicy.indexingMode,
        IndexingMode.consistent,
        "indexing mode should be consistent",
      );
      await consistentContainer.delete();

      const containerDefinition: ContainerDefinition = {
        id: "containerWithIndexingPolicy",
        indexingPolicy: {
          automatic: true,
          indexingMode: IndexingMode.consistent,
          includedPaths: [
            {
              path: "/*",
            },
          ],
          excludedPaths: [
            {
              path: '/"systemMetadata"/*',
            },
          ],
          compositeIndexes: [
            [
              { path: "/a", order: "ascending" },
              { path: "/b", order: "descending" },
            ],
            [
              { path: "/c", order: "ascending" },
              { path: "/d", order: "descending" },
            ],
          ],
        },
      };

      const { resource: containerWithIndexingPolicyDef } =
        await database.containers.create(containerDefinition);

      // Two included paths.
      assert.equal(
        1,
        containerWithIndexingPolicyDef.indexingPolicy.includedPaths.length,
        "Unexpected includedPaths length",
      );
      // The first included path is what we created.
      assert.equal("/*", containerWithIndexingPolicyDef.indexingPolicy.includedPaths[0].path);
      // And two excluded paths.
      assert.equal(
        2,
        containerWithIndexingPolicyDef.indexingPolicy.excludedPaths.length,
        "Unexpected excludedPaths length",
      );
      assert.equal(
        '/"systemMetadata"/*',
        containerWithIndexingPolicyDef.indexingPolicy.excludedPaths[0].path,
      );
      // Check for composite Index metrics
      assert.equal("/a", containerWithIndexingPolicyDef.indexingPolicy.compositeIndexes[0][0].path);
      assert.equal("/b", containerWithIndexingPolicyDef.indexingPolicy.compositeIndexes[0][1].path);
      assert.equal("/c", containerWithIndexingPolicyDef.indexingPolicy.compositeIndexes[1][0].path);
      assert.equal("/d", containerWithIndexingPolicyDef.indexingPolicy.compositeIndexes[1][1].path);
    });

    const checkDefaultIndexingPolicyPaths = function (indexingPolicy: IndexingPolicy): void {
      assert.equal(1, indexingPolicy["excludedPaths"].length);
      assert.equal(1, indexingPolicy["includedPaths"].length);

      let rootIncludedPath: IndexedPath = null;
      if (indexingPolicy["includedPaths"][0]["path"] === "/*") {
        rootIncludedPath = indexingPolicy["includedPaths"][0];
      }

      assert(rootIncludedPath); // root path should exist.
    };
    it("Create container with default indexing policy", async () => {
      // create database
      const database = await getTestDatabase("container test database");

      // create container with no indexing policy specified.
      const containerDefinition01: ContainerDefinition = { id: "TestCreateDefaultPolicy01" };
      const { resource: containerNoIndexPolicyDef } =
        await database.containers.create(containerDefinition01);
      checkDefaultIndexingPolicyPaths(containerNoIndexPolicyDef["indexingPolicy"]);

      // create container with default policy.
      const containerDefinition03 = {
        id: "TestCreateDefaultPolicy03",
        indexingPolicy: {},
      };
      const { resource: containerDefaultPolicy } =
        await database.containers.create(containerDefinition03);
      checkDefaultIndexingPolicyPaths((containerDefaultPolicy as any)["indexingPolicy"]);

      // create container with indexing policy missing indexes.
      const containerDefinition04 = {
        id: "TestCreateDefaultPolicy04",
        indexingPolicy: {
          includedPaths: [
            {
              path: "/*",
            },
          ],
        },
      };
      const { resource: containerMissingIndexes } =
        await database.containers.create(containerDefinition04);
      checkDefaultIndexingPolicyPaths((containerMissingIndexes as any)["indexingPolicy"]);

      // create container with indexing policy missing precision.
      const containerDefinition05 = {
        id: "TestCreateDefaultPolicy05",
        indexingPolicy: {
          includedPaths: [
            {
              path: "/*",
              indexes: [
                {
                  kind: IndexKind.Range,
                  dataType: DataType.String,
                },
                {
                  kind: IndexKind.Range,
                  dataType: DataType.Number,
                },
              ],
            },
          ],
        },
      };
      const { resource: containerMissingPrecision } =
        await database.containers.create(containerDefinition05);
      checkDefaultIndexingPolicyPaths((containerMissingPrecision as any)["indexingPolicy"]);
    });
  });

  describe("Validate response headers", () => {
    const createThenReadcontainer = async function (
      database: Database,
      definition: ContainerDefinition,
    ): Promise<ContainerResponse> {
      const { container: createdcontainer } = await database.containers.create(definition);
      const response = await database
        .container(createdcontainer.id)
        .read({ populateQuotaInfo: true });
      return response;
    };

    const indexProgressHeadersTest = async function (): Promise<void> {
      const database = await getTestDatabase("Validate response headers");
      const { headers: headers1 } = await createThenReadcontainer(database, {
        id: "consistent_coll",
      });
      assert.notEqual(headers1[Constants.HttpHeaders.IndexTransformationProgress], undefined);
      assert.equal(headers1[Constants.HttpHeaders.LazyIndexingProgress], undefined);

      const noneContainerDefinition = {
        id: "none_coll",
        indexingPolicy: { indexingMode: IndexingMode.none, automatic: false },
      };
      const { headers: headers3 } = await createThenReadcontainer(
        database,
        noneContainerDefinition,
      );
      assert.notEqual(headers3[Constants.HttpHeaders.IndexTransformationProgress], undefined);
      assert.equal(headers3[Constants.HttpHeaders.LazyIndexingProgress], undefined);
    };

    it("nativeApi Validate index progress headers name based", async () => {
      await indexProgressHeadersTest();
    });
  });
});

describe("createIfNotExists", () => {
  let database: Database;

  beforeAll(async () => {
    // create database
    database = await getTestDatabase("containers.createIfNotExists");
  });

  it("create container should work if container does not already exist", async () => {
    const def: ContainerDefinition = { id: "does not exist" };
    const { container } = await database.containers.createIfNotExists(def);
    const { resource: readDef } = await container.read();
    assert.equal(def.id, readDef.id);
  });

  it("create container should work if container already exists", async () => {
    const def: ContainerDefinition = { id: "does exist" };
    await database.containers.create(def);

    const { container } = await database.containers.createIfNotExists(def);
    const { resource: readDef } = await container.read();
    assert.equal(def.id, readDef.id);
  });

  it("create container should work if container does not exist - with hierarchical partitions", async () => {
    const def: ContainerDefinition = {
      id: "does not exist hierarchical partitions",
      partitionKey: {
        paths: ["/key1", "/key2"],
        kind: PartitionKeyKind.MultiHash,
        version: 2,
      },
    };
    const { container } = await database.containers.createIfNotExists(def);
    const { resource: readDef } = await container.read();
    assert.equal(def.id, readDef.id);
  });

  it("create container should work if container already exists - with hierarchical partitions", async () => {
    const def: ContainerDefinition = {
      id: "does exist hierarchical partitions",
      partitionKey: {
        paths: ["/key1", "/key2"],
        kind: PartitionKeyKind.MultiHash,
        version: 2,
      },
    };
    await database.containers.create(def);

    const { container } = await database.containers.createIfNotExists(def);
    const { resource: readDef } = await container.read();
    assert.equal(def.id, readDef.id);
  });
});

describe("container.readOffer", () => {
  let containerWithOffer: Container;
  let containerWithoutOffer: Container;
  let container2WithOffer: Container;
  let container2WithoutOffer: Container;
  const containerRequestWithOffer: ContainerRequest = {
    id: "sample",
    throughput: 400,
  };
  const containerRequest: ContainerRequest = {
    id: "sample-offerless",
  };
  let offerDatabase: Database;

  beforeAll(async () => {
    offerDatabase = await getTestDatabase("has offer");
    containerWithOffer = await getTestContainer(
      "offerContainer",
      undefined,
      containerRequestWithOffer,
    );
    containerWithoutOffer = await getTestContainer("container", undefined, containerRequest);
    const response1 = await offerDatabase.containers.create(containerRequestWithOffer);
    const response2 = await offerDatabase.containers.create(containerRequest);
    container2WithOffer = response1.container;
    container2WithoutOffer = response2.container;
  });

  describe("database does not have offer", () => {
    it("has offer", async () => {
      const offer: any = await containerWithOffer.readOffer();
      const { resource: readDef } = await containerWithOffer.read();
      assert.equal(offer.resource.offerResourceId, readDef._rid);
    });

    it("does not have offer so uses default", async () => {
      const offer: any = await containerWithoutOffer.readOffer();
      const { resource: readDef } = await containerWithoutOffer.read();
      assert.equal(offer.resource.offerResourceId, readDef._rid);
    });
  });

  describe("database has offer", () => {
    it("container does not have offer", async () => {
      const offer: any = await container2WithoutOffer.readOffer();
      const { resource: readDef } = await container2WithoutOffer.read();
      assert.equal(offer.resource.offerResourceId, readDef._rid);
    });

    it("container has offer", async () => {
      const offer: any = await container2WithOffer.readOffer();
      const { resource: readDef } = await container2WithOffer.read();
      assert.equal(offer.resource.offerResourceId, readDef._rid);
    });
  });
});

describe("container.create", () => {
  let database: Database;

  beforeAll(async () => {
    database = await getTestDatabase("autoscale test");
  });

  it("uses autoscale", async () => {
    const maxThroughput = 50000;
    const containerRequest: ContainerRequest = {
      id: "sample",
      maxThroughput,
    };
    const { container } = await database.containers.create(containerRequest);
    const { resource: offer } = await container.readOffer();
    const settings = offer.content.offerAutopilotSettings;
    assert.equal(settings.maxThroughput, maxThroughput);
  });

  it("throws with maxThroughput and throughput", () => {
    const containerRequest: ContainerRequest = {
      id: "sample",
      throughput: 400,
      maxThroughput: 400,
    };
    assertThrowsAsync(() => database.containers.create(containerRequest));
  });
});

describe("Reading items using container", () => {
  it("should be able to read item based on partition key value", async () => {
    const container = await getTestContainer("container", undefined, {
      partitionKey: { paths: ["/key1", "/key2"], kind: PartitionKeyKind.MultiHash, version: 2 },
    });
    const itemWithNoPartitionKeySet = addEntropy("item1");
    const itemWithOnePartitionKeySet = addEntropy("item2");
    const itemWithBothPartitionKeySet = addEntropy("item3");

    const itemWithNoPartitionKeySetDef = {
      id: itemWithNoPartitionKeySet,
    };
    const itemWithOnePartitionKeySetDef = {
      id: itemWithOnePartitionKeySet,
      key1: "a",
    };
    const itemWithBothPartitionKeySetDef = {
      id: itemWithBothPartitionKeySet,
      key1: "a",
      key2: "b",
    };

    await container.items.create(itemWithNoPartitionKeySetDef);
    const { resource: itemRead1 } = await container.item(itemWithNoPartitionKeySet).read();
    assert.strictEqual(itemRead1.id, itemWithNoPartitionKeySet);

    await container.items.create(itemWithOnePartitionKeySetDef);
    const { resource: itemRead2 } = await container
      .item(itemWithOnePartitionKeySet, ["a", undefined])
      .read();
    assert.strictEqual(itemRead2.id, itemWithOnePartitionKeySet);

    try {
      await container.item(itemWithOnePartitionKeySet, ["a"]).read();
      assert(false, "Should have thrown exception due to improper partition key passed.");
    } catch (err: any) {
      assert.strictEqual(err.code, 400, "Should fail due to improper partition key given");
    }

    await container.items.create(itemWithBothPartitionKeySetDef);
    const { resource: itemRead3 } = await container
      .item(itemWithBothPartitionKeySet, ["a", "b"])
      .read();
    assert.strictEqual(itemRead3.id, itemWithBothPartitionKeySet);
  });
});

describe.skipIf(skipTestForSignOff)("container.deleteAllItemsForPartitionKey", () => {
  it("should delete all items for partition key value", async () => {
    const container = await getTestContainer("container", undefined, { partitionKey: "/pk" });
    await testDeleteAllItemsForPartitionKey(container);
  });

  it("should delete all items for partition key value in multi partition container", async () => {
    //  multi partition container
    const container = await getTestContainer("container", undefined, {
      partitionKey: {
        paths: ["/pk"],
        version: 2,
      },
      throughput: 10500,
    });
    await testDeleteAllItemsForPartitionKey(container);
  });

  async function testDeleteAllItemsForPartitionKey(container: Container): Promise<void> {
    const { resource: create1 } = await container.items.create({
      id: "1",
      key: "value",
      pk: "pk",
    });
    const { resource: create2 } = await container.items.create({
      id: "2",
      key: "value",
      pk: "pk",
    });
    const { resource: create3 } = await container.items.create({
      id: "3",
      key: "value",
      pk: "rk",
    });
    await container.deleteAllItemsForPartitionKey("pk");
    assert((await container.item(create1.id).read()).statusCode === StatusCodes.NotFound);
    assert((await container.item(create2.id).read()).statusCode === StatusCodes.NotFound);
    assert((await container.item(create3.id).read()).item.id === create3.id);
  }
});
