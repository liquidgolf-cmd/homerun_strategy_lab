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

CRITICAL - DO NOT REPEAT QUESTIONS FROM PREVIOUS MODULES:

Module 0 (At Bat) already covered:
- What business they're in or thinking of starting
- What they do
- Their main offers or responsibilities
- What's working/not working in their business
- Their constraints and concerns

Module 1 (1st Base) already covered:
- WHO their ideal customer is (who they serve)
- What their ideal customer is trying to achieve (goals)
- What frustrates their ideal customer
- What their ideal customer values
- Best-fit and worst-fit customer patterns

Module 2 (2nd Base) should ONLY focus on WHAT:
- What does your ideal customer WANT? (desired outcomes, transformation they seek)
- What do you actually DELIVER/GIVE them? (your offer, what you provide - focus on outcomes not features)
- What problems does your work SOLVE for them? (what you help them overcome)
- What concrete OUTCOMES does your work create? (specific, measurable results)
- What is your CORE OFFER? (using template: "We help [who] do [what], so they can [outcome], without [fear]")

DO NOT ask:
- "What business are you in?" (Module 0)
- "What do you do?" (Module 0)
- "Who do you serve?" (Module 1)
- "Who is your ideal customer?" (Module 1)
- "What frustrates your customer?" (Module 1 - already covered as part of ICP)

START THE CONVERSATION by asking: "Now that we know who you're really for, let's talk about what they actually want. What does your ideal customer want to achieve? What outcomes are they looking for?"

Focus on moving from features to outcomes, understanding what customers actually WANT (not who they are - that's Module 1), and crafting what you OFFER them.`;

