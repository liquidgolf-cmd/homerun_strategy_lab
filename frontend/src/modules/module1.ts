import type { ModuleConfig } from '../types';

export const module1Config: ModuleConfig = {
  number: 1,
  title: '1st Base: Define Who You\'re Really For',
  description:
    "We're going to answer one deceptively simple question: Who are you really for? We'll look at your best-fit and worst-fit customers to identify patterns and create an Ideal Customer Profile.",
  questions: [
    {
      id: 'bestCustomers',
      label: 'List 3-5 of your favorite past customers/clients',
      type: 'textarea',
      required: true,
      placeholder: 'List specific customers who were great to work with...',
    },
    {
      id: 'whyBestCustomers',
      label: 'Why did working with them feel good?',
      type: 'textarea',
      required: true,
      placeholder: 'What made these customers great to work with...',
    },
    {
      id: 'bestCustomerResults',
      label: 'What results did they get?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the outcomes these customers achieved...',
    },
    {
      id: 'worstCustomers',
      label: 'List 2-3 customers you wouldn\'t want to repeat',
      type: 'textarea',
      required: true,
      placeholder: 'List customers who were difficult or draining...',
    },
    {
      id: 'whyWorstCustomers',
      label: 'What made them a bad fit? (behavior, expectations, values, stage, etc.)',
      type: 'textarea',
      required: true,
      placeholder: 'Explain why these customers were a poor fit...',
    },
    {
      id: 'bestFitPatterns',
      label: 'What do your best-fit customers have in common?',
      type: 'textarea',
      required: true,
      placeholder: 'Identify patterns among your best customers...',
    },
    {
      id: 'worstFitPatterns',
      label: 'What do your worst-fit customers have in common?',
      type: 'textarea',
      required: true,
      placeholder: 'Identify patterns among your worst customers...',
    },
    {
      id: 'icpWho',
      label: 'Who they are (role, stage, context)',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your ideal customer\'s role and context...',
    },
    {
      id: 'icpGoals',
      label: 'What they\'re trying to achieve',
      type: 'textarea',
      required: true,
      placeholder: 'What goals does your ideal customer have...',
    },
    {
      id: 'icpFrustrations',
      label: 'What they\'re frustrated by',
      type: 'textarea',
      required: true,
      placeholder: 'What frustrations does your ideal customer face...',
    },
    {
      id: 'icpValues',
      label: 'What they value in a partner/provider',
      type: 'textarea',
      required: true,
      placeholder: 'What does your ideal customer value...',
    },
    {
      id: 'icpWhyChoose',
      label: 'Why they choose you over other options',
      type: 'textarea',
      required: true,
      placeholder: 'What makes you stand out to your ideal customer...',
    },
    {
      id: 'notForUs',
      label: 'List 5 traits or situations that are "no-gos" for you',
      type: 'textarea',
      required: true,
      placeholder: 'What should you avoid in customers...',
    },
  ],
  auditPrompt: '',
};

export const module1Context = `You're helping the user complete Module 1: 1st Base - Define Who You're Really For. This module focuses on identifying their ideal customer profile. Ask questions about:

- Their best-fit customers (who they are, why they're great, what results they got)
- Their worst-fit customers (what made them draining or difficult)
- Patterns among both groups
- Creating an Ideal Customer Profile (who they are, what they want, what frustrates them, what they value)
- Defining who they are NOT for

Be conversational and help them think through their customer experiences to identify clear patterns.`;

