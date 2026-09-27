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
    title: 'AI & Intelligent Automation',
    columns: [
      {
        heading: 'AI PLATFORMS & APIS',
        items: ['OpenAI API (GPT models)', 'OpenAI SDK (Node.js / PHP integrations)'],
      },
      {
        heading: 'AI CAPABILITIES',
        items: [
          'AI-powered chatbots & assistants',
          'Content generation (text, email, CMS content)',
          'AI-driven search & recommendations',
          'AI workflow automation with n8n',
          'AI integrations for websites & web apps',
        ],
      },
    ],
  },

  {
    id: 2,
    number: '2.',
    title: 'Front-end',
    columns: [
      {
        heading: 'FRAMEWORKS & LIBRARIES',
        items: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'jQuery'],
      },
      {
        heading: 'STYLING & UI',
        items: ['Bootstrap', 'Tailwind CSS', 'Sass (SCSS)', 'LESS'],
      },
      {
        heading: 'WEB & ANIMATION',
        items: ['Animated Websites', 'Interactive UI / Motion Design', 'Responsive & Performance-Optimized Frontends'],
      },
      {
        heading: 'ANIMATION & INTERACTIVE EXPERIENCES',
        items: ['GSAP', 'Framer Motion', 'Three.js', 'WebGL', 'HTML5 Canvas', 'Shaders'],
      },
    ],
  },

  {
    id: 3,
    number: '3.',
    title: 'Back-end',
    columns: [
      {
        heading: 'LANGUAGES & RUNTIME',
        items: ['PHP', 'Node.js'],
      },
      {
        heading: 'FRAMEWORKS',
        items: ['Express.js'],
      },
      {
        heading: 'PLATFORM & SYSTEMS',
        items: ['Magento', 'WordPress'],
      },
      {
        heading: 'APIS & INTEGRATIONS',
        items: ['REST APIs', 'Headless architecture support'],
      },
    ],
  },

  {
    id: 4,
    number: '4.',
    title: 'Databases & Content Management',
    columns: [
      {
        heading: 'DATABASES',
        items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
      },
      {
        heading: 'HEADLESS / CMS',
        items: ['WordPress CMS', 'HubSpot CMS', 'Contentful', 'Sanity', 'Strapi'],
      },
      {
        heading: 'ECOMMERCE CMS',
        items: ['WooCommerce', 'Shopify'],
      },
    ],
  },

  {
    id: 5,
    number: '5.',
    title: 'Cloud Services',
    columns: [
      {
        heading: 'CLOUD PLATFORMS',
        items: ['Amazon Web Services (AWS)', 'Google Cloud Platform (GCP)', 'DigitalOcean'],
      },
      {
        heading: 'CLOUD CAPABILITIES',
        items: ['Scalable Cloud Hosting', 'Managed Database', 'Cloud-based deployments'],
      },
    ],
  },

  {
    id: 6,
    number: '6.',
    title: 'DevOps & Infrastructure',
    columns: [
      {
        heading: 'VERSION CONTROL',
        items: ['GIT', 'GitHub', 'DigitalOcean'],
      },
      {
        heading: 'CI/CD',
        items: ['GitHub Actions'],
      },
      {
        heading: 'AUTOMATION & WORKFLOWS',
        items: ['n8n (Workflow Automation)'],
      },
    ],
  },

  {
    id: 7,
    number: '7.',
    title: 'Marketing, Email & Integrations',
    columns: [
      {
        heading: 'EMAIL & COMMUNICATION',
        items: ['HubSpot', 'HubSpot Email Templates', 'SendGrid Email Templates'],
      },
      {
        heading: 'MARKETING AUTOMATION',
        items: ['CRM & Email Automation', 'API-driven campaign workflows'],
      },
    ],
  },
];
