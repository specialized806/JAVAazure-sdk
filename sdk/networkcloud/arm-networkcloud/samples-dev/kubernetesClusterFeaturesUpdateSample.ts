/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  KubernetesClusterFeaturePatchParameters,
  KubernetesClusterFeaturesUpdateOptionalParams,
  NetworkCloud,
} from "@azure/arm-networkcloud";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Patch properties of the provided Kubernetes cluster feature.
 *
 * @summary Patch properties of the provided Kubernetes cluster feature.
 * x-ms-original-file: specification/networkcloud/resource-manager/Microsoft.NetworkCloud/stable/2025-02-01/examples/KubernetesClusterFeatures_Patch.json
 */
async function patchKubernetesClusterFeature(): Promise<void> {
  const subscriptionId =
    process.env["NETWORKCLOUD_SUBSCRIPTION_ID"] ||
    "123e4567-e89b-12d3-a456-426655440000";
  const resourceGroupName =
    process.env["NETWORKCLOUD_RESOURCE_GROUP"] || "resourceGroupName";
  const kubernetesClusterName = "kubernetesClusterName";
  const featureName = "featureName";
  const kubernetesClusterFeatureUpdateParameters: KubernetesClusterFeaturePatchParameters =
    {
      options: [{ key: "featureOptionName", value: "featureOptionValue" }],
      tags: { key1: "myvalue1", key2: "myvalue2" },
    };
  const options: KubernetesClusterFeaturesUpdateOptionalParams = {
    kubernetesClusterFeatureUpdateParameters,
  };
  const credential = new DefaultAzureCredential();
  const client = new NetworkCloud(credential, subscriptionId);
  const result = await client.kubernetesClusterFeatures.beginUpdateAndWait(
    resourceGroupName,
    kubernetesClusterName,
    featureName,
    options,
  );
  console.log(result);
}

async function main(): Promise<void> {
  await patchKubernetesClusterFeature();
}

main().catch(console.error);
