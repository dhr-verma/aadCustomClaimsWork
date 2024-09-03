import * as uuid from "uuid";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function customclaimstriggerpoc(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    context.log(`Http function processed request for method "${request.method}"`);
    context.log(`Http function processed request for method "${JSON.stringify(request)}"`);

    // const name = request.query.get('name') || await request.text() || 'world';

    // return { body: `Hello, ${name}!` };
    const data = request.body as any;
    context.log(`Http function data "${JSON.stringify(data)}"`);
    const correlationId = data?.authenticationContext?.correlationId;
    context.log(`CorrelationId "${correlationId}"`);

    const r = new ResponseContent();

    // r.data.actions[0].claims.correlationId = correlationId;
    // r.data.actions[0].claims.apiVersion = "2.0";
    // r.data.actions[0].claims.dateOfBirth = "1980-01-01";
    // r.data.actions[0].claims.customRoles.push("writer");
    // r.data.actions[0].claims.customRoles.push("editor");
    r.data.actions[0].claims.documentId = uuid.v4();
    r.data.actions[0].claims.tenantId = uuid.v4();
    context.log(`Response "${JSON.stringify(r)}"`);
    return {
        status: 200,
        body: JSON.stringify(r),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

class ResponseContent {
    public data: Data;

    constructor() {
        this.data = new Data();
    }
}

class Data {
    public odataType: string;
    public actions: Action[];

    constructor() {
        this.odataType = "microsoft.graph.onTokenIssuanceStartResponseData";
        this.actions = [];
        this.actions.push(new Action());
    }

    toJSON() {
        return {
            "@odata.type": this.odataType,
            actions: this.actions
        };
    }
}

class Action {
    public odataType: string;
    public claims: Claims;
    constructor() {
        this.odataType = "microsoft.graph.tokenIssuanceStart.provideClaimsForToken";
        this.claims = new Claims();
    }

    toJSON() {
        return {
            "@odata.type": this.odataType,
            claims: this.claims
        };
    }
}

class Claims {
    public documentId: string;
    public tenantId: string;
}

app.http('customclaimstriggerpoc', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: customclaimstriggerpoc
});
