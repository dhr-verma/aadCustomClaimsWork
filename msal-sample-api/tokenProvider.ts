import { AccessToken, ManagedIdentityCredential } from '@azure/identity';
import { IAppTokenProvider, AppTokenProviderParameters, AppTokenProviderResult} from '@azure/msal-common';

export class TokenProvider {

    constructor(private readonly msiClientId: string) {
    }

    public async getToken (
        appTokenProviderParameters: AppTokenProviderParameters
    ): Promise<AppTokenProviderResult> {
        // Implement the logic to get the token
        console.log(`App token provider parameters: ${JSON.stringify(appTokenProviderParameters)}`);
        const { scopes } = appTokenProviderParameters;
        console.log(`Fetching token from azure for scopes: ${scopes}`);

        // Example logic to get the token (this is just a placeholder)
        // const tokenResponse = await this.getTokenFromAzure(scopes);
        console.log("Getting token from Azure AD");
        const credential = new ManagedIdentityCredential(this.msiClientId);
        console.log("Credential created");
        const token = await credential.getToken(scopes);
        console.log("Token fetched");

        console.log(`Token fetched from azure: ${JSON.stringify(token)}`);

        return {
            accessToken: token.token,
            expiresInSeconds: (token.expiresOnTimestamp - Date.now())/1000
        };
    }
}