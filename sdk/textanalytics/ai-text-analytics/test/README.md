# Testing

To test this project, make sure to build it by following our [building instructions](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md#building), then follow the [testing instructions](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md#testing).

You can use existing Azure resources for the live tests, or generate new ones by using our [New-TestResources.ps1](https://github.com/Azure/azure-sdk-for-js/blob/main/eng/common/TestResources/New-TestResources.ps1) script, which will use a [Bicep template](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/textanalytics/test-resources.bicep) that already has all of the the necessary configurations.

The Azure resource that is used by the tests in this project is:

- An [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) account of the Text Analytics type.

To run the live tests, you will also need to set the environment variables specified in the `test/sample.env` file:

In addition to the environment variables above, an Azure Active Directory identity configuration is required. See the [README file for the @azure/identity package](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) for more details on how to configure an identity for local testing. The test configuration uses the `DefaultAzureCredential` to request an authentication token, so any authentication method that is exposed by `DefaultAzureCredential` will be sufficient to run the tests. The next section will explain how to grant access to your Cognitive Services account to the user or application you wish to use for testing.

## AAD-based Authentication

In order to use Azure Active Directory to run the live tests, you will need to configure a role assignment within your AAD tenant.

### Using an App Registration (Service Principal)

- Follow [Documentation to register a new application](https://learn.microsoft.com/azure/active-directory/develop/quickstart-register-app) in the Azure Active Directory (in the Azure portal).
- Note the Client ID and Tenant ID.
- In the "Certificates & Secrets" tab, create a secret and note that down.
- Ensure the following environment variables are set:
  - `AZURE_TENANT_ID="<your tenant ID>"`
  - `AZURE_CLIENT_ID="<your client ID>"`
  - `AZURE_CLIENT_SECRET="<the client secret>"`

### Using a User Account

As an alternative to creating a service principal, you can use a simple user account. This is not recommended for production, but may be useful for development and testing. Using a User Account requires either the Azure CLI or Visual Studio Code with the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

- Create an account in your Azure Active Directory tenant (or use the default account associated with your Microsoft account)
- Log in to the account, either using the Azure CLI (`az login` command) or though the VS Code Azure Account extension.

Once you are logged in, the `DefaultAzureCredential` will use the identity of the account when communicating with the Cognitive Services endpoint.

### Assign the Cognitive Services User role to your user

- In the Azure portal, go to your Cognitive Services resource and assign the **Cognitive Services User** role to the registered application (if using an Application Service Principal) or to your user account.
  - This can be done from `Role assignment` section of `Access control (IAM)` tab (in the left-side-navbar of your Cognitive Services resource in the Azure portal)<br>_Doing this will allow anyone with your application or user's credentials and/or access token to utilize the endpoint resources._

After configuring your account's permissions and setting up the authenticated environment, you should be able to run the live tests.
