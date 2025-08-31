import { app, HttpRequest, HttpResponseInit, InvocationContext,input ,output} from "@azure/functions";
const signalR = output.generic({
    type: 'signalR',
    name: 'signalR',
    hubName: 'default',
    connectionStringSetting: 'AzureSignalRConnectionString',
});
export async function sendMessage(request: HttpRequest, context: InvocationContext): Promise<any> {
    const message :any= await request.json();
    message.sender = request.headers && request.headers.get('x-ms-client-principal-name') || '';

    let recipientUserId = '';
    if (message.recipient) {
        recipientUserId = message.recipient;
        message.isPrivate = true;
    }
    const response =  {
        'userId': recipientUserId,
        'target': 'newMessage',
        'arguments': [message]
    }
    context.extraOutputs.set(signalR, response);
        
    return response;
};

app.http('sendMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [signalR],
    handler: sendMessage
});
