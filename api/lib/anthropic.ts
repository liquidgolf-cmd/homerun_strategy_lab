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
  moduleContext: string,
  moduleNumber?: number
): Promise<string> {
  // Build system prompt with special handling for Module 2
  let systemPrompt = `You are a business strategy coach with 20 years of experience in homerun methodology and business strategy. Your role is to guide users through a structured interview process to help them clarify their business strategy.

Context for this module: ${moduleContext}

CRITICAL INSTRUCTIONS:
- Follow the module context EXACTLY
- Do NOT ask questions that were already covered in previous modules
- Keep responses concise but insightful (2-4 sentences typically)
- Ask one focused question at a time
- Be conversational and encouraging`;

  // For Module 2, reinforce not repeating previous modules
  if (moduleNumber === 2) {
    systemPrompt += `\n\nSPECIAL INSTRUCTIONS FOR MODULE 2:
- DO NOT ask "What business are you in?" or "What do you do?" - these were covered in Module 0
- DO NOT ask "Who do you serve?" or "Who is your ideal customer?" - this was covered in Module 1
- DO NOT ask "What frustrates your customer?" - this was covered in Module 1 as part of the Ideal Customer Profile
- DO NOT ask "What are you trying to achieve?" about the business owner - this is about the customer
- ONLY ask about WHAT: what the customer wants, what you deliver, what outcomes you create, what your core offer is
- If the user mentions something from a previous module, acknowledge it briefly but redirect to Module 2's focus on WHAT`;
  }

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

// Module Audit Prompts
export const module0AuditPrompt = `You are reviewing the user's "Current Reality" module responses. This module focuses on their business and why they're struggling or wanting to change (NOT about who they serve - that's covered in the next module).

Please:

1. Describe the current business/role and their motivations for change
2. List 3-5 strengths and 3-5 risks you see in their current business situation
3. Pull out 3 key lessons and 3 opportunities they might be missing about their business
4. Based on their description, struggles, and constraints, suggest 5 possible "90-day home run" goals that are ambitious but realistic for their business

Format your response as a clear, well-structured audit review document focused on the business itself, not on their customer base.`;

export const module1AuditPrompt = `You are reviewing the user's "1st Base: Define Who You're Really For" module responses. This module focuses on identifying their ideal customer profile.

Please:

1. Summarize their ideal customer profile based on their responses (who they are, what they want, what frustrates them, what they value)
2. Identify 3-5 key patterns from their best-fit customers that should guide future targeting
3. List 3-5 red flags or "no-go" traits from their worst-fit customers that should be avoided
4. Highlight 3 insights about why certain customers were great fits and others weren't
5. Suggest 3 ways they could better identify and attract their ideal customers

Format your response as a clear, well-structured audit review document focused on customer clarity and targeting strategy.`;

export const module2AuditPrompt = `You are reviewing the user's "2nd Base: Design What They Actually Want" module responses. This module focuses on understanding customer desires and crafting a core offer.

Please:

1. Summarize their customer's key pains, frustrations, and desires
2. List 5-7 concrete outcomes they help create for customers
3. Review and refine their core offer statement (We help [who] do [what], so they can [outcome], without [fear])
4. Identify 3 opportunities where they could better articulate value from outcomes rather than features
5. Suggest 2-3 ways to strengthen their offer statement based on the customer insights they provided

Format your response as a clear, well-structured audit review document focused on offer clarity and value articulation.`;

export const module3AuditPrompt = `You are reviewing the user's "3rd Base: Map How You'll Deliver It" module responses. This module focuses on turning their process into a clear delivery path.

Please:

1. Summarize their delivery process broken down into stages
2. For each stage, highlight what's working well and what could be improved
3. Identify the essential assets they've identified and suggest any additional assets that might be helpful
4. Address the confusion points they mentioned - suggest ways to clarify or streamline these areas
5. Propose 3-5 improvements to help them feel more organized and less rushed
6. Suggest how they could better communicate the delivery path to customers

Format your response as a clear, well-structured audit review document focused on process clarity and operational excellence.`;

export const module4AuditPrompt = `You are reviewing the user's "Home: Build Your 90-Day Game Plan" module responses. This module focuses on creating a concrete 90-day action plan.

Please:

1. Summarize their 90-day North Star outcome and why it matters now
2. Review each strategic project they've outlined - assess if they're realistic and well-defined
3. For each project, suggest any missing steps or considerations
4. Evaluate their weekly review rhythm - is it realistic and sufficient?
5. Identify potential risks they mentioned and suggest mitigation strategies
6. Recommend support or accountability structures that could help them stay on track
7. Prioritize the projects if there are multiple - which should come first and why?

Format your response as a clear, well-structured audit review document that serves as a strategic guide for their 90-day execution plan.`;

// Helper function to get audit prompt by module number
export function getAuditPrompt(moduleNumber: number): string {
  switch (moduleNumber) {
    case 0:
      return module0AuditPrompt;
    case 1:
      return module1AuditPrompt;
    case 2:
      return module2AuditPrompt;
    case 3:
      return module3AuditPrompt;
    case 4:
      return module4AuditPrompt;
    default:
      throw new Error(`Invalid module number: ${moduleNumber}`);
  }
}

