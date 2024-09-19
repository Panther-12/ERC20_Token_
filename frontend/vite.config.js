import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',  // Use the frontend directory as root
  build: {
    outDir: '../dist',  // Output build files to a directory in the project root
  }
});
