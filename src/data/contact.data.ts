// ============================================================
// CONTACT DATA
// ============================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactService {
  value: string;
  label: string;
}

export interface ContactBudget {
  value: string;
  label: string;
}

export const CONTACT_FAQ: FAQItem[] = [
  {
    question: 'What kind of work do you take on?',
    answer: 'We partner on branding, websites, digital products, and digital systems where clarity, craft, and execution matter.',
  },
  {
    question: 'Who do you usually work with?',
    answer: 'We work with ambitious companies, founders, teams, and agencies looking for thoughtful digital design and development.',
  },
  {
    question: 'How do projects typically begin?',
    answer: 'Projects usually begin with a short conversation about your goals, timeline, requirements, and the kind of outcome you are looking for.',
  },
  {
    question: 'Do you partner with agencies long-term?',
    answer: 'Yes. We can work as an extended design and development partner for agencies that need reliable long-term support.',
  },
  {
    question: 'Can we sign an NDA before starting?',
    answer: 'Yes. An NDA can be arranged before sharing confidential project information.',
  },
  {
    question: 'How are projects priced and paid for?',
    answer: 'Pricing depends on the scope, complexity, timeline, and level of involvement required. We discuss the engagement and payment structure before starting.',
  },
  {
    question: 'Are you currently taking on new work?',
    answer: 'We are open to selected new projects. Send us a short note about your requirements and we will get back to you.',
  },
];

export const CONTACT_SERVICES: ContactService[] = [
  {
    value: 'branding',
    label: 'Branding',
  },
  {
    value: 'website',
    label: 'Website',
  },
  {
    value: 'digital-product',
    label: 'Digital Product',
  },
  {
    value: 'development',
    label: 'Development',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export const CONTACT_BUDGETS: ContactBudget[] = [
  {
    value: 'under-5k',
    label: 'Under $5K',
  },
  {
    value: '5-10k',
    label: '$5K – $10K',
  },
  {
    value: '10-25k',
    label: '$10K – $25K',
  },
  {
    value: '25k-plus',
    label: '$25K+',
  },
];

export const CONTACT_LOCATION = {
  company: 'ASHENOX',
  address: ['Office No. 216 - 4Plus Complex', 'Sardar nagar main road, Astron Chowk', 'Rajkot 360001, Gujarat, India.'],
};

export const CONTACT_EMAILS = {
  general: 'hello@ashenox.com',
  careers: 'info@ashenox.com',
};

export const CONTACT_COPY = {
  heroTitle: "Let's start something.",
  heroDescription: ['We collaborate with teams who value clarity,', 'craft, and long-term thinking.'],

  formEyebrow: ['A short conversation is often', 'the best place to begin.'],

  formTitle: "Let's work together",

  formDescription: ["We'd love to hear about your project.", 'We usually reply within one business day.'],

  joinDescription: ['We work with people who care deeply about craft, clarity, and thoughtful execution.', 'Send a short note and your work.'],

  joinSubtext: 'Or, reach out via the contact form.',

  faqDescription: ['Common things people', 'ask before we begin.'],
};
