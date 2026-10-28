import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Porfilo/', // Required for GitHub Pages asset routing
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
});
