import type { ModuleConfig } from '../types';

export const module2Config: ModuleConfig = {
  number: 2,
  title: '2nd Base: Design What They Actually Want',
  description:
    "Now that we know who you're really for, it's time to talk about what they actually want. We'll move from features to outcomes, mapping pains, desires, and creating your core offer statement.",
  videoUrl: '', // Add Module 2 video URL here
  questions: [
    {
      id: 'whatTheyWant',
      label: 'What does your ideal customer want? What outcomes are they looking for?',
      type: 'textarea',
      required: true,
      placeholder: 'What do they want to achieve or accomplish...',
    },
    {
      id: 'desiredTransformation',
      label: 'If things went really well for them in the next 6-12 months, what would be different? What transformation are they seeking?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe their desired transformation...',
    },
    {
      id: 'whatYouDeliver',
      label: 'What do you actually deliver to them? (Focus on outcomes, not features)',
      type: 'textarea',
      required: true,
      placeholder: 'What outcomes or results do you help them achieve...',
    },
    {
      id: 'problemsSolved',
      label: 'What problems does your work solve for them?',
      type: 'textarea',
      required: true,
      placeholder: 'What problems or challenges do you help them overcome...',
    },
    {
      id: 'whatMakesDifferent',
      label: 'What makes what you offer different? What can you give them that they can\'t get elsewhere?',
      type: 'textarea',
      required: true,
      placeholder: 'What makes your offer unique or valuable...',
    },
    {
      id: 'concreteOutcomes',
      label: 'List 5-10 concrete outcomes your work helps create (e.g. "consistent leads," "aligned messaging," "fewer fire drills")',
      type: 'textarea',
      required: true,
      placeholder: 'List specific, measurable outcomes you deliver...',
    },
    {
      id: 'coreOfferWho',
      label: 'Core Offer: We help [who]',
      type: 'text',
      required: true,
      placeholder: 'Your ideal customer (from Module 1)',
    },
    {
      id: 'coreOfferWhat',
      label: 'Do/achieve [what]',
      type: 'text',
      required: true,
      placeholder: 'What you help them do or achieve',
    },
    {
      id: 'coreOfferOutcome',
      label: 'So they can [outcome]',
      type: 'text',
      required: true,
      placeholder: 'The specific outcome they achieve',
    },
    {
      id: 'coreOfferWithout',
      label: 'Without [fear/obstacle they want to avoid]',
      type: 'text',
      required: true,
      placeholder: 'What they avoid, fear, or don\'t want',
    },
    {
      id: 'offerVariations',
      label: 'Write 3 variations of your core offer statement: "We help [who] do [what], so they can [outcome], without [fear]"',
      type: 'textarea',
      required: true,
      placeholder: 'Variation 1: We help...\nVariation 2: We help...\nVariation 3: We help...',
    },
  ],
  auditPrompt: '',
};

export const module2Context = `You're helping the user complete Module 2: 2nd Base - Design What They Actually Want. This module focuses on WHAT the customer wants and WHAT you can offer them.

IMPORTANT: Do NOT repeat questions from previous modules:
- Module 0 covered: their business reality, what's working/not working for them
- Module 1 covered: WHO their ideal customer is, what frustrates them (as part of ICP), what they're trying to achieve (as part of ICP)

Module 2 should focus on WHAT:
- What does the customer actually want? (desires, desired outcomes, transformation)
- What can you give them? (your offer, what you deliver)
- What problems are you solving for them? (what you help them overcome)
- What outcomes does your work create? (concrete results, not features)
- What is your core offer? (using template: "We help [who] do [what], so they can [outcome], without [fear]")

START THE CONVERSATION by asking: "Now that we know who you're really for, let's talk about what they actually want. What does your ideal customer want to achieve? What outcomes are they looking for?"

Focus on moving from features to outcomes, understanding what customers actually want (not who they are - that's Module 1), and crafting what you offer them.`;

