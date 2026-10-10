import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/node_modules/three/') || id.includes('/node_modules/@react-three/')) {
            return 'three';
          }

          if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion-dom/') || id.includes('/node_modules/motion-utils/')) {
            return 'motion';
          }

          if (id.includes('/node_modules/gsap/')) {
            return 'gsap';
          }

          if (id.includes('/node_modules/lenis/')) {
            return 'lenis';
          }
        },
      },
    },
  },
});
