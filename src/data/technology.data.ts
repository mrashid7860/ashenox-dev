export interface TechnologyColumn {
  heading: string;
  items: string[];
}

export interface Technology {
  id: number;
  number: string;
  title: string;
  columns: TechnologyColumn[];
}
export const technologyData: Technology[] = [
  {
    id: 1,
    number: '1.',
    title: 'AI & Generative Tools',
    columns: [
      {
        heading: 'AI PLATFORMS & APIS',
        items: ['ChatGPT', 'Claude', 'Google Gemini'],
      },
      {
        heading: 'GENERATIVE TOOLS',
        items: ['Midjourney', 'Adobe Firefly', 'Runway'],
      },
    ],
  },

  {
    id: 2,
    number: '2.',
    title: 'Creative & Design',
    columns: [
      {
        heading: 'ADOBE CREATIVE CLOUD',
        items: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe After Effects', 'Adobe Premiere Pro'],
      },
      {
        heading: 'DESIGN & COLLABORATION',
        items: ['Figma', 'Canva'],
      },
    ],
  },

  {
    id: 3,
    number: '3.',
    title: 'Web & Development',
    columns: [
      {
        heading: 'FRAMEWORKS & LANGUAGES',
        items: ['Next.js', 'React', 'JavaScript', 'TypeScript'],
      },
      {
        heading: 'STYLING & DEPLOYMENT',
        items: ['Tailwind CSS', 'Vercel'],
      },
    ],
  },

  {
    id: 4,
    number: '4.',
    title: 'Marketing & Analytics',
    columns: [
      {
        heading: 'ANALYTICS & INSIGHTS',
        items: ['Google Analytics', 'Google Search Console', 'Looker Studio'],
      },
      {
        heading: 'ADVERTISING & MARKETING',
        items: ['Meta Ads Manager', 'Google Ads', 'Meta Business Suite'],
      },
    ],
  },

  {
    id: 5,
    number: '5.',
    title: 'SEO & Growth',
    columns: [
      {
        heading: 'SEO PLATFORMS',
        items: ['Semrush', 'Ahrefs', 'Screaming Frog'],
      },
      {
        heading: 'KEYWORD & SEARCH RESEARCH',
        items: ['Google Keyword Planner', 'Google Trends', 'Search Console'],
      },
    ],
  },

  {
    id: 6,
    number: '6.',
    title: 'Automation & Integrations',
    columns: [
      {
        heading: 'AUTOMATION PLATFORMS',
        items: ['n8n', 'Make', 'Zapier'],
      },
      {
        heading: 'INTEGRATIONS & APIS',
        items: ['Webhooks', 'REST APIs', 'CRM Integrations'],
      },
    ],
  },

  {
    id: 7,
    number: '7.',
    title: 'Social, Email & CRM',
    columns: [
      {
        heading: 'SOCIAL PLATFORMS',
        items: ['Instagram', 'Facebook', 'LinkedIn'],
      },
      {
        heading: 'EMAIL & CRM',
        items: ['Mailchimp', 'HubSpot', 'Brevo'],
      },
    ],
  },
];
