import type { ModuleConfig } from '../types';

export const module4Config: ModuleConfig = {
  number: 4,
  title: 'Home: Build Your 90-Day Game Plan',
  description:
    "We're at Home. This is where we turn all the clarity you've created into a concrete 90-day plan. We'll choose one primary outcome, translate it into strategic projects, and design a weekly rhythm.",
  videoUrl: '', // Add Module 4 video URL here
  questions: [
    {
      id: 'northStar',
      label: 'In one sentence: "In 90 days, it will be a win if ______."',
      type: 'textarea',
      required: true,
      placeholder: 'Complete the sentence...',
    },
    {
      id: 'whyNow',
      label: 'Why this, and why now?',
      type: 'textarea',
      required: true,
      placeholder: 'Explain why this goal matters now...',
    },
    {
      id: 'project1',
      label: 'Project 1: Name and description',
      type: 'text',
      required: true,
      placeholder: 'Project name',
    },
    {
      id: 'project1Done',
      label: 'Project 1: What does "done" mean?',
      type: 'textarea',
      required: true,
      placeholder: 'Define success for this project...',
    },
    {
      id: 'project1Steps',
      label: 'Project 1: List 3-7 concrete next steps',
      type: 'textarea',
      required: true,
      placeholder: 'Break down into actionable steps...',
    },
    {
      id: 'project2',
      label: 'Project 2: Name and description',
      type: 'text',
      required: true,
      placeholder: 'Project name',
    },
    {
      id: 'project2Done',
      label: 'Project 2: What does "done" mean?',
      type: 'textarea',
      required: true,
      placeholder: 'Define success for this project...',
    },
    {
      id: 'project2Steps',
      label: 'Project 2: List 3-7 concrete next steps',
      type: 'textarea',
      required: true,
      placeholder: 'Break down into actionable steps...',
    },
    {
      id: 'project3',
      label: 'Project 3: Name and description (optional)',
      type: 'text',
      required: false,
      placeholder: 'Project name',
    },
    {
      id: 'project3Done',
      label: 'Project 3: What does "done" mean?',
      type: 'textarea',
      required: false,
      placeholder: 'Define success for this project...',
    },
    {
      id: 'project3Steps',
      label: 'Project 3: List 3-7 concrete next steps',
      type: 'textarea',
      required: false,
      placeholder: 'Break down into actionable steps...',
    },
    {
      id: 'weeklyReview',
      label: 'When will you review this plan each week? (day/time)',
      type: 'text',
      required: true,
      placeholder: 'e.g., Monday 9am',
    },
    {
      id: 'reviewWhat',
      label: 'What will you look at or update? (e.g. progress, blockers, new opportunities)',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your review process...',
    },
    {
      id: 'risks',
      label: 'What might derail this plan?',
      type: 'textarea',
      required: true,
      placeholder: 'Identify potential risks...',
    },
    {
      id: 'supports',
      label: 'What support or accountability do you need?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe what support you need...',
    },
  ],
  auditPrompt: '',
};

export const module4Context = `You're helping the user complete Module 4: Home - Build Your 90-Day Game Plan. This module focuses on creating a concrete 90-day action plan. Ask questions about:

- Their 90-day North Star outcome (one primary goal)
- Why this goal matters and why now
- 3-5 strategic projects that would achieve this outcome
- For each project: what "done" means and concrete next steps
- Weekly review rhythm (when, what to review)
- Risks that might derail the plan
- Support and accountability needed

Help them create a realistic, actionable 90-day plan that ties everything together.`;

