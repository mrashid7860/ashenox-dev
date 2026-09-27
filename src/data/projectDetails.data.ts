import myworker01 from '@/assets/img/projectDetails/myworker-1.webp';
import myworker02 from '@/assets/img/projectDetails/myworker-2.webp';
import myworker03 from '@/assets/img/projectDetails/myworker-3.webp';
import myworker04_1 from '@/assets/img/projectDetails/myworker-4_1.webp';
import myworker04_2 from '@/assets/img/projectDetails/myworker-4_2.webp';
import myworker05 from '@/assets/img/projectDetails/myworker-5.webp';
import myworker06 from '@/assets/img/projectDetails/myworker-6.webp';
import myworker07 from '@/assets/img/projectDetails/myworker-7.webp';
import myworker08 from '@/assets/img/projectDetails/myworker-8.webp';
import myworker09 from '@/assets/img/projectDetails/myworker-9.webp';
import myworker10 from '@/assets/img/projectDetails/myworker-10.webp';
import myworker11 from '@/assets/img/projectDetails/myworker-11.webp';

import flux01 from '@/assets/img/projectDetails/myworker-11.webp';
import flux02 from '@/assets/img/projectDetails/myworker-11.webp';
import flux03 from '@/assets/img/projectDetails/myworker-11.webp';
import flux04 from '@/assets/img/projectDetails/myworker-11.webp';

// ============================================================
// TYPES
// ============================================================

export type ProjectTab = {
  label: string;
  content: string | string[];
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  services: string[];
  tabs: ProjectTab[];

  images: {
    src: string;
    alt?: string;
    size?: 'full' | 'half';
  }[];
};

// ============================================================
// PROJECT DATA
// ============================================================

export const projects: Project[] = [
  {
    slug: 'curries-of-coast',
    title: 'MyWorker AI',
    category: 'AI Product Design',
    description: 'AI platform simplifying hiring, management, and workforce scaling.',

    services: ['AI Product Design', 'UI/UX Design', 'Web Development', 'Interaction Design'],

    tabs: [
      {
        label: 'The challenge',
        content:
          'MyWorker.ai needed to present a complex AI-driven workforce platform in a way that feels simple and approachable. The product included multiple features that could easily overwhelm users. The key challenge was balancing clarity with capability while creating a modern, intelligent, and trustworthy brand experience.',
      },
      {
        label: 'Approach',
        content:
          'We focused on simplifying the experience through clear structure and intuitive flows. Users were guided step by step across the platform while maintaining a clean and minimal visual language. Subtle interactions added depth without introducing unnecessary complexity.',
      },
      {
        label: 'Outcome',
        content:
          'The result is a streamlined platform that feels easy to use yet powerful in capability. Users can quickly understand and navigate the system with confidence, while the refined design improves engagement and establishes trust in the product.',
      },
      {
        label: 'What we did',
        content: [
          'Designed intuitive user flows to simplify complex workforce processes.',
          'Developed a clean and scalable front-end experience.',
          'Created a modern and minimal visual design system.',
          'Improved usability and engagement across key product journeys.',
        ],
      },
    ],

    images: [
      {
        src: myworker01,
        alt: 'MyWorker AI project screen 1',
        size: 'full',
      },
      {
        src: myworker02,
        alt: 'MyWorker AI project screen 2',
        size: 'full',
      },
      {
        src: myworker03,
        alt: 'MyWorker AI project screen 3',
        size: 'full',
      },
      {
        src: myworker04_1,
        alt: 'MyWorker AI project screen 4',
        size: 'half',
      },
      {
        src: myworker04_2,
        alt: 'MyWorker AI project screen 5',
        size: 'half',
      },
      {
        src: myworker05,
        alt: 'MyWorker AI project screen 6',
        size: 'full',
      },
      {
        src: myworker06,
        alt: 'MyWorker AI project screen 7',
        size: 'full',
      },
      {
        src: myworker07,
        alt: 'MyWorker AI project screen 8',
        size: 'full',
      },
      {
        src: myworker08,
        alt: 'MyWorker AI project screen 9',
        size: 'full',
      },
      {
        src: myworker09,
        alt: 'MyWorker AI project screen 10',
        size: 'full',
      },
      {
        src: myworker10,
        alt: 'MyWorker AI project screen 11',
        size: 'full',
      },
      {
        src: myworker11,
        alt: 'MyWorker AI project screen 12',
        size: 'full',
      },
    ],
  },

  {
    slug: 'pc-secure',
    title: 'Flux Solar',
    category: 'Digital Experience',
    description: 'A digital experience designed to make renewable energy easier to understand and explore.',

    services: ['Product Design', 'UI/UX Design', 'Web Development', 'Motion Design'],

    tabs: [
      {
        label: 'The challenge',
        content: 'Flux Solar needed a digital experience that could communicate complex renewable energy products in a clear and engaging way.',
      },
      {
        label: 'Approach',
        content: 'We created a structured experience combining strong visual hierarchy, intuitive navigation, and interactive product storytelling.',
      },
      {
        label: 'Outcome',
        content: 'The final experience makes complex information easier to understand while giving the brand a modern digital presence.',
      },
      {
        label: 'What we did',
        content: ['Product experience design', 'Responsive interface design', 'Interactive storytelling', 'Front-end development'],
      },
    ],

    images: [
      {
        src: flux01,
        alt: 'Flux Solar project screen 1',
        size: 'full',
      },
      {
        src: flux02,
        alt: 'Flux Solar project screen 2',
        size: 'full',
      },
      {
        src: flux03,
        alt: 'Flux Solar project screen 3',
        size: 'half',
      },
      {
        src: flux04,
        alt: 'Flux Solar project screen 4',
        size: 'half',
      },
    ],
  },
];

// ============================================================
// GET PROJECT
// ============================================================

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
