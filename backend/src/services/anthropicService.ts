import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Get API key from environment (works in both local and Firebase Functions)
let apiKey = process.env.ANTHROPIC_API_KEY;

// Try Firebase Functions config if not in env
if (!apiKey) {
  try {
    const functions = require('firebase-functions');
    apiKey = functions.config().anthropic?.api_key;
  } catch (e) {
    // Not in Firebase environment, that's okay
  }
}

if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables or Firebase config');
}

const anthropic = new Anthropic({ apiKey });

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

export async function generateCombinedOverview(moduleAudits: Array<{ moduleNumber: number; auditReview: string }>): Promise<string> {
  const combinedAudits = moduleAudits
    .map((m) => `Module ${m.moduleNumber}:\n${m.auditReview}`)
    .join('\n\n---\n\n');

  const prompt = `You are a business strategy coach. Review the following audit reviews from all 5 modules and create a comprehensive combined overview document that synthesizes the key insights, patterns, and strategic recommendations across all modules.

${combinedAudits}

Please create a well-structured overview document that:
1. Highlights key themes and patterns across all modules
2. Identifies strategic opportunities and challenges
3. Provides integrated recommendations
4. Shows how the modules connect to form a cohesive strategy`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error: any) {
    console.error('Anthropic API error:', error);
    throw new Error(`Failed to generate combined overview: ${error.message}`);
  }
}

export async function generateActionPlan(
  allModuleData: Array<{
    moduleNumber: number;
    auditReview: string;
    responses: {
      inputMethod: string;
      aiTranscript?: Array<{ role: string; content: string }>;
      formData?: Record<string, any>;
    };
  }>
): Promise<string> {
  const moduleSummaries = allModuleData
    .map(
      (m) => `Module ${m.moduleNumber}:\nAudit: ${m.auditReview}\n\nResponses: ${JSON.stringify(m.responses, null, 2)}`
    )
    .join('\n\n---\n\n');

  const prompt = `You are a business strategy coach. Based on the following module audits and user responses, create a detailed 90-day action plan that is specific, actionable, and prioritized.

${moduleSummaries}

Please create a comprehensive 90-day action plan that:
1. Breaks down into 30-day milestones
2. Provides specific, actionable steps
3. Prioritizes based on strategic importance
4. Includes success metrics
5. Addresses key opportunities identified across all modules`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error: any) {
    console.error('Anthropic API error:', error);
    throw new Error(`Failed to generate action plan: ${error.message}`);
  }
}
