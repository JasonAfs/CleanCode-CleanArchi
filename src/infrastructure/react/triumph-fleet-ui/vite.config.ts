// src/infrastructure/react/triumph-fleet-ui/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Écoute sur toutes les interfaces réseau
    port: 5173,
    strictPort: true, // Échoue si le port est déjà utilisé
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, '../../../domain'),
      '@application': path.resolve(__dirname, '../../../application'),
      '@infrastructure': path.resolve(__dirname, '../../../infrastructure')
    }
  }
});
