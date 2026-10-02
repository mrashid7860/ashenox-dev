export const homeData = {
  hero: {
    heading: {
      prefix: ['Designed to', 'mean'],

      rotatingWords: ['Something.', 'intention.', 'purpose.', 'depth.', 'Transform.'],
    },

    cta: {
      label: 'Discuss your project',
      cursorLabel: 'Say hi',
      target: 'contact',
    },

    scroll: {
      target: 'about',
      ariaLabel: 'Scroll to about',
    },

    experience: {
      established: 'EST. 2024',
      years: '3+ Years Shaping Digital Direction',
      description: 'Websites, brands, digital experiences, and creative solutions built for clarity, growth, and lasting impact.',
    },
  },
  about: {
    label: 'About',

    paragraph: 'Ashenox is a creative digital studio building bold brands,  experiences, websites, and content through design, development, video, UGC, and digital marketing.',
  },
  aboutMisson: {
    design: ['WE CREATE WITH PURPOSE.', 'CLARITY FIRST, IMPACT ALWAYS.', 'BUILT TO INSPIRE. DESIGNED TO LAST.'],
    mission:
      'Our mission at Ashenox is to transform bold ideas into distinctive brands and meaningful digital experiences. From brand identity and graphic design to website design, UI/UX, video content, and digital marketing, we combine creativity, strategy, and technology to help businesses build memorable brands and connect with their audience.',
    vision: ['FOCUSED VISION.', 'MEASURED EXECUTION.'],
    marquee: ['CREATE', 'INSPIRE', 'IMPACT'],
    marqueeCaption: 'FROM IDEA TO OUTCOME.',
  },
  journey: {
    image: 'https://images.pexels.com/photos/459354/pexels-photo-459354.jpeg',

    heading: 'Key facts',

    description: ['A snapshot of our experience', 'and impact.'],

    partnersLabel: 'Our Business Partners',

    partners: ['credible', 'Yellowtail', 'Luxury Presence', 'technis', 'OCKTO'],

    panels: [
      {
        icon: '↗',
        title: 'Going\nZero to One',
        description: "If you're navigating a new business unit, or a new venture entirely, or breaking into a new market",
        background: '#e9e9e6',
        textColor: '#1a1a1a',
      },
      {
        icon: '○○',
        title: 'Scaling from\nOne to N',
        description: "If you've achieved Product/Service Market Fit, and are looking to scale your business to new heights",
        background: 'linear-gradient(160deg,#e23b2e 0%,#8f1712 100%)',
        textColor: '#ffffff',
      },
      {
        icon: '✳',
        title: 'Need Quick\nSolutions',
        description: 'If you know exactly what you want and need a team that can step in and quickly help you with it',
        background: 'linear-gradient(160deg,#1c1c1c 0%,#050505 100%)',
        textColor: '#ffffff',
      },
    ],
  },
} as const;
