import type { ModuleConfig, Question } from '../types';

export const module2Config: ModuleConfig = {
  number: 2,
  title: '2nd Base: Design What They Actually Want',
  description:
    "Now that we know who you're really for, it's time to talk about what they actually want. We'll move from features to outcomes, mapping pains, desires, and creating your core offer statement.",
  questions: [
    {
      id: 'pains',
      label: 'What keeps your ideal customer up at night?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe their biggest concerns...',
    },
    {
      id: 'complaints',
      label: 'What do they complain about to their peers?',
      type: 'textarea',
      required: true,
      placeholder: 'What do they frequently complain about...',
    },
    {
      id: 'triedBefore',
      label: 'What have they already tried that didn\'t work?',
      type: 'textarea',
      required: true,
      placeholder: 'What solutions have they tried...',
    },
    {
      id: 'desires',
      label: 'If things went really well in the next 6-12 months, what would be different for them?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe their desired future state...',
    },
    {
      id: 'feelDifferent',
      label: 'How would their life or work feel different?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the emotional change...',
    },
    {
      id: 'outcomes',
      label: 'List 5-10 concrete outcomes your work helps create (e.g. "consistent leads," "aligned messaging," "fewer fire drills")',
      type: 'textarea',
      required: true,
      placeholder: 'List specific outcomes you deliver...',
    },
    {
      id: 'coreOfferWho',
      label: 'We help [who]',
      type: 'text',
      required: true,
      placeholder: 'Your ideal customer',
    },
    {
      id: 'coreOfferWhat',
      label: 'Do/achieve [what]',
      type: 'text',
      required: true,
      placeholder: 'What you help them do',
    },
    {
      id: 'coreOfferOutcome',
      label: 'So they can [outcome]',
      type: 'text',
      required: true,
      placeholder: 'The outcome they achieve',
    },
    {
      id: 'coreOfferWithout',
      label: 'Without [fear/obstacle they want to avoid]',
      type: 'text',
      required: true,
      placeholder: 'What they avoid or fear',
    },
    {
      id: 'offerVariations',
      label: 'Write 3 variations of your core offer statement using the template above',
      type: 'textarea',
      required: true,
      placeholder: 'We help [who] do [what], so they can [outcome], without [fear]...',
    },
  ],
  auditPrompt: '',
};

export const module2Context = `You're helping the user complete Module 2: 2nd Base - Design What They Actually Want. This module focuses on understanding customer desires and crafting a core offer. Ask questions about:

- Their customer's pains and frustrations (what keeps them up at night, what they complain about)
- Their customer's desires and hopes (what they want to achieve, how things would feel different)
- Concrete outcomes the user helps create
- Building a core offer statement using the template: "We help [who] do [what], so they can [outcome], without [fear]"

Help them move from features to outcomes, focusing on what customers actually want to achieve.`;

