import { Configuration, ConfidentialClientApplication, LogLevel as MsalLogLevel, ClientCredentialRequest, IAppTokenProvider } from '@azure/msal-node';
import { DefaultAzureCredential, ManagedIdentityCredential } from '@azure/identity';
import { TokenProvider } from './tokenProvider';
import * as uuid from 'uuid';
import { time } from 'console';

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
        const times: number[] = [];
        let totalTime = 0;

        // Get the authorization URL
        for (let i=0; i<iters; i++) {
            const curr = Date.now();
            const response = await this.getAuthCodeUrl();
            const timeTaken = Date.now() - curr;
            times.push(timeTaken);
            totalTime += timeTaken;

            if (i % 1000 === 0) {
                console.log(response);
                console.log(`Time taken for iteration ${i}: ${timeTaken} milliseconds`);
            }
        }

        times.sort((a, b) => a - b);

        const p50 = times[Math.floor(0.50 * times.length)];
        const p75 = times[Math.floor(0.75 * times.length)];
        const p90 = times[Math.floor(0.90 * times.length)];
        const p95 = times[Math.floor(0.95 * times.length)];
        const p99 = times[Math.floor(0.99 * times.length)];

        return {
            avgTime: totalTime/times.length,
            minTime: times[0],
            maxTime: times[times.length - 1],
            p50: p50,
            p75: p75,
            p90: p90,
            p95: p95,
            p99: p99
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