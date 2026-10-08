import serviceBranding from '@/assets/img/service-branding.webp';
import serviceAI from '@/assets/img/service-AI.webp';
import serviceWebsiteMobileDesign from '@/assets/img/service-website-mobile-design.webp';
import serviceWebDevelopment from '@/assets/img/service-web-development.webp';
import serviceProductDesign from '@/assets/img/service-product-design.webp';
import serviceWordpressDevelopment from '@/assets/img/service-wordpress-development.webp';
export interface Service {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  theme: 'light' | 'dark';
  capabilities: string[];
  visualText: string;
}

export const services: Service[] = [
  {
    id: 'brand',
    number: '01',
    title: 'Brand Strategy & Identity',
    eyebrow: 'BRAND',
    description: 'We build distinctive brands with clear strategy, memorable identities and visual systems designed to stand out.',
    image: serviceBranding,
    theme: 'light',
    visualText: 'BUILT TO CREATE DISTINCTIVE, MEMORABLE AND MEANINGFUL BRAND EXPERIENCES.',
    capabilities: [
      'Brand strategy & positioning',
      'Visual identity & art direction',
      'Logo & identity systems',
      'Brand guidelines & design systems',
      'Campaign concepts & creative direction',
      'Packaging & brand applications',
    ],
  },

  {
    id: 'content',
    number: '02',
    title: 'Creative Content & Campaigns',
    eyebrow: 'CONTENT',
    description: 'We create content that gives brands a voice, connects with audiences and turns ideas into culture.',
    image: serviceWebsiteMobileDesign,
    theme: 'dark',
    visualText: 'CREATIVE CONTENT BUILT TO GIVE BRANDS A DISTINCTIVE VOICE AND CULTURAL RELEVANCE.',
    capabilities: ['Social media content', 'Creative campaigns & concepts', 'Photography & art direction', 'Copywriting & storytelling', 'Content production', 'Model & campaign productions'],
  },

  {
    id: 'motion',
    number: '03',
    title: 'Motion & Visual Experiences',
    eyebrow: 'MOTION',
    description: 'We bring ideas to life through movement, cinematic storytelling and immersive visual experiences.',
    image: serviceWebDevelopment,
    theme: 'light',
    visualText: 'BROUGHT TO LIFE THROUGH MOVEMENT, CINEMATIC STORYTELLING AND IMMERSIVE VISUALS.',
    capabilities: ['Films & brand videos', 'Reels & short-form content', 'Motion graphics', '3D design & animation', 'Visual effects', 'Title sequences & transitions'],
  },

  {
    id: 'digital',
    number: '04',
    title: 'Digital Experiences',
    eyebrow: 'DIGITAL',
    description: 'We design and build digital experiences that turn attention into interaction and ideas into meaningful experiences.',
    image: serviceWordpressDevelopment,
    theme: 'dark',
    visualText: 'DESIGNED TO TURN ATTENTION INTO INTERACTION AND IDEAS INTO MEANINGFUL EXPERIENCES.',
    capabilities: ['Websites & landing pages', 'UI/UX design', 'Web applications', 'Interactive experiences', 'Digital product design', 'Creative development'],
  },

  {
    id: 'growth',
    number: '05',
    title: 'Growth & Digital Marketing',
    eyebrow: 'GROWTH',
    description: 'We connect creativity with performance to help brands reach the right audience, generate demand and grow consistently.',
    image: serviceProductDesign,
    theme: 'light',
    visualText: 'CREATIVITY AND PERFORMANCE WORKING TOGETHER TO DRIVE CONSISTENT, MEASURABLE GROWTH.',
    capabilities: ['Social media strategy', 'Performance marketing', 'Search engine optimization', 'Influencer marketing', 'Paid social & campaigns', 'Growth strategy & analytics'],
  },

  {
    id: 'ai-automation',
    number: '06',
    title: 'AI & Intelligent Automation',
    eyebrow: 'AI & AUTOMATION',
    description: 'We build intelligent systems that simplify workflows, enhance digital experiences and help businesses operate smarter.',
    image: serviceAI,
    theme: 'dark',
    visualText: 'INTELLIGENT SYSTEMS BUILT TO SIMPLIFY WORKFLOWS, ENHANCE EXPERIENCES AND OPERATE SMARTER.',
    capabilities: [
      'AI-powered digital experiences',
      'AI workflow automation',
      'AI agents & virtual assistants',
      'AI tools for websites & web apps',
      'Intelligent search & recommendations',
      'AI-powered business automation',
    ],
  },
];
