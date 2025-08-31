import { app, HttpRequest, HttpResponseInit, InvocationContext, input } from "@azure/functions";

const inputSignalR = input.generic({
    type:'signalRConnectionInfo',
    name: 'signalRConnectionInfo',
    hubName: 'default',
    connection: 'AzureSignalRConnectionString',
})

export async function negotiate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.post('negotiate', {
    authLevel: 'anonymous',
    handler: negotiate,
    route:'negotiate',
    extraInputs: [inputSignalR],

});
