export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  text: string;
  rating?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const introConfig = {
  videoUrl: '', // Add your intro video URL here (YouTube, Vimeo, or direct video URL)
  
  hero: {
    title: 'Welcome to Homerun Strategy Lab',
    subtitle: 'Transform your business clarity with a proven, step-by-step strategy framework',
  },
  
  whatYoullSee: {
    title: "What You'll Experience",
    content: `Get crystal clear on your business strategy through our structured, step-by-step process. Work through five strategic modules, each building on the last, to create a comprehensive strategy perfectly tailored to your business and goals. No guesswork—just clear direction and actionable insights.`,
  },
  
  whatToDo: {
    title: 'How It Works',
    content: `Choose your preferred approach: engage in an AI-guided conversation with our business strategy coach, or complete structured forms at your own pace. After each module, receive a detailed AI-generated audit review that highlights your strengths, identifies opportunities, and reveals potential risks—helping you make informed decisions every step of the way.`,
  },
  
  whatToExpect: {
    title: "What You'll Achieve",
    content: `Walk away with complete clarity on your current reality, a deep understanding of your ideal customer, a refined core offer, a clear delivery path, and a concrete 90-day action plan. You'll have comprehensive audit reviews for each module, plus a combined overview document and detailed action plan to guide your immediate next steps toward growth.`,
  },
  
  // Optional testimonials - set to empty array to hide the section
  testimonials: [] as Testimonial[],
  // Example format (uncomment and customize as needed):
  // testimonials: [
  //   {
  //     name: 'Jane Smith',
  //     role: 'Business Owner',
  //     company: 'ABC Consulting',
  //     text: 'This strategy lab helped me gain clarity on my business direction in ways I never expected.',
  //     rating: 5,
  //   },
  // ] as Testimonial[],

  // FAQ Section - set to empty array to hide the section
  faqs: [
    {
      question: 'How long does it take to complete all modules?',
      answer: 'The entire process is self-paced, but most entrepreneurs complete all five modules in 2-4 hours. You can work through them all at once or spread them out over several days—whatever works best for your schedule.',
    },
    {
      question: 'Do I need any prior business experience?',
      answer: 'Not at all! Whether you\'re just starting out or looking to refine your existing strategy, the modules are designed to guide you through each step. The AI coach adapts to your level of experience and helps you think through each concept.',
    },
    {
      question: 'Can I go back and edit my responses?',
      answer: 'Yes! You can revisit any completed module to review or update your responses. Your strategy evolves, and so should your plan. You have full access to modify your work as needed.',
    },
    {
      question: 'What format will I receive my final documents in?',
      answer: 'You\'ll receive comprehensive audit reviews as markdown documents that you can download as PDFs. Your final combined overview and 90-day action plan are also available as downloadable PDFs, so you can save, share, or print them as needed.',
    },
    {
      question: 'Is my information secure and private?',
      answer: 'Absolutely. Your data is encrypted and stored securely. We never share your business information with third parties. Your strategy remains completely private and accessible only to you.',
    },
    {
      question: 'What if I get stuck or need help?',
      answer: 'The AI coach is designed to help guide you through any confusion. If you\'re struggling with a question, the coach will provide examples, frameworks, and multiple perspectives to help you think through your answer. Take your time—there are no wrong answers, only opportunities for deeper clarity.',
    },
  ] as FAQ[],
};

