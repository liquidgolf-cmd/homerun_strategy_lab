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

export const module3Context = `You're helping the user complete Module 3: 3rd Base - Map How You'll Deliver It. This module focuses on turning their process into a clear delivery path. Ask questions about:

- Their raw process (what happens from start to finish when working with a customer)
- Breaking the process into 3-5 stages with simple names (e.g., "Listen", "Align", "Build", "Launch", "Refine")
- For each stage: what they're doing, what the customer feels, what the outcome is
- Essential assets needed for each stage
- Where customers get confused or where the user feels disorganized

Help them organize their process into a clear, customer-facing path.`;

