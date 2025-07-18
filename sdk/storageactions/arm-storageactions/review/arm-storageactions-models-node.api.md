## API Report File for "@azure/arm-storageactions"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export type ActionType = string;

// @public
export type CreatedByType = string;

// @public
export interface ElseCondition {
    operations: StorageTaskOperation[];
}

// @public
export interface ErrorAdditionalInfo {
    readonly info?: any;
    readonly type?: string;
}

// @public
export interface ErrorDetail {
    readonly additionalInfo?: ErrorAdditionalInfo[];
    readonly code?: string;
    readonly details?: ErrorDetail[];
    readonly message?: string;
    readonly target?: string;
}

// @public
export interface ErrorResponse {
    error?: ErrorDetail;
}

// @public
export interface IfCondition {
    condition: string;
    operations: StorageTaskOperation[];
}

// @public
export enum KnownActionType {
    Internal = "Internal"
}

// @public
export enum KnownCreatedByType {
    Application = "Application",
    Key = "Key",
    ManagedIdentity = "ManagedIdentity",
    User = "User"
}

// @public
export enum KnownManagedServiceIdentityType {
    None = "None",
    SystemAssigned = "SystemAssigned",
    SystemAssignedUserAssigned = "SystemAssigned,UserAssigned",
    UserAssigned = "UserAssigned"
}

// @public
export enum KnownMatchedBlockName {
    // (undocumented)
    Else = "Else",
    // (undocumented)
    If = "If",
    // (undocumented)
    None = "None"
}

// @public
export enum KnownOnFailure {
    // (undocumented)
    Break = "break"
}

// @public
export enum KnownOnSuccess {
    // (undocumented)
    Continue = "continue"
}

// @public
export enum KnownOrigin {
    System = "system",
    User = "user",
    UserSystem = "user,system"
}

// @public
export enum KnownProvisioningState {
    // (undocumented)
    Accepted = "Accepted",
    // (undocumented)
    Canceled = "Canceled",
    // (undocumented)
    Creating = "Creating",
    // (undocumented)
    Deleting = "Deleting",
    // (undocumented)
    Failed = "Failed",
    // (undocumented)
    Succeeded = "Succeeded",
    // (undocumented)
    ValidateSubscriptionQuotaBegin = "ValidateSubscriptionQuotaBegin",
    // (undocumented)
    ValidateSubscriptionQuotaEnd = "ValidateSubscriptionQuotaEnd"
}

// @public
export enum KnownRunResult {
    // (undocumented)
    Failed = "Failed",
    // (undocumented)
    Succeeded = "Succeeded"
}

// @public
export enum KnownRunStatusEnum {
    // (undocumented)
    Finished = "Finished",
    // (undocumented)
    InProgress = "InProgress"
}

// @public
export enum KnownStorageTaskOperationName {
    // (undocumented)
    DeleteBlob = "DeleteBlob",
    // (undocumented)
    SetBlobExpiry = "SetBlobExpiry",
    // (undocumented)
    SetBlobImmutabilityPolicy = "SetBlobImmutabilityPolicy",
    // (undocumented)
    SetBlobLegalHold = "SetBlobLegalHold",
    // (undocumented)
    SetBlobTags = "SetBlobTags",
    // (undocumented)
    SetBlobTier = "SetBlobTier",
    // (undocumented)
    UndeleteBlob = "UndeleteBlob"
}

// @public
export enum KnownVersions {
    V20230101 = "2023-01-01"
}

// @public
export interface ManagedServiceIdentity {
    readonly principalId?: string;
    readonly tenantId?: string;
    type: ManagedServiceIdentityType;
    userAssignedIdentities?: Record<string, UserAssignedIdentity | null>;
}

// @public
export type ManagedServiceIdentityType = string;

// @public
export type MatchedBlockName = string;

// @public
export type OnFailure = string;

// @public
export type OnSuccess = string;

// @public
export interface Operation {
    readonly actionType?: ActionType;
    display?: OperationDisplay;
    readonly isDataAction?: boolean;
    readonly name?: string;
    readonly origin?: Origin;
}

// @public
export interface OperationDisplay {
    readonly description?: string;
    readonly operation?: string;
    readonly provider?: string;
    readonly resource?: string;
}

// @public
export type Origin = string;

// @public
export type ProvisioningState = string;

// @public
export interface ProxyResource extends Resource {
}

// @public
export interface Resource {
    readonly id?: string;
    readonly name?: string;
    readonly systemData?: SystemData;
    readonly type?: string;
}

// @public
export type RunResult = string;

// @public
export type RunStatusEnum = string;

// @public
export interface StorageTask extends TrackedResource {
    identity: ManagedServiceIdentity;
    properties: StorageTaskProperties;
}

// @public
export interface StorageTaskAction {
    else?: ElseCondition;
    if: IfCondition;
}

// @public
export interface StorageTaskAssignment {
    readonly id?: string;
}

// @public
export interface StorageTaskOperation {
    name: StorageTaskOperationName;
    onFailure?: OnFailure;
    onSuccess?: OnSuccess;
    parameters?: Record<string, string>;
}

// @public
export type StorageTaskOperationName = string;

// @public
export interface StorageTaskPreviewAction {
    properties: StorageTaskPreviewActionProperties;
}

// @public
export interface StorageTaskPreviewActionCondition {
    elseBlockExists: boolean;
    if: StorageTaskPreviewActionIfCondition;
}

// @public
export interface StorageTaskPreviewActionIfCondition {
    condition?: string;
}

// @public
export interface StorageTaskPreviewActionProperties {
    action: StorageTaskPreviewActionCondition;
    blobs: StorageTaskPreviewBlobProperties[];
    container: StorageTaskPreviewContainerProperties;
}

// @public
export interface StorageTaskPreviewBlobProperties {
    readonly matchedBlock?: MatchedBlockName;
    metadata?: StorageTaskPreviewKeyValueProperties[];
    name?: string;
    properties?: StorageTaskPreviewKeyValueProperties[];
    tags?: StorageTaskPreviewKeyValueProperties[];
}

// @public
export interface StorageTaskPreviewContainerProperties {
    metadata?: StorageTaskPreviewKeyValueProperties[];
    name?: string;
}

// @public
export interface StorageTaskPreviewKeyValueProperties {
    key?: string;
    value?: string;
}

// @public
export interface StorageTaskProperties {
    action: StorageTaskAction;
    readonly creationTimeInUtc?: Date;
    description: string;
    enabled: boolean;
    readonly provisioningState?: ProvisioningState;
    readonly taskVersion?: number;
}

// @public
export interface StorageTaskReportInstance extends ProxyResource {
    properties?: StorageTaskReportProperties;
}

// @public
export interface StorageTaskReportProperties {
    readonly finishTime?: string;
    readonly objectFailedCount?: string;
    readonly objectsOperatedOnCount?: string;
    readonly objectsSucceededCount?: string;
    readonly objectsTargetedCount?: string;
    readonly runResult?: RunResult;
    readonly runStatusEnum?: RunStatusEnum;
    readonly runStatusError?: string;
    readonly startTime?: string;
    readonly storageAccountId?: string;
    readonly summaryReportPath?: string;
    readonly taskAssignmentId?: string;
    readonly taskId?: string;
    readonly taskVersion?: string;
}

// @public
export interface StorageTaskUpdateParameters {
    identity?: ManagedServiceIdentity;
    properties?: StorageTaskUpdateProperties;
    tags?: Record<string, string>;
}

// @public
export interface StorageTaskUpdateProperties {
    action?: StorageTaskAction;
    readonly creationTimeInUtc?: Date;
    description?: string;
    enabled?: boolean;
    readonly provisioningState?: ProvisioningState;
    readonly taskVersion?: number;
}

// @public
export interface SystemData {
    createdAt?: Date;
    createdBy?: string;
    createdByType?: CreatedByType;
    lastModifiedAt?: Date;
    lastModifiedBy?: string;
    lastModifiedByType?: CreatedByType;
}

// @public
export interface TrackedResource extends Resource {
    location: string;
    tags?: Record<string, string>;
}

// @public
export interface UserAssignedIdentity {
    readonly clientId?: string;
    readonly principalId?: string;
}

// (No @packageDocumentation comment for this package)

```
