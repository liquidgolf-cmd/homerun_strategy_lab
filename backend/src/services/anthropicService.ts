import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COACH_SYSTEM_PROMPT = `You are a business strategy coach with 20 years of homerun methodology and business strategy experience. Your role is to guide the user through strategic thinking exercises, asking thoughtful questions to help them clarify their business strategy. Be conversational, supportive, and insightful. Keep responses concise but meaningful.`;

export async function chatWithCoach(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  moduleContext?: string
): Promise<string> {
  const systemPrompt = moduleContext
    ? `${COACH_SYSTEM_PROMPT}\n\n${moduleContext}`
    : COACH_SYSTEM_PROMPT;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as any,
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response type from Anthropic API');
}

export async function generateAuditReview(
  moduleNumber: number,
  auditPrompt: string,
  collectedData: {
    aiTranscript?: Array<{ role: string; content: string }>;
    formData?: Record<string, any>;
  }
): Promise<string> {
  let dataContext = '';
  
  if (collectedData.aiTranscript) {
    const conversation = collectedData.aiTranscript
      .map(msg => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`)
      .join('\n\n');
    dataContext = `Here is the conversation from the module:\n\n${conversation}`;
  } else if (collectedData.formData) {
    const formContent = Object.entries(collectedData.formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    dataContext = `Here is the form data from the module:\n\n${formContent}`;
  }

  const fullPrompt = `${auditPrompt}\n\n${dataContext}\n\nGenerate a comprehensive audit review document based on this information.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: 'You are an expert business strategist creating a comprehensive audit review document. Be thorough, insightful, and actionable.',
    messages: [
      {
        role: 'user',
        content: fullPrompt,
      },
    ] as any,
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response type from Anthropic API');
}

export async function generateCombinedOverview(
  moduleAudits: Array<{ moduleNumber: number; auditReview: string }>
): Promise<string> {
  const auditsText = moduleAudits
    .map(
      (m) => `Module ${m.moduleNumber} Audit Review:\n${m.auditReview}\n\n---\n\n`
    )
    .join('\n');

  const prompt = `Synthesize the following module audit reviews into one comprehensive overview document. The overview should highlight key insights, patterns, and strategic themes across all modules.\n\n${auditsText}`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3072,
    system: 'You are an expert business strategist creating a comprehensive strategic overview document. Synthesize insights into a cohesive narrative.',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ] as any,
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response type from Anthropic API');
}

export async function generateActionPlan(
  allModuleData: Array<{
    moduleNumber: number;
    auditReview: string;
    responses: any;
  }>
): Promise<string> {
  const dataContext = allModuleData
    .map(
      (m) =>
        `Module ${m.moduleNumber}:\nAudit Review: ${m.auditReview}\n\nResponses: ${JSON.stringify(m.responses, null, 2)}\n\n---\n\n`
    )
    .join('\n');

  const prompt = `Based on all the module data and audit reviews provided, create a detailed 90-day action plan. The plan should be specific, actionable, and organized into clear phases. Include priorities, milestones, and next steps.\n\n${dataContext}`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3072,
    system: 'You are an expert business strategist creating a detailed, actionable 90-day action plan. Be specific, realistic, and organized.',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ] as any,
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response type from Anthropic API');
}

