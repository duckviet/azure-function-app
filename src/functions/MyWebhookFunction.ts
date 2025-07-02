import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function MyWebhookFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

        const githubEvent = request.headers.get('X-GitHub-Event');
        const payload :any = await request.json(); // Lấy body dạng JSON

        if (githubEvent === 'gollum' && payload && payload.pages && payload.pages.length > 0) {
            const page = payload.pages[0]; // Lấy thông tin trang đầu tiên
            return {
                status: 200,
                body: `GitHub Wiki Event: Page is "${page.title}", Action is "${page.action}", Event Type is "${githubEvent}. ${page.html_url}"`
            };
        } else if (request.query.get('name') || (payload && payload.name)) {
            // Giữ lại logic cũ cho việc test đơn giản với '?name='
            const name = request.query.get('name') || payload.name;
            return { body: `Hello, ${name}. This HTTP triggered function executed successfully.` };
        }
        else {
            return {
                status: 400,
                body: "Please pass a name on the query string or in the request body for a personalized response, or provide a valid GitHub Wiki (gollum) webhook payload."
            };
        }
};

app.http('MyWebhookFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: MyWebhookFunction
});


 