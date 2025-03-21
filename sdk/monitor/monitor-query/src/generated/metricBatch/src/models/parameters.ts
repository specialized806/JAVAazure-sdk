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
  OperationQueryParameter
} from "@azure/core-client";
import { ResourceIdList as ResourceIdListMapper } from "../models/mappers.js";

export const contentType: OperationParameter = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String"
    }
  }
};

export const batchRequest: OperationParameter = {
  parameterPath: "batchRequest",
  mapper: ResourceIdListMapper
};

export const accept: OperationParameter = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String"
    }
  }
};

export const endpoint: OperationURLParameter = {
  parameterPath: "endpoint",
  mapper: {
    serializedName: "endpoint",
    required: true,
    type: {
      name: "String"
    }
  },
  skipEncoding: true
};

export const subscriptionId: OperationURLParameter = {
  parameterPath: "subscriptionId",
  mapper: {
    serializedName: "subscriptionId",
    required: true,
    type: {
      name: "Uuid"
    }
  }
};

export const starttime: OperationQueryParameter = {
  parameterPath: ["options", "starttime"],
  mapper: {
    serializedName: "starttime",
    type: {
      name: "String"
    }
  }
};

export const endtime: OperationQueryParameter = {
  parameterPath: ["options", "endtime"],
  mapper: {
    serializedName: "endtime",
    type: {
      name: "String"
    }
  }
};

export const interval: OperationQueryParameter = {
  parameterPath: ["options", "interval"],
  mapper: {
    defaultValue: "PT1M",
    serializedName: "interval",
    type: {
      name: "String"
    }
  }
};

export const metricnamespace: OperationQueryParameter = {
  parameterPath: "metricnamespace",
  mapper: {
    serializedName: "metricnamespace",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const metricnames: OperationQueryParameter = {
  parameterPath: "metricnames",
  mapper: {
    serializedName: "metricnames",
    required: true,
    type: {
      name: "Sequence",
      element: {
        type: {
          name: "String"
        }
      }
    }
  },
  collectionFormat: "CSV"
};

export const aggregation: OperationQueryParameter = {
  parameterPath: ["options", "aggregation"],
  mapper: {
    serializedName: "aggregation",
    type: {
      name: "String"
    }
  }
};

export const top: OperationQueryParameter = {
  parameterPath: ["options", "top"],
  mapper: {
    serializedName: "top",
    type: {
      name: "Number"
    }
  }
};

export const orderby: OperationQueryParameter = {
  parameterPath: ["options", "orderby"],
  mapper: {
    serializedName: "orderby",
    type: {
      name: "String"
    }
  }
};

export const filter: OperationQueryParameter = {
  parameterPath: ["options", "filter"],
  mapper: {
    serializedName: "filter",
    type: {
      name: "String"
    }
  }
};

export const rollupby: OperationQueryParameter = {
  parameterPath: ["options", "rollupby"],
  mapper: {
    serializedName: "rollupby",
    type: {
      name: "String"
    }
  }
};

export const apiVersion: OperationQueryParameter = {
  parameterPath: "apiVersion",
  mapper: {
    serializedName: "api-version",
    required: true,
    type: {
      name: "String"
    }
  }
};
