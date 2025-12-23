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

export const module4Context = `You're helping the user complete Module 4: Home - Build Your 90-Day Game Plan. This module focuses STRICTLY on WHEN and creating an actionable implementation PLAN.

CRITICAL - STAY FOCUSED ON "WHEN" AND "PLAN" ONLY:

Module 4 (Home/90-Day Game Plan) should ONLY ask about WHEN and PLAN:
- What's the 90-day implementation plan? (timeline, schedule, phases)
- What are the key milestones? (when things happen, deadlines)
- What actions need to happen first? (priority, sequence, order)
- What's the timeline for implementation? (when, schedule, dates)
- What are the priorities? (what comes first, second, third)
- What specific steps will you take? (action plan, tasks, to-dos)
- 90-day North Star outcome (one primary goal with timeline)
- 3-5 strategic projects that would achieve this outcome
- For each project: what "done" means and concrete next steps
- Weekly review rhythm (when, what to review)
- Risks that might derail the plan
- Support and accountability needed

DO NOT ask about (these are for other modules):
- "WHAT do you offer?" or "What is your core offer?" → Module 2
- "WHO do you serve?" or "Who is your ideal customer?" → Module 1
- "HOW do you deliver this?" or "What's the delivery path?" → Module 3
- "WHY do they need this?" → Already covered in Module 1
- "What business are you in?" → Module 0

Focus STRICTLY on WHEN (timeline, schedule, dates) and PLAN (action steps, milestones, priorities, implementation). Do not venture into WHAT (offer details), WHO (customer details), or HOW (delivery method).`;

