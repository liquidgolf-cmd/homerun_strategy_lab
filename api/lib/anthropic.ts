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
- Be conversational and encouraging

STRATEGIC GUIDANCE (ONLY WHEN USER IS STRUGGLING):
Monitor user responses carefully. Only provide strategic scaffolding when you detect the user is struggling or giving superficial answers, such as:
- Vague or generic responses ("maybe success", "I'm not sure", "things are okay")
- Very short responses that lack depth
- "I don't know" or similar expressions of uncertainty
- Repeating the same surface-level information without going deeper
- Expressing confusion or asking for help

When struggling is detected, provide strategic guidance by combining:
1. **Examples/case studies**: Share 1-2 relevant examples from similar businesses or situations to inspire thinking (stay within the module's focus area)
2. **Multiple options**: Offer 2-3 different approaches, ideas, or perspectives they could consider
3. **Guiding questions**: Ask 1-2 deeper questions that help them explore the topic from different angles
4. **Frameworks**: Provide simple structures like "think about X from these perspectives: A, B, C" when helpful

Keep the guidance:
- Strategic and helpful, not prescriptive (help them discover their own answers)
- Conversational and encouraging
- Focused on helping them think more deeply
- Strictly within the module's context boundaries (don't venture into other module topics)

If the user is providing thoughtful, specific answers, continue with normal questioning - do NOT over-guide.

COMPLETION REMINDER:
When you have gathered sufficient information to create a comprehensive audit review (typically after asking 5-10 relevant questions and receiving detailed answers), remind the user: "You've provided great information! When you're ready, click the 'Complete & Review' button below to generate your audit review." Do this once when you feel you have enough information - don't repeat this reminder multiple times. Continue answering any follow-up questions they may have after the reminder.`;

  // For Module 2, reinforce not repeating previous modules and staying focused on WHAT
  if (moduleNumber === 2) {
    systemPrompt += `\n\nSPECIAL INSTRUCTIONS FOR MODULE 2:
- ONLY ask about WHAT: what the customer wants, what you deliver, what outcomes you create, what your core offer is
- DO NOT ask about HOW (delivery method, process) - that's Module 3
- DO NOT ask about WHEN (timeline, implementation schedule) - that's Module 4
- DO NOT ask about WHY (reasons) - already covered in Module 1
- DO NOT repeat questions from Module 0 or Module 1
- Stay strictly focused on WHAT - do not venture into other module topics`;
  }
  
  // For Module 3, reinforce focus on HOW (delivery)
  if (moduleNumber === 3) {
    systemPrompt += `\n\nSPECIAL INSTRUCTIONS FOR MODULE 3:
- ONLY ask about HOW: how you deliver your offer, how customers access it, what the delivery path looks like
- DO NOT ask about WHAT (what you offer) - that's Module 2
- DO NOT ask about WHO (who you serve) - that's Module 1
- DO NOT ask about WHEN (timeline, schedule) - that's Module 4
- Stay strictly focused on HOW delivery works - do not venture into other module topics`;
  }
  
  // For Module 4, reinforce focus on WHEN/PLAN (implementation)
  if (moduleNumber === 4) {
    systemPrompt += `\n\nSPECIAL INSTRUCTIONS FOR MODULE 4:
- ONLY ask about WHEN and PLAN: timeline for implementation, 90-day game plan, action steps, milestones
- DO NOT ask about WHAT (what you offer) - that's Module 2
- DO NOT ask about WHO (who you serve) - that's Module 1
- DO NOT ask about HOW (delivery method) - that's Module 3
- Stay strictly focused on WHEN and implementation planning - do not venture into other module topics`;
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

Format your response as a clear, well-structured audit review document focused on the business itself, not on their customer base.

IMPORTANT: At the very end of your audit review document, add a brief reminder section that says: "Remember to click the 'Next Module' button below to submit your review and continue to the next module."`;

export const module1AuditPrompt = `You are reviewing the user's "1st Base: Define Who You're Really For" module responses. This module focuses on identifying their ideal customer profile.

Please:

1. Summarize their ideal customer profile based on their responses (who they are, what they want, what frustrates them, what they value)
2. Identify 3-5 key patterns from their best-fit customers that should guide future targeting
3. List 3-5 red flags or "no-go" traits from their worst-fit customers that should be avoided
4. Highlight 3 insights about why certain customers were great fits and others weren't
5. Suggest 3 ways they could better identify and attract their ideal customers

Format your response as a clear, well-structured audit review document focused on customer clarity and targeting strategy.

IMPORTANT: At the very end of your audit review document, add a brief reminder section that says: "Remember to click the 'Next Module' button below to submit your review and continue to the next module."`;

export const module2AuditPrompt = `You are reviewing the user's "2nd Base: Design What They Actually Want" module responses. This module focuses on understanding customer desires and crafting a core offer.

Please:

1. Summarize their customer's key pains, frustrations, and desires
2. List 5-7 concrete outcomes they help create for customers
3. Review and refine their core offer statement (We help [who] do [what], so they can [outcome], without [fear])
4. Identify 3 opportunities where they could better articulate value from outcomes rather than features
5. Suggest 2-3 ways to strengthen their offer statement based on the customer insights they provided

Format your response as a clear, well-structured audit review document focused on offer clarity and value articulation.

IMPORTANT: At the very end of your audit review document, add a brief reminder section that says: "Remember to click the 'Next Module' button below to submit your review and continue to the next module."`;

export const module3AuditPrompt = `You are reviewing the user's "3rd Base: Map How You'll Deliver It" module responses. This module focuses on turning their process into a clear delivery path.

Please:

1. Summarize their delivery process broken down into stages
2. For each stage, highlight what's working well and what could be improved
3. Identify the essential assets they've identified and suggest any additional assets that might be helpful
4. Address the confusion points they mentioned - suggest ways to clarify or streamline these areas
5. Propose 3-5 improvements to help them feel more organized and less rushed
6. Suggest how they could better communicate the delivery path to customers

Format your response as a clear, well-structured audit review document focused on process clarity and operational excellence.

IMPORTANT: At the very end of your audit review document, add a brief reminder section that says: "Remember to click the 'Next Module' button below to submit your review and continue to the next module."`;

export const module4AuditPrompt = `You are reviewing the user's "The Homerun: Build Your 90-Day Game Plan" module responses. This module focuses on creating a concrete 90-day action plan.

Please:

1. Summarize their 90-day North Star outcome and why it matters now
2. Review each strategic project they've outlined - assess if they're realistic and well-defined
3. For each project, suggest any missing steps or considerations
4. Evaluate their weekly review rhythm - is it realistic and sufficient?
5. Identify potential risks they mentioned and suggest mitigation strategies
6. Recommend support or accountability structures that could help them stay on track
7. Prioritize the projects if there are multiple - which should come first and why?

Format your response as a clear, well-structured audit review document that serves as a strategic guide for their 90-day execution plan.

IMPORTANT: At the very end of your audit review document, add a brief reminder section that says: "Remember to click the 'View Final Summary' button below to submit your review and view your complete strategy summary."`;

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

/**
 * Generate final combined overview document
 */
export async function generateCombinedOverview(allModuleResponses: Array<{
  moduleNumber: number;
  auditReviewDocument?: string;
  aiTranscript?: Array<{ role: string; content: string }>;
  formData?: Record<string, any>;
}>): Promise<string> {
  const moduleTitles = [
    'Current Reality (At Bat)',
    '1st Base: Define Who You\'re Really For',
    '2nd Base: Design What They Actually Want',
    '3rd Base: Map How You\'ll Deliver It',
    'The Homerun: Build Your 90-Day Game Plan'
  ];

  // Build comprehensive data from all modules
  let allData = '';
  for (let i = 0; i < allModuleResponses.length; i++) {
    const response = allModuleResponses[i];
    allData += `\n\n=== MODULE ${response.moduleNumber}: ${moduleTitles[response.moduleNumber]} ===\n`;
    
    if (response.auditReviewDocument) {
      allData += `Audit Review:\n${response.auditReviewDocument}\n`;
    }
    
    if (response.aiTranscript && response.aiTranscript.length > 0) {
      allData += `\nAI Chat Transcript:\n${JSON.stringify(response.aiTranscript, null, 2)}\n`;
    }
    
    if (response.formData) {
      allData += `\nForm Data:\n${JSON.stringify(response.formData, null, 2)}\n`;
    }
  }

  const prompt = `You are creating a comprehensive combined overview document for a business strategy client who has completed all 5 modules of the Homerun Strategy Lab.

This document should synthesize insights from all modules and provide a cohesive view of their business strategy.

Based on the following data from all 5 modules, create a comprehensive overview document that includes:

1. **Executive Summary**: A high-level overview of their business, ideal customer, core offer, delivery method, and 90-day plan

2. **Current Reality**: Key insights about where they are now (from Module 0)

3. **Ideal Customer Profile**: Who they're really for, based on their best-fit customer patterns (from Module 1)

4. **Core Offer & Value Proposition**: What they deliver and the outcomes they create (from Module 2)

5. **Delivery Path**: How they deliver value to customers (from Module 3)

6. **90-Day Game Plan**: Their strategic projects and implementation plan (from Module 4)

7. **Strategic Insights**: Cross-module insights, connections, and recommendations

8. **Key Opportunities**: The most important opportunities they should focus on

Format this as a clear, well-structured document that someone could use as their strategic playbook. Make it actionable and inspiring.

${allData}

Please generate a comprehensive combined overview document that synthesizes all of this information into a cohesive strategic document.`;

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: AUDIT_MODEL,
      max_tokens: 8192,
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
    throw new Error(`Failed to generate combined overview: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate final 90-day action plan document
 */
export async function generateActionPlan(allModuleResponses: Array<{
  moduleNumber: number;
  auditReviewDocument?: string;
  aiTranscript?: Array<{ role: string; content: string }>;
  formData?: Record<string, any>;
}>): Promise<string> {
  // Focus on Module 4 data but also reference other modules for context
  const module4Data = allModuleResponses.find(r => r.moduleNumber === 4);
  
  let module4Content = '';
  if (module4Data) {
    if (module4Data.auditReviewDocument) {
      module4Content += `Module 4 Audit Review:\n${module4Data.auditReviewDocument}\n\n`;
    }
    if (module4Data.aiTranscript) {
      module4Content += `Module 4 AI Chat:\n${JSON.stringify(module4Data.aiTranscript, null, 2)}\n\n`;
    }
    if (module4Data.formData) {
      module4Content += `Module 4 Form Data:\n${JSON.stringify(module4Data.formData, null, 2)}\n\n`;
    }
  }

  // Include key context from other modules
  const module0Data = allModuleResponses.find(r => r.moduleNumber === 0);
  const module2Data = allModuleResponses.find(r => r.moduleNumber === 2);
  
  let contextData = '';
  if (module0Data?.auditReviewDocument) {
    contextData += `Current Reality Context:\n${module0Data.auditReviewDocument}\n\n`;
  }
  if (module2Data?.auditReviewDocument) {
    contextData += `Core Offer Context:\n${module2Data.auditReviewDocument}\n\n`;
  }

  const prompt = `You are creating a detailed 90-day action plan document for a business strategy client.

This document should take their 90-day game plan and expand it into a detailed, week-by-week action plan that they can actually execute.

Based on the following data, create a comprehensive 90-day action plan that includes:

1. **90-Day North Star Outcome**: Restate their primary goal clearly

2. **Strategic Projects Breakdown**: For each project from their plan:
   - Clear project description and objectives
   - Detailed action steps broken down by week
   - Dependencies and sequencing
   - Success metrics
   - Resource needs

3. **Week-by-Week Timeline**: A week-by-week breakdown showing:
   - What needs to happen each week
   - Key milestones
   - Deliverables
   - Review points

4. **Risk Mitigation**: Based on the risks they identified, provide specific mitigation strategies

5. **Accountability & Support**: Concrete recommendations for how they'll stay on track

6. **Weekly Review Scorecard**: Include a clean, simple weekly scorecard template. Format it as a clear markdown table with these columns:
   - **Project/Area**: The name of each strategic project
   - **This Week's Goal**: What they planned to accomplish this week
   - **Actual Result**: What actually happened
   - **Status**: Use 🟢 🟡 or 🔴
   - **Next Week Focus**: What to prioritize next week
   
   Example format:
   | Project/Area | This Week's Goal | Actual Result | Status | Next Week Focus |
   |--------------|------------------|---------------|--------|-----------------|
   | [Project 1]  | [Specific goal]  | [What happened] | 🟢   | [Next priority] |
   | [Project 2]  | [Specific goal]  | [What happened] | 🟡   | [Next priority] |
   
   Include a status legend:
   - 🟢 Green: On track or ahead of schedule
   - 🟡 Yellow: Minor delays but recoverable
   - 🔴 Red: Significant delays requiring intervention
   
   Use their actual project names from their 90-day plan. Keep it simple and easy to use each week.

Make this actionable and specific - they should be able to open this document and know exactly what to do each week. The weekly scorecard should be practical and easy to use.

${contextData}

${module4Content}

Please generate a comprehensive 90-day action plan document that turns their game plan into a detailed execution guide.`;

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: AUDIT_MODEL,
      max_tokens: 8192,
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
    throw new Error(`Failed to generate action plan: ${error.message || 'Unknown error'}`);
  }
}

