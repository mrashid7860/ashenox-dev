import fabriox from '@/assets/img/work/fabriox.webp';
import pc_secure from '@/assets/img/work/pc_secure.webp';
import flowly from '@/assets/img/work/flowly.webp';
import kao from '@/assets/img/work/kao.webp';
import curries_of_coast from '@/assets/img/work/curries_of_coast.webp';
import fitanaz from '@/assets/img/work/fitanaz.webp';
import captiva_containers from '@/assets/img/work/captiva_containers.webp';
import sylvi from '@/assets/img/work/sylvi.webp';
import bytewise_consultant from '@/assets/img/work/bytewise_consultant.webp';
import acare from '@/assets/img/work/acare.webp';
import loftloom from '@/assets/img/work/loftloom.jpg';
import novaglam from '@/assets/img/work/novaglam.jpg';
import onedot from '@/assets/img/work/onedot.jpg';
import pulseStudio from '@/assets/img/work/pulse-studio.jpg';
import reelix from '@/assets/img/work/reelix.jpg';
import reyden from '@/assets/img/work/reelix.jpg';
import shore from '@/assets/img/work/shore.jpg';
import techno from '@/assets/img/work/techno.jpg';
import z1FluxSolar from '@/assets/img/work/z1-flux-solar.jpg';

// ============================================================
// PROJECT DATA
// ============================================================

export const PROJECTS = [
  {
    slug: 'fabriox',
    image: fabriox,
    title: 'Fabriox',
    description: 'A refined digital experience built around a strong visual identity.',
  },

  {
    slug: 'pc-secure',
    image: pc_secure,
    title: 'PC Secure',
    description: 'A smarter cybersecurity platform providing reliable antivirus protection and safer digital experiences for individuals and businesses.',
  },

  {
    slug: 'flowly',
    image: flowly,
    title: 'Flowly',
    description: 'A focused digital experience designed for seamless interaction.',
  },

  {
    slug: 'curries-of-coast',
    image: curries_of_coast,
    title: 'Curries of Coast',
    description: 'A vibrant digital experience crafted for a contemporary coastal seafood restaurant.',
  },

  {
    slug: 'kao',
    image: kao,
    title: 'Kao',
    description: 'creating vibrant event experiences that bring people together through culture, music, and unforgettable moments.',
  },

  {
    slug: 'fitanaz',
    image: fitanaz,
    title: 'Fitanaz',
    description: 'building a premium performance nutrition brand through bold identity, strategic content, and digital experiences.',
  },

  {
    slug: 'captiva-containers',
    image: captiva_containers,
    title: 'Captiva Containers',
    description: 'A clean digital experience crafted for an innovative packaging brand specializing in BPA-free and HPP-compliant containers.',
  },

  {
    slug: 'sylvi',
    image: sylvi,
    title: 'Sylvi',
    description: 'A refined digital experience crafted for a contemporary watch brand, blending premium aesthetics with a distinctive visual direction..',
  },

  {
    slug: 'bytewise-consultant',
    image: bytewise_consultant,
    title: 'Bytewise Consultant',
    description: 'A distinctive brand identity and logo system crafted for a technology-focused consulting company.',
  },

  {
    slug: 'acare',
    image: acare,
    title: 'ACare',
    description: 'A user-focused digital platform designed for simplicity.',
  },

  {
    slug: 'loftloom',
    image: loftloom,
    title: 'Loftloom',
    description: 'A premium digital experience with a strong visual identity.',
  },

  {
    slug: 'novaglam',
    image: novaglam,
    title: 'Novaglam',
    description: 'A contemporary digital experience built around beauty and style.',
  },

  {
    slug: 'onedot',
    image: onedot,
    title: 'OneDot',
    description: 'A clean digital experience focused on simplicity.',
  },

  {
    slug: 'pulse-studio',
    image: pulseStudio,
    title: 'Pulse Studio',
    description: 'A creative digital experience with a strong visual presence.',
  },

  {
    slug: 'reelix',
    image: reelix,
    title: 'Reelix',
    description: 'A modern product experience with a strong visual identity.',
  },

  {
    slug: 'reyden',
    image: reyden,
    title: 'Reyden',
    description: 'A refined digital experience designed for modern brands.',
  },

  {
    slug: 'shore',
    image: shore,
    title: 'Shore',
    description: 'A minimal digital experience built around a clear brand system.',
  },

  {
    slug: 'techno',
    image: techno,
    title: 'Techno',
    description: 'A technology-driven digital experience built for scale.',
  },

  {
    slug: 'flux-solar',
    image: z1FluxSolar,
    title: 'Flux Solar',
    description: 'A digital experience built for a future-focused brand.',
  },
] as const;

// ============================================================
// IMAGE-ONLY ARRAY
// ============================================================
// Use this wherever your existing code expects:
// PROJECT_IMAGES[index]

export const PROJECT_IMAGES = PROJECTS.map((project) => project.image);
