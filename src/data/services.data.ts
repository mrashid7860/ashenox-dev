import serviceAI from '@/assets/img/service-AI.webp';
import serviceBranding from '@/assets/img/service-branding.webp';
import serviceProductDesign from '@/assets/img/service-product-design.webp';
import serviceWebDevelopment from '@/assets/img/service-web-development.webp';
import serviceWebsiteMobileDesign from '@/assets/img/service-website-mobile-design.webp';
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
    id: 'ai',
    number: '01',
    title: 'AI & Intelligent Automation',
    eyebrow: 'INTELLIGENT SYSTEMS',
    description: 'We implement intelligent automation to simplify digital workflows. Systems are designed to enhance efficiency without adding complexity.',
    image: serviceAI,
    theme: 'light',
    visualText: 'INTEGRATED SEAMLESSLY INTO EXISTING PLATFORMS.',
    capabilities: [
      'AI-powered digital experiences',
      'AI workflow automation with n8n',
      'AI agents & virtual assistants',
      'Semantic search & recommendations',
      'AI tools for websites & web apps',
      'AI-powered business automation',
    ],
  },

  {
    id: 'web',
    number: '02',
    title: 'Website & Mobile Design',
    eyebrow: 'DIGITAL EXPERIENCES',
    description: 'We craft responsive digital experiences that feel natural across screens. Design systems are built to remain flexible as products evolve.',
    image: serviceWebsiteMobileDesign,
    theme: 'dark',
    visualText: 'DESIGNED TO PERFORM CONSISTENTLY ON EVERY DEVICE.',
    capabilities: ['High-fidelity web design', 'Mobile app design', 'Responsive experiences', 'UX/UI systems', 'Motion-first interfaces', 'Interactive storytelling'],
  },

  {
    id: 'branding',
    number: '03',
    title: 'Branding',
    eyebrow: 'BRAND SYSTEMS',
    description: 'We create distinctive identities that give businesses a clear visual language across digital and physical touchpoints.',
    image: serviceBranding,
    theme: 'light',
    visualText: 'BUILT TO CREATE A DISTINCTIVE AND MEMORABLE PRESENCE.',
    capabilities: ['Brand strategy', 'Visual identity systems', 'Logo design', 'Typography systems', 'Art direction', 'Brand guidelines'],
  },

  {
    id: 'development',
    number: '04',
    title: 'Web Development',
    eyebrow: 'ENGINEERING',
    description: 'We engineer scalable digital products with clean architecture, thoughtful interactions and performance at the core.',
    image: serviceWebDevelopment,
    theme: 'dark',
    visualText: 'ENGINEERED FOR PERFORMANCE, SCALE AND LONG-TERM GROWTH.',
    capabilities: ['React & Next.js development', 'Headless CMS', 'API integrations', 'E-commerce development', 'Performance optimization', 'Custom web applications'],
  },

  {
    id: 'product-design',
    number: '05',
    title: 'Product Design',
    eyebrow: 'PRODUCT EXPERIENCES',
    description: 'We design thoughtful digital products that balance user needs, business goals and seamless interactions from concept to launch.',
    image: serviceProductDesign,
    theme: 'light',
    visualText: 'DESIGNED AROUND PEOPLE, PURPOSE AND MEANINGFUL EXPERIENCES.',
    capabilities: ['Product strategy', 'UX research', 'User journey mapping', 'Wireframing & prototyping', 'Design systems', 'Product interface design'],
  },

  {
    id: 'wordpress',
    number: '06',
    title: 'WordPress Development',
    eyebrow: 'CONTENT PLATFORMS',
    description: 'We build flexible and scalable WordPress websites that are easy to manage, optimized for performance and tailored to each business.',
    image: serviceWordpressDevelopment,
    theme: 'dark',
    visualText: 'FLEXIBLE DIGITAL PLATFORMS BUILT FOR PERFORMANCE AND GROWTH.',
    capabilities: [
      'Custom WordPress websites',
      'Custom theme development',
      'WordPress CMS integration',
      'Elementor development',
      'Plugin development & integration',
      'WordPress performance optimization',
    ],
  },
];
