export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: 'STEP - 1',
    title: 'Understand',
    description: 'We begin by listening. Understanding your vision, challenges, and context allows us to define the right problem before designing the solution.',
  },
  {
    number: 'STEP - 2',
    title: 'Design & Build',
    description: 'We translate insight into systems shaping thoughtful design, refined interactions, and robust execution with care and precision.',
  },
  {
    number: 'STEP - 3',
    title: 'Deliver',
    description: 'We deliver a refined experience built for performance, scalability, and long-term impact.',
  },
];
