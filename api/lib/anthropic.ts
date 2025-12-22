/**
 * Anthropic Service for AI Chat and Audit Review Generation
 */

import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | undefined;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set. Please set it in Vercel environment variables.');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// Model configuration - can be overridden via environment variable
// Anthropic recommendations:
// - claude-sonnet-4-20250514 (best balance of intelligence and speed) - DEFAULT
// - claude-haiku-4-5-20251001 (faster/cheaper responses)
const CHAT_MODEL = process.env.ANTHROPIC_CHAT_MODEL || 'claude-sonnet-4-20250514';
const AUDIT_MODEL = process.env.ANTHROPIC_AUDIT_MODEL || 'claude-sonnet-4-20250514';

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
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error: any) {
    console.error('Anthropic API error:', error);
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error,
      model: CHAT_MODEL,
    });
    
    // Provide more helpful error messages
    if (error.status === 401 || error.status === 403) {
      throw new Error('Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY environment variable.');
    }
    if (error.status === 404) {
      throw new Error(`Model "${CHAT_MODEL}" not found. Try setting ANTHROPIC_CHAT_MODEL to 'claude-3-5-sonnet-20241022' or another valid model name.`);
    }
    
    throw new Error(`Failed to generate chat response: ${error.message || error.status || 'Unknown error'}`);
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
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: AUDIT_MODEL,
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
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error,
      model: AUDIT_MODEL,
    });
    
    // Provide more helpful error messages
    if (error.status === 401 || error.status === 403) {
      throw new Error('Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY environment variable.');
    }
    if (error.status === 404) {
      throw new Error(`Model "${AUDIT_MODEL}" not found. Try setting ANTHROPIC_AUDIT_MODEL to 'claude-3-5-sonnet-20241022' or another valid model name.`);
    }
    
    throw new Error(`Failed to generate audit review: ${error.message || error.status || 'Unknown error'}`);
  }
}

// Module 0 Audit Prompt
export const module0AuditPrompt = `You are reviewing the user's "Current Reality" module responses. Please:

1. Describe the current business/role
2. List 3-5 strengths and 3-5 risks you see
3. Pull out 3 key lessons and 3 opportunities they might be missing
4. Based on the description and constraints, suggest 5 possible "90-day home run" goals that are ambitious but realistic

Format your response as a clear, well-structured audit review document.`;

