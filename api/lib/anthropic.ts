/**
 * Anthropic Service for AI Chat and Audit Review Generation
 */

import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY is not set. Set it as an environment variable.');
}

const anthropic = new Anthropic({ apiKey });

/**
 * Chat with AI coach
 */
export async function chatWithCoach(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  moduleContext: string
): Promise<string> {
  const systemPrompt = `You are a business strategy coach with 20 years of experience in homerun methodology and business strategy. Your role is to guide users through a structured interview process to help them clarify their business strategy.

Context for this module: ${moduleContext}

Be conversational, ask thoughtful follow-up questions, and help users think deeply about their business. Keep responses concise but insightful.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages as any,
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error: any) {
    console.error('Anthropic API error:', error);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}

/**
 * Generate audit review for Module 0
 */
export async function generateAuditReview(
  moduleNumber: number,
  auditPrompt: string,
  data: {
    aiTranscript?: Array<{ role: string; content: string }>;
    formData?: Record<string, any>;
  }
): Promise<string> {
  const { aiTranscript, formData } = data;

  let userData = '';
  if (aiTranscript) {
    userData = `AI Chat Transcript:\n${JSON.stringify(aiTranscript, null, 2)}`;
  } else if (formData) {
    userData = `Form Responses:\n${JSON.stringify(formData, null, 2)}`;
  }

  const fullPrompt = `${auditPrompt}\n\n${userData}\n\nPlease generate a comprehensive audit review document based on the above information.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error: any) {
    console.error('Anthropic API error:', error);
    throw new Error(`Failed to generate audit review: ${error.message}`);
  }
}

// Module 0 Audit Prompt
export const module0AuditPrompt = `You are reviewing the user's "Current Reality" module responses. Please:

1. Describe the current business/role
2. List 3-5 strengths and 3-5 risks you see
3. Pull out 3 key lessons and 3 opportunities they might be missing
4. Based on the description and constraints, suggest 5 possible "90-day home run" goals that are ambitious but realistic

Format your response as a clear, well-structured audit review document.`;

