import { openai } from '@ai-sdk/openai';
import {
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    generateObject,
    streamText,
    tool,
} from 'ai';
import { z } from 'zod';

function sanitizedMessage(messages: any[]) {
    return messages.map(message => {
        if (message.role === 'assistant' && message.parts) {
            const validParts = message.parts.filter(part => {
                // Filter out tool call parts that don't have proper structure
                if ((part.type?.startsWith('tool-') && part.type !== 'tool-result') || part.type.startsWith("step-")) {
                    return false;
                }
                return true;
            });
            return { ...message, parts: validParts };
        }
        return message;
    }).filter(message => {
        // Keep user messages and assistant messages with valid parts
        if (message.role === 'user') return true;
        if (message.role === 'assistant' && message.parts && message.parts.length > 0) return true;
        return false;
    });
}

export async function POST(req: Request) {
    const { messages, context, content } = await req.json();

    const stream = createUIMessageStream({
        execute: async ({ writer }) => {
            // Step 1: Request type identification and acknowledgment
            const hasContext = context && context.trim().length > 0;
            const hasContent = content && content.trim().length > 0;

            let requestType = "NEW_GENERATION";
            if (hasContext && hasContent) {
                requestType = "TARGETED_EDIT";
            } else if (hasContent) {
                requestType = "FULL_ENHANCEMENT";
            }
            const readmeSchema = z.object({
                readme: z.string().describe("Complete README.md file content with the requested changes applied"),
            });

            // Step 2: Context-aware README processing
            const result2 = streamText({
                model: openai('gpt-4o-mini'),
                system: `You are a precision README editor. Your task is to analyze the editing scenario and execute the appropriate action.

EDITING SCENARIOS:
1. **TARGETED EDIT**: User selected specific text (context) within their full README (content) for modification
2. **FULL ENHANCEMENT**: User provided complete README (content) for overall improvement
3. **NEW GENERATION**: User wants a new README created from scratch

Always call the processReadme tool with accurate scenario identification and specific editing instructions.

       ${hasContext &&
                    `======== CONTEXT =========
                ${context}
            `}

            ${hasContent &&
                    `======== CONTENT =========
                ${content}`}
`,
                tools: {
                    processReadme: tool({
                        inputSchema: z.object({
                            editingScenario: z.enum(["targeted_edit", "full_enhancement", "new_generation"]).describe("Type of README processing needed"),
                            selectedTextAnalysis: z.string().describe("Analysis of the selected text that needs to be changed (if applicable)").optional(),
                            editingInstructions: z.array(z.string()).max(4).describe("Specific instructions for what changes to make"),
                            preservationNotes: z.string().describe("What should be kept unchanged (if editing existing content)").optional()
                        }),
                        execute: async ({ editingScenario, selectedTextAnalysis, editingInstructions, preservationNotes }) => {
                            let systemPrompt = "";
                            let userPrompt = "";

                            if (editingScenario === "targeted_edit") {
                                systemPrompt = `You are a precision text editor specializing in README modifications. 

TASK: Replace the selected text portion with improved content while preserving everything else exactly as is.

REQUIREMENTS:
- If the code is in html, it should remain in html. Don't convert it to .
- Maintain the exact structure and formatting of the unselected portions
- Only modify the selected text section
- Ensure seamless integration with surrounding content
- Preserve all  syntax and formatting consistency
- Keep the same tone and style as the rest of the document`;

                                userPrompt = `
# TARGETED README EDIT

## Full README Content:
\`\`\`
${content}
\`\`\`

## Selected Text to Replace:
\`\`\`
${context}
\`\`\`

## User's Change Request:
${messages[messages.length - 1]?.content || "Improve the selected section"}

## Selected Text Analysis:
${selectedTextAnalysis}

## Editing Instructions:
${editingInstructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

## Preservation Requirements:
${preservationNotes}

## TASK:
Replace ONLY the selected text portion with improved content that:
- Addresses the user's specific change request
- Integrates seamlessly with surrounding content
- Maintains consistent formatting and tone
- Preserves all other content exactly as provided

Return the COMPLETE README with only the selected portion modified.`;

                            } else if (editingScenario === "full_enhancement") {
                                systemPrompt = `You are a comprehensive README enhancement specialist.

TASK: Improve the entire README while maintaining the user's core content and structure.

REQUIREMENTS:
- Enhance existing sections for better clarity and impact
- Improve formatting and visual presentation
- Add missing standard sections if beneficial
- Maintain the user's personal voice and key information
- Apply modern GitHub README best practices`;

                                userPrompt = `
# FULL README ENHANCEMENT

## Current README Content:
\`\`\`
${content}
\`\`\`

## User's Enhancement Request:
${messages[messages.length - 1]?.content || "Improve and enhance the README"}

## Enhancement Instructions:
${editingInstructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

## TASK:
Enhance the entire README by:
- Improving existing content clarity and impact
- Applying better  formatting and structure
- Adding relevant sections that are missing
- Ensuring professional presentation
- Maintaining the user's core information and personality

Return a polished, comprehensive README that builds upon the existing content.`;

                            } else {
                                systemPrompt = `You are a professional GitHub profile README creator.

TASK: Generate a complete, professional GitHub profile README from scratch.

REQUIREMENTS:
- Create comprehensive profile showcasing technical skills
- Use modern  formatting and best practices
- Include essential sections: intro, skills, projects, contact
- Balance professionalism with personality
- Optimize for GitHub's rendering and user engagement`;

                                userPrompt = `
# NEW README GENERATION

## User's Requirements:
${messages[messages.length - 1]?.content || "Create a professional GitHub profile README"}

## Generation Instructions:
${editingInstructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

## TASK:
Create a complete GitHub profile README that includes:
- Compelling header and introduction (use HTML for centering/styling if needed)
- Technical skills and tools (consider HTML tables or custom layouts)
- Project highlights and experience
- Contact information and social links
- GitHub stats and badges integration
- Professional yet engaging tone
- Modern formatting with strategic HTML usage for visual impact

Generate a README that makes a strong first impression and effectively showcases technical expertise.`;
                            }

                            const resultObject = await generateObject({
                                model: openai("gpt-4o"),
                                schema: readmeSchema,
                                system: systemPrompt,
                                prompt: userPrompt,
                            });

                            return resultObject.object;
                        },
                    }),
                },
                toolChoice: "required",
                messages: [
                    ...convertToModelMessages(sanitizedMessage([messages[messages.length - 1]])),
                ],
            });

            writer.merge(result2.toUIMessageStream({ sendStart: false }));
        },
    });

    return createUIMessageStreamResponse({ stream });
}