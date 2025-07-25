/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  OperationParameter,
  OperationURLParameter,
  OperationQueryParameter,
} from "@azure/core-client";
import {
  SearchService as SearchServiceMapper,
  SearchServiceUpdate as SearchServiceUpdateMapper,
  CheckNameAvailabilityInput as CheckNameAvailabilityInputMapper,
  PrivateEndpointConnection as PrivateEndpointConnectionMapper,
  SharedPrivateLinkResource as SharedPrivateLinkResourceMapper,
} from "../models/mappers.js";

export const accept: OperationParameter = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String",
    },
  },
};

export const $host: OperationURLParameter = {
  parameterPath: "$host",
  mapper: {
    serializedName: "$host",
    required: true,
    type: {
      name: "String",
    },
  },
  skipEncoding: true,
};

export const apiVersion: OperationQueryParameter = {
  parameterPath: "apiVersion",
  mapper: {
    defaultValue: "2025-05-01",
    isConstant: true,
    serializedName: "api-version",
    type: {
      name: "String",
    },
  },
};

export const resourceGroupName: OperationURLParameter = {
  parameterPath: "resourceGroupName",
  mapper: {
    serializedName: "resourceGroupName",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const searchServiceName: OperationURLParameter = {
  parameterPath: "searchServiceName",
  mapper: {
    constraints: {
      Pattern: new RegExp("^(?=.{2,60}$)[a-z0-9][a-z0-9]+(-[a-z0-9]+)*$"),
    },
    serializedName: "searchServiceName",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const clientRequestId: OperationParameter = {
  parameterPath: ["options", "searchManagementRequestOptions", "clientRequestId"],
  mapper: {
    serializedName: "x-ms-client-request-id",
    type: {
      name: "Uuid",
    },
  },
};

export const subscriptionId: OperationURLParameter = {
  parameterPath: "subscriptionId",
  mapper: {
    serializedName: "subscriptionId",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const keyKind: OperationURLParameter = {
  parameterPath: "keyKind",
  mapper: {
    serializedName: "keyKind",
    required: true,
    type: {
      name: "Enum",
      allowedValues: ["primary", "secondary"],
    },
  },
};

export const name: OperationURLParameter = {
  parameterPath: "name",
  mapper: {
    serializedName: "name",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const key: OperationURLParameter = {
  parameterPath: "key",
  mapper: {
    serializedName: "key",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const nextLink: OperationURLParameter = {
  parameterPath: "nextLink",
  mapper: {
    serializedName: "nextLink",
    required: true,
    type: {
      name: "String",
    },
  },
  skipEncoding: true,
};

export const contentType: OperationParameter = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String",
    },
  },
};

export const service: OperationParameter = {
  parameterPath: "service",
  mapper: SearchServiceMapper,
};

export const searchServiceName1: OperationURLParameter = {
  parameterPath: "searchServiceName",
  mapper: {
    serializedName: "searchServiceName",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const service1: OperationParameter = {
  parameterPath: "service",
  mapper: SearchServiceUpdateMapper,
};

export const name1: OperationParameter = {
  parameterPath: "name",
  mapper: CheckNameAvailabilityInputMapper,
};

export const typeParam: OperationParameter = {
  parameterPath: "typeParam",
  mapper: CheckNameAvailabilityInputMapper,
};

export const privateEndpointConnection: OperationParameter = {
  parameterPath: "privateEndpointConnection",
  mapper: PrivateEndpointConnectionMapper,
};

export const privateEndpointConnectionName: OperationURLParameter = {
  parameterPath: "privateEndpointConnectionName",
  mapper: {
    serializedName: "privateEndpointConnectionName",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const sharedPrivateLinkResource: OperationParameter = {
  parameterPath: "sharedPrivateLinkResource",
  mapper: SharedPrivateLinkResourceMapper,
};

export const sharedPrivateLinkResourceName: OperationURLParameter = {
  parameterPath: "sharedPrivateLinkResourceName",
  mapper: {
    serializedName: "sharedPrivateLinkResourceName",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const location: OperationURLParameter = {
  parameterPath: "location",
  mapper: {
    serializedName: "location",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const skuName: OperationURLParameter = {
  parameterPath: "skuName",
  mapper: {
    serializedName: "skuName",
    required: true,
    type: {
      name: "String",
    },
  },
};

export const nspConfigName: OperationURLParameter = {
  parameterPath: "nspConfigName",
  mapper: {
    constraints: {
      Pattern: new RegExp("^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}\\.[a-z][a-z0-9]*$"),
      MaxLength: 100,
      MinLength: 38,
    },
    serializedName: "nspConfigName",
    required: true,
    type: {
      name: "String",
    },
  },
};
