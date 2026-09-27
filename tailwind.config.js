/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        ink: '#050505',
        bone: '#f5f5f3',
        ash: '#8a8a86',
      },

      fontFamily: {
        sans: ['Familjen Grotesk', 'sans-serif'],
        mono: ['Martian Mono', 'monospace'],
      },

      borderRadius: {
        '4xl': '2rem',
      },

      animation: {
        'spin-slow': 'spin 24s linear infinite',
        float: 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },

      keyframes: {
        float: {
          '0%,100%': {
            transform: 'translateY(0) translateX(0)',
          },
          '50%': {
            transform: 'translateY(-30px) translateX(20px)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      },
    },
  },

  plugins: [],
};
