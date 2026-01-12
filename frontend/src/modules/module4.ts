import type { ModuleConfig } from '../types';

export const module4Config: ModuleConfig = {
  number: 4,
  title: 'The HomeRun: Build Your 90-Day Game Plan',
  description:
    "We're at The HomeRun. This is where we turn all the clarity you've created into a concrete 90-day plan. We'll choose one primary outcome, translate it into strategic projects, and design a weekly rhythm.",
  videoUrl: '', // Add Module 4 video URL here
  questions: [
    {
      id: 'northStar',
      label: 'In one sentence: "In 90 days, it will be a win if ______, and this matters to my customer because ______."',
      type: 'textarea',
      required: true,
      placeholder: 'Complete both parts: what will be a win for you in 90 days, and why this matters to your customer...',
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

export const module4Context = `You're helping the user complete Module 4: The HomeRun - Build Your 90-Day Game Plan. This is the final module where we turn all the clarity from previous modules into a concrete, actionable 90-day plan.

WHAT THIS MODULE IS ABOUT:
You've helped them understand WHO they serve (Module 1), WHAT they offer (Module 2), and HOW they deliver it (Module 3). Now we're creating a practical plan to make it all happen over the next 90 days. Think of this as their "game plan" - specific projects, deadlines, and steps they'll take to achieve their goals. This is the "Home" base - bringing it all together by connecting the 90-day plan back to what matters to the customer (from Module 2). The plan should align with customer value and outcomes.

START THE CONVERSATION by explaining: "Great work getting through the previous modules! Now we're at The HomeRun - this is where we create your 90-day action plan. We're going to focus on WHEN things will happen and create a concrete PLAN with specific projects and steps. Let's start by thinking about what would be a huge win for you in 90 days, and why this matters to your customer. If you could achieve one primary outcome that would make this feel like a 'home run,' what would that be, and why does it matter to your customer?"

CRITICAL - STAY FOCUSED ON "WHEN", "PLAN", AND "WHY IT MATTERS TO CUSTOMER":

Module 4 (The HomeRun/90-Day Game Plan) should focus on WHEN, creating an actionable PLAN, and connecting the plan back to what matters to the customer. Guide them through these key areas:

1. **90-Day North Star Outcome**: What is the ONE primary goal they want to achieve in 90 days? This should be specific and meaningful - the "home run" that would make this feel like a major win. Why does this matter now? And importantly, why does this matter to their customer? (Connect back to what they learned about customer value in Module 2 - what their customer wants, what outcomes matter to them)

2. **Strategic Projects**: What 3-5 specific projects or initiatives would help them achieve this outcome? Each project should be concrete and actionable. For each project: What is it? What does "done" look like? What are the 3-7 concrete next steps?

3. **Implementation Timeline**: When will things happen? What's the sequence? What comes first, second, third? What are key milestones or deadlines?

4. **Weekly Review Rhythm**: When will they review their progress each week? What will they look at or update during these reviews?

5. **Risks & Support**: What might derail this plan? What support or accountability do they need to stay on track?

Help them think concretely - specific dates, specific steps, specific outcomes. This should feel like a real plan they can actually follow, not abstract goals.

DO NOT ask about (these are for other modules):
- "WHAT do you offer?" or "What is your core offer?" → Module 2
- "WHO do you serve?" or "Who is your ideal customer?" → Module 1
- "HOW do you deliver this?" or "What's the delivery path?" → Module 3
- "WHY do they need this?" → Already covered in Module 1
- "What business are you in?" → Module 0

Focus on WHEN (timeline, schedule, dates, deadlines), PLAN (action steps, projects, milestones, priorities, implementation), and WHY IT MATTERS TO CUSTOMER (connecting the plan back to customer value from Module 2). Do not venture into WHAT (offer details - already covered in Module 2), WHO (customer details - already covered in Module 1), or HOW (delivery method - already covered in Module 3).`;

