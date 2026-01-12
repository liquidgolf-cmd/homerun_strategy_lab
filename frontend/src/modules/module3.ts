import type { ModuleConfig } from '../types';

export const module3Config: ModuleConfig = {
  number: 3,
  title: '3rd Base: Map How You\'ll Deliver It',
  description:
    "You know who you're for and what they want. Now we'll answer: How is this going to work? We'll turn your delivery process into a clear path with stages and identify essential assets.",
  videoUrl: '', // Add Module 3 video URL here
  questions: [
    {
      id: 'rawProcess',
      label: 'Write out, in messy form, what typically happens when you work with a customer from start to finish',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your process step by step...',
    },
    {
      id: 'stage1',
      label: 'Stage 1: Name and description',
      type: 'text',
      required: true,
      placeholder: 'e.g., "Listen"',
    },
    {
      id: 'stage1Description',
      label: 'Stage 1: What are we doing? What is the customer feeling? What is the outcome?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe this stage...',
    },
    {
      id: 'stage2',
      label: 'Stage 2: Name and description',
      type: 'text',
      required: true,
      placeholder: 'e.g., "Align"',
    },
    {
      id: 'stage2Description',
      label: 'Stage 2: What are we doing? What is the customer feeling? What is the outcome?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe this stage...',
    },
    {
      id: 'stage3',
      label: 'Stage 3: Name and description',
      type: 'text',
      required: true,
      placeholder: 'e.g., "Build"',
    },
    {
      id: 'stage3Description',
      label: 'Stage 3: What are we doing? What is the customer feeling? What is the outcome?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe this stage...',
    },
    {
      id: 'stage4',
      label: 'Stage 4: Name and description (optional)',
      type: 'text',
      required: false,
      placeholder: 'e.g., "Launch"',
    },
    {
      id: 'stage4Description',
      label: 'Stage 4: What are we doing? What is the customer feeling? What is the outcome?',
      type: 'textarea',
      required: false,
      placeholder: 'Describe this stage...',
    },
    {
      id: 'stage5',
      label: 'Stage 5: Name and description (optional)',
      type: 'text',
      required: false,
      placeholder: 'e.g., "Refine"',
    },
    {
      id: 'stage5Description',
      label: 'Stage 5: What are we doing? What is the customer feeling? What is the outcome?',
      type: 'textarea',
      required: false,
      placeholder: 'Describe this stage...',
    },
    {
      id: 'essentialAssets',
      label: 'For each stage, list which assets would make it smoother (e.g. onboarding doc, roadmap deck, recap email template)',
      type: 'textarea',
      required: true,
      placeholder: 'List assets needed for each stage...',
    },
    {
      id: 'confusionPoints',
      label: 'Where do customers currently get confused or stuck?',
      type: 'textarea',
      required: true,
      placeholder: 'Identify confusion points...',
    },
    {
      id: 'disorganizedAreas',
      label: 'Where do you feel disorganized or rushed?',
      type: 'textarea',
      required: true,
      placeholder: 'Identify areas where you feel disorganized...',
    },
  ],
  auditPrompt: '',
};

export const module3Context = `You're helping the user complete Module 3: 3rd Base - Map How You'll Deliver It. This module focuses STRICTLY on HOW you deliver your offer to customers.

CRITICAL - STAY FOCUSED ON "HOW" ONLY:

Module 3 (3rd Base) should ONLY ask about HOW:
- How do customers access your offer? (delivery method, channel, format)
- What does the delivery path look like? (customer journey, steps, process)
- How do you deliver value? (mechanism, system, approach)
- What's the customer journey from discovery to delivery? (path, flow, experience)
- How does the customer experience your offer? (delivery experience, interaction points)
- What stages does the delivery process have? (break into 3-5 stages with names)
- For each stage: what you're doing, what the customer feels, what the outcome is
- Essential assets needed for each stage - prioritize which assets move the needle first (focus on what's most important, not everything - help them identify essential vs "nice to have")
- Where customers get confused or stuck in the delivery process
- Where you feel disorganized or rushed in delivery

DO NOT ask about (these are for other modules):
- "WHAT do you offer?" or "What is your core offer?" → Module 2
- "WHO do you serve?" or "Who is your ideal customer?" → Module 1
- "WHEN will you implement this?" or "What's your timeline?" → Module 4
- "WHY do they need this?" → Already covered in Module 1
- "What business are you in?" → Module 0

Help them prioritize assets - which assets move the needle first? Focus on what's essential, not everything. Help them identify which assets are essential vs "nice to have".

Focus STRICTLY on HOW delivery works - the mechanism, path, journey, and process. Do not venture into WHAT (offer details), WHO (customer details), WHEN (timeline), or WHY (reasons).`;

