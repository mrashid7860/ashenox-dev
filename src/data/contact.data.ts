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
    answer:
      'We work across branding, graphic design, websites, video and motion, UGC & model content, and digital marketing. We partner with brands that value clear ideas, strong design, and meaningful digital experiences.',
  },
  {
    question: 'Who do you usually work with?',
    answer: 'We work with startups, businesses, creators, and growing brands looking to build or strengthen their visual identity and digital presence.',
  },
  {
    question: 'How do projects typically begin?',
    answer: 'Every project starts with a conversation. We understand your goals, audience, requirements, and vision before defining the right creative direction, scope, timeline, and deliverables.',
  },
  {
    question: 'Do you partner with agencies long-term?',
    answer: 'Yes. We collaborate with agencies and creative teams on ongoing design, content, branding, and digital projects, either as an extended creative team or on a project basis.',
  },
  {
    question: 'Can we sign an NDA before starting?',
    answer: 'Absolutely. We can work under an NDA when a project involves confidential information, unreleased products, business strategies, or proprietary ideas.',
  },
  {
    question: 'How are projects priced and paid for?',
    answer:
      'Pricing depends on the scope, complexity, deliverables, and timeline of each project. Once we understand your requirements, we provide a clear proposal with the project scope, pricing, and payment terms.',
  },
  {
    question: 'Are you currently taking on new work?',
    answer: "Yes. We're open to selected projects and collaborations. If you have a project in mind, get in touch with us at info@ashenox.com, and let's discuss it.",
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
  addresses: [
    {
      city: 'Bhubaneswar',
      address: 'Odisha 751001, India',
    },
    {
      city: 'Gachibowli',
      address: 'Hyderabad, Telangana 500032, India',
    },
  ],
};

export const CONTACT_EMAILS = {
  general: 'info@ashenox.com',
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
