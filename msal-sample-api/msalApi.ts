import { Configuration, ConfidentialClientApplication, LogLevel as MsalLogLevel, ClientCredentialRequest, IAppTokenProvider } from '@azure/msal-node';
import { DefaultAzureCredential, ManagedIdentityCredential } from '@azure/identity';
import { TokenProvider } from './tokenProvider';
import * as uuid from 'uuid';

// MSAL configuration
const msalConfig: Configuration = {
    auth: {
        clientId: 'c00a3fc1-9b92-4ccf-a026-64033c5bb652',
        authority: 'https://login.microsoftonline.com/088eea98-8ff6-4e87-87b7-b27f2f3068b0',
        clientSecret: ""
    }
};

const frsClaims = {
    documentId: uuid.v4(),
    tenantId: uuid.v4()
}

class MsalApi {
    pca: ConfidentialClientApplication;
    credential: ManagedIdentityCredential;

    constructor(msalConfig: Configuration) {
        const clientId = ""
        const tokenProvider = new TokenProvider(clientId);
        this.pca = new ConfidentialClientApplication(msalConfig);
        // this.pca.SetAppTokenProvider(tokenProvider.getToken);
    }

    async getAuthCodeUrl() {
        try {
            const request: ClientCredentialRequest = {
                scopes: ["c00a3fc1-9b92-4ccf-a026-64033c5bb652/.default"],
                claims: JSON.stringify(frsClaims)
            }
            // Define the request parameters
            const response = await this.pca.acquireTokenByClientCredential(request)
            return response;
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    async runInLoop(iters: number) {
        let avgTimeTaken = 0;
        let minTime = Number.MAX_VALUE;
        let maxTime = Number.MIN_VALUE;
        // Get the authorization URL
        for (let i=0; i<iters; i++) {
            const curr = Date.now();
            const msalApi = new MsalApi(msalConfig);
            const response = await msalApi.getAuthCodeUrl();
            const timeTaken = (Date.now() - curr)/1000;
            if (timeTaken < minTime) {
                minTime = timeTaken;
            }
            if (timeTaken > maxTime) {
                maxTime = timeTaken;
            }
            if (i % 1000 === 0) {
                console.log(response);
                console.log(`Time taken for iteration ${i}: ${timeTaken} seconds`);
            }
            avgTimeTaken += timeTaken;
        }
        return {
            avgTime: avgTimeTaken/iters,
            minTime: minTime,
            maxTime: maxTime
        }
    }
}

const msalApi = new MsalApi(msalConfig);
const iters = 10000;
msalApi.runInLoop(iters).then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});

// console.log(`Average time taken: ${avgTimeTaken/5} seconds`);

// const clientId = ""
// console.log("Getting token from Azure AD");
// const credential = new ManagedIdentityCredential(clientId);
// console.log("Credential created");
// const scopes = ["15f684d8-29ec-488a-9d69-40a250643d1d/.default"];
// credential.getToken(scopes).then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.log(error);
// });