import type { ModuleConfig } from '../types';

export const module0Config: ModuleConfig = {
  number: 0,
  title: 'Current Reality (At Bat)',
  description:
    "Let's start by getting honest about where you are and why this matters now. We'll explore what's working, what's not, and what a 'home run' would look like over the next 90 days.",
  videoUrl: '', // Add Module 0 video URL here
  questions: [
    {
      id: 'businessDescription',
      label: 'Describe your business or role in 2-3 sentences',
      type: 'textarea',
      required: true,
      placeholder: 'Tell us about your business or role...',
    },
    {
      id: 'whyNow',
      label: 'Why are you doing this lab now? What\'s driving you to work on your strategy at this moment?',
      type: 'textarea',
      required: true,
      placeholder: 'What\'s motivating you to focus on strategy right now...',
    },
    {
      id: 'mainOffers',
      label: 'What are your main offers or responsibilities right now?',
      type: 'textarea',
      required: true,
      placeholder: 'List your main offers or responsibilities...',
    },
    {
      id: 'timeAllocation',
      label: 'Where does most of your time actually go in a typical week?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe how you typically spend your time...',
    },
    {
      id: 'whatsWorking',
      label: "List 3 things that are working better than they used to. Why are they working?",
      type: 'textarea',
      required: true,
      placeholder: 'What\'s working well and why...',
    },
    {
      id: 'proudOf',
      label: 'What are you most proud of in the last 6-12 months?',
      type: 'textarea',
      required: true,
      placeholder: 'Share your recent achievements...',
    },
    {
      id: 'whatsNotWorking',
      label: 'Where do you feel stuck, confused, or scattered?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe areas where you\'re struggling...',
    },
    {
      id: 'drainingEnergy',
      label: "What's draining your energy or budget that used to feel exciting?",
      type: 'textarea',
      required: true,
      placeholder: 'What used to be exciting but now drains you...',
    },
    {
      id: 'worries',
      label: 'If nothing changes in the next 12 months, what worries you most?',
      type: 'textarea',
      required: true,
      placeholder: 'Share your concerns...',
    },
    {
      id: 'constraints',
      label: 'What constraints are real for you right now? (Time, money, family, health, team, etc.)',
      type: 'textarea',
      required: true,
      placeholder: 'List your current constraints...',
    },
    {
      id: 'homeRun',
      label: 'In one sentence: "If, 90 days from now, ____ had happened, this would feel like a home run."',
      type: 'textarea',
      required: true,
      placeholder: 'Complete the sentence...',
    },
  ],
  auditPrompt: '',
};

export const module0Context = `You're helping the user complete Module 0: Current Reality (At Bat). This module focuses on getting an honest assessment of their business and why they're struggling or wanting to change.

IMPORTANT: Do NOT ask about who they serve (customers, clients, target audience). That will be covered in the next module. Focus ONLY on:

- Their business/role description (what they do, what their business is)
- Why now? Why are they doing this lab now? What's driving them to work on their strategy at this moment? (This is a key focus area)
- Why they're struggling or what's not working
- Why they want to change something about their business
- What's working and why it's working
- What's draining their energy or budget
- Their constraints (time, money, resources, etc.)
- What a 90-day "home run" would look like for their business

Be supportive and help them think through each area. Keep the conversation focused on understanding their current business reality and motivations for change.`;

