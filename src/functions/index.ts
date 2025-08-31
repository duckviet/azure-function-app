import { app } from "@azure/functions";
import { readFile } from 'fs/promises';

app.http('index', { 
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async () => {
        const content = await readFile('index.html', 'utf8');

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: content,
        };
    }
});