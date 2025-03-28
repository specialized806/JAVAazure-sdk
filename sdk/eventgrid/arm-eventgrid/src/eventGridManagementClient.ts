/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreClient from "@azure/core-client";
import * as coreRestPipeline from "@azure/core-rest-pipeline";
import {
  PipelineRequest,
  PipelineResponse,
  SendRequest,
} from "@azure/core-rest-pipeline";
import * as coreAuth from "@azure/core-auth";
import {
  CaCertificatesImpl,
  ChannelsImpl,
  ClientGroupsImpl,
  ClientsImpl,
  DomainsImpl,
  DomainTopicsImpl,
  TopicEventSubscriptionsImpl,
  DomainEventSubscriptionsImpl,
  NamespaceTopicEventSubscriptionsImpl,
  EventSubscriptionsImpl,
  DomainTopicEventSubscriptionsImpl,
  SystemTopicEventSubscriptionsImpl,
  PartnerTopicEventSubscriptionsImpl,
  NamespacesImpl,
  NamespaceTopicsImpl,
  OperationsImpl,
  TopicsImpl,
  PartnerConfigurationsImpl,
  PartnerNamespacesImpl,
  PartnerRegistrationsImpl,
  PartnerTopicsImpl,
  PermissionBindingsImpl,
  PrivateEndpointConnectionsImpl,
  PrivateLinkResourcesImpl,
  SystemTopicsImpl,
  ExtensionTopicsImpl,
  TopicSpacesImpl,
  TopicTypesImpl,
  VerifiedPartnersImpl,
} from "./operations/index.js";
import {
  CaCertificates,
  Channels,
  ClientGroups,
  Clients,
  Domains,
  DomainTopics,
  TopicEventSubscriptions,
  DomainEventSubscriptions,
  NamespaceTopicEventSubscriptions,
  EventSubscriptions,
  DomainTopicEventSubscriptions,
  SystemTopicEventSubscriptions,
  PartnerTopicEventSubscriptions,
  Namespaces,
  NamespaceTopics,
  Operations,
  Topics,
  PartnerConfigurations,
  PartnerNamespaces,
  PartnerRegistrations,
  PartnerTopics,
  PermissionBindings,
  PrivateEndpointConnections,
  PrivateLinkResources,
  SystemTopics,
  ExtensionTopics,
  TopicSpaces,
  TopicTypes,
  VerifiedPartners,
} from "./operationsInterfaces/index.js";
import { EventGridManagementClientOptionalParams } from "./models/index.js";

export class EventGridManagementClient extends coreClient.ServiceClient {
  $host: string;
  subscriptionId?: string;
  apiVersion: string;

  /**
   * Initializes a new instance of the EventGridManagementClient class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param subscriptionId Subscription credentials that uniquely identify a Microsoft Azure
   *                       subscription. The subscription ID forms part of the URI for every service call.
   * @param options The parameter options
   */
  constructor(
    credentials: coreAuth.TokenCredential,
    subscriptionId: string,
    options?: EventGridManagementClientOptionalParams,
  );
  constructor(
    credentials: coreAuth.TokenCredential,
    options?: EventGridManagementClientOptionalParams,
  );
  constructor(
    credentials: coreAuth.TokenCredential,
    subscriptionIdOrOptions?: EventGridManagementClientOptionalParams | string,
    options?: EventGridManagementClientOptionalParams,
  ) {
    if (credentials === undefined) {
      throw new Error("'credentials' cannot be null");
    }

    let subscriptionId: string | undefined;

    if (typeof subscriptionIdOrOptions === "string") {
      subscriptionId = subscriptionIdOrOptions;
    } else if (typeof subscriptionIdOrOptions === "object") {
      options = subscriptionIdOrOptions;
    }

    // Initializing default values for options
    if (!options) {
      options = {};
    }
    const defaults: EventGridManagementClientOptionalParams = {
      requestContentType: "application/json; charset=utf-8",
      credential: credentials,
    };

    const packageDetails = `azsdk-js-arm-eventgrid/14.2.0`;
    const userAgentPrefix =
      options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${packageDetails}`
        : `${packageDetails}`;

    const optionsWithDefaults = {
      ...defaults,
      ...options,
      userAgentOptions: {
        userAgentPrefix,
      },
      endpoint:
        options.endpoint ?? options.baseUri ?? "https://management.azure.com",
    };
    super(optionsWithDefaults);

    let bearerTokenAuthenticationPolicyFound: boolean = false;
    if (options?.pipeline && options.pipeline.getOrderedPolicies().length > 0) {
      const pipelinePolicies: coreRestPipeline.PipelinePolicy[] =
        options.pipeline.getOrderedPolicies();
      bearerTokenAuthenticationPolicyFound = pipelinePolicies.some(
        (pipelinePolicy) =>
          pipelinePolicy.name ===
          coreRestPipeline.bearerTokenAuthenticationPolicyName,
      );
    }
    if (
      !options ||
      !options.pipeline ||
      options.pipeline.getOrderedPolicies().length == 0 ||
      !bearerTokenAuthenticationPolicyFound
    ) {
      this.pipeline.removePolicy({
        name: coreRestPipeline.bearerTokenAuthenticationPolicyName,
      });
      this.pipeline.addPolicy(
        coreRestPipeline.bearerTokenAuthenticationPolicy({
          credential: credentials,
          scopes:
            optionsWithDefaults.credentialScopes ??
            `${optionsWithDefaults.endpoint}/.default`,
          challengeCallbacks: {
            authorizeRequestOnChallenge:
              coreClient.authorizeRequestOnClaimChallenge,
          },
        }),
      );
    }
    // Parameter assignments
    this.subscriptionId = subscriptionId;

    // Assigning values to Constant parameters
    this.$host = options.$host || "https://management.azure.com";
    this.apiVersion = options.apiVersion || "2025-02-15";
    this.caCertificates = new CaCertificatesImpl(this);
    this.channels = new ChannelsImpl(this);
    this.clientGroups = new ClientGroupsImpl(this);
    this.clients = new ClientsImpl(this);
    this.domains = new DomainsImpl(this);
    this.domainTopics = new DomainTopicsImpl(this);
    this.topicEventSubscriptions = new TopicEventSubscriptionsImpl(this);
    this.domainEventSubscriptions = new DomainEventSubscriptionsImpl(this);
    this.namespaceTopicEventSubscriptions =
      new NamespaceTopicEventSubscriptionsImpl(this);
    this.eventSubscriptions = new EventSubscriptionsImpl(this);
    this.domainTopicEventSubscriptions = new DomainTopicEventSubscriptionsImpl(
      this,
    );
    this.systemTopicEventSubscriptions = new SystemTopicEventSubscriptionsImpl(
      this,
    );
    this.partnerTopicEventSubscriptions =
      new PartnerTopicEventSubscriptionsImpl(this);
    this.namespaces = new NamespacesImpl(this);
    this.namespaceTopics = new NamespaceTopicsImpl(this);
    this.operations = new OperationsImpl(this);
    this.topics = new TopicsImpl(this);
    this.partnerConfigurations = new PartnerConfigurationsImpl(this);
    this.partnerNamespaces = new PartnerNamespacesImpl(this);
    this.partnerRegistrations = new PartnerRegistrationsImpl(this);
    this.partnerTopics = new PartnerTopicsImpl(this);
    this.permissionBindings = new PermissionBindingsImpl(this);
    this.privateEndpointConnections = new PrivateEndpointConnectionsImpl(this);
    this.privateLinkResources = new PrivateLinkResourcesImpl(this);
    this.systemTopics = new SystemTopicsImpl(this);
    this.extensionTopics = new ExtensionTopicsImpl(this);
    this.topicSpaces = new TopicSpacesImpl(this);
    this.topicTypes = new TopicTypesImpl(this);
    this.verifiedPartners = new VerifiedPartnersImpl(this);
    this.addCustomApiVersionPolicy(options.apiVersion);
  }

  /** A function that adds a policy that sets the api-version (or equivalent) to reflect the library version. */
  private addCustomApiVersionPolicy(apiVersion?: string) {
    if (!apiVersion) {
      return;
    }
    const apiVersionPolicy = {
      name: "CustomApiVersionPolicy",
      async sendRequest(
        request: PipelineRequest,
        next: SendRequest,
      ): Promise<PipelineResponse> {
        const param = request.url.split("?");
        if (param.length > 1) {
          const newParams = param[1].split("&").map((item) => {
            if (item.indexOf("api-version") > -1) {
              return "api-version=" + apiVersion;
            } else {
              return item;
            }
          });
          request.url = param[0] + "?" + newParams.join("&");
        }
        return next(request);
      },
    };
    this.pipeline.addPolicy(apiVersionPolicy);
  }

  caCertificates: CaCertificates;
  channels: Channels;
  clientGroups: ClientGroups;
  clients: Clients;
  domains: Domains;
  domainTopics: DomainTopics;
  topicEventSubscriptions: TopicEventSubscriptions;
  domainEventSubscriptions: DomainEventSubscriptions;
  namespaceTopicEventSubscriptions: NamespaceTopicEventSubscriptions;
  eventSubscriptions: EventSubscriptions;
  domainTopicEventSubscriptions: DomainTopicEventSubscriptions;
  systemTopicEventSubscriptions: SystemTopicEventSubscriptions;
  partnerTopicEventSubscriptions: PartnerTopicEventSubscriptions;
  namespaces: Namespaces;
  namespaceTopics: NamespaceTopics;
  operations: Operations;
  topics: Topics;
  partnerConfigurations: PartnerConfigurations;
  partnerNamespaces: PartnerNamespaces;
  partnerRegistrations: PartnerRegistrations;
  partnerTopics: PartnerTopics;
  permissionBindings: PermissionBindings;
  privateEndpointConnections: PrivateEndpointConnections;
  privateLinkResources: PrivateLinkResources;
  systemTopics: SystemTopics;
  extensionTopics: ExtensionTopics;
  topicSpaces: TopicSpaces;
  topicTypes: TopicTypes;
  verifiedPartners: VerifiedPartners;
}
