import { openai } from '@ai-sdk/openai';
import {
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    streamObject,
    streamText,
    tool,
} from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    const { messages } = await req.json();

    const stream = createUIMessageStream({
        execute: async ({ writer }) => {
            // step 1 example: forced tool call
            const result1 = streamText({
                model: openai('gpt-4o-mini'),
                system: 'Create a 5. step plan to create the project.',
                messages: convertToModelMessages(messages),
                toolChoice: 'required', // force the model to call a tool
                tools: {
                    extractGoal: tool({
                        inputSchema: z.object({ goal: z.string() }),
                        execute: async ({ goal }) => goal, // no-op extract tool
                    }),
                },
            });

            // forward the initial result to the client without the finish event:
            writer.merge(result1.toUIMessageStream({ sendFinish: false }));

            // note: you can use any programming construct here, e.g. if-else, loops, etc.
            // workflow programming is normal programming with this approach.

            // example: continue stream with forced tool call from previous step
            const result2 = streamText({
                // different system prompt, different model, no tools:
                model: openai('gpt-4o'),
                system:
                    'You are a helpful assistant with a different system prompt. You create a 10 word description for every project step.',
                // continue the workflow stream with the messages from the previous step:
                messages: [
                    ...convertToModelMessages(messages),
                    ...(await result1.response).messages,
                ],
            });

            // forward the 2nd result to the client (incl. the finish event):
            writer.merge(result2.toUIMessageStream({ sendStart: false }));


            const result3 = streamObject({
                system: "",
                model: openai("gpt-4o-mini"),
                messages: [
                    ...convertToModelMessages(messages),
                    ...(await result1.response).messages,
                    ...(await result2.response).messages,
                ],
                schema: z.object({
                    definition: z.string().describe("A description describing the goals."),
                    markdown: z.string().describe("A markdown of the goals")
                })
            })


        },
    });

    return createUIMessageStreamResponse({ stream });
}