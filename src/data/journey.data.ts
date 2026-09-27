import { PROJECTS } from '@/data/projects.data';

// ============================================================
// TYPES
// ============================================================

export type JourneyProject = {
  type: 'project';

  x: number;
  y: number;

  width?: string;

  aspectRatio?: number;

  slug: (typeof PROJECTS)[number]['slug'];
  image: (typeof PROJECTS)[number]['image'];
  title: (typeof PROJECTS)[number]['title'];
  description: (typeof PROJECTS)[number]['description'];
};

export type JourneyContact = {
  type: 'contact';
  x: number;
  y: number;
};

export type JourneyPoint = JourneyProject | JourneyContact;

// ============================================================
// JOURNEY POINTS
// ============================================================

export const JOURNEY_POINTS: JourneyPoint[] = [
  {
    type: 'project',
    x: 25,
    y: 50,
    width: 'clamp(560px, 46vw, 900px)',
    aspectRatio: 620 / 420,
    ...PROJECTS[1],
  },

  {
    type: 'project',
    x: 77,
    y: 145,
    width: 'clamp(540px, 42vw, 850px)',
    aspectRatio: 580 / 390,
    ...PROJECTS[2],
  },

  {
    type: 'project',
    x: 50,
    y: 255,
    width: 'clamp(600px, 50vw, 960px)',
    aspectRatio: 700 / 480,
    ...PROJECTS[3],
  },

  {
    type: 'project',
    x: 20,
    y: 395,
    width: 'clamp(520px, 38vw, 720px)',
    aspectRatio: 460 / 300,
    ...PROJECTS[4],
  },

  {
    type: 'project',
    x: 56,
    y: 485,
    width: 'clamp(580px, 48vw, 930px)',
    aspectRatio: 680 / 460,
    ...PROJECTS[5],
  },

  {
    type: 'project',
    x: 76,
    y: 590,
    width: 'clamp(500px, 35vw, 660px)',
    aspectRatio: 400 / 260,
    ...PROJECTS[6],
  },

  {
    type: 'project',
    x: 24,
    y: 665,
    width: 'clamp(550px, 43vw, 820px)',
    aspectRatio: 580 / 390,
    ...PROJECTS[7],
  },

  {
    type: 'project',
    x: 70,
    y: 755,
    width: 'clamp(520px, 38vw, 700px)',
    aspectRatio: 450 / 290,
    ...PROJECTS[8],
  },

  {
    type: 'contact',
    x: 50,
    y: 850,
  },
];
