import { defineConfig } from 'vite';
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

export default defineConfig({
  root: './src',
  base: '/SessionCoach/App/', // For deployment on website
  //base: '/', // For deployment on local
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
  },
  define: {
    // inject the application version in the application's code
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    SERVER_URL: JSON.stringify(process.env.SERVER_URL),
    PUBLIC_PATH: JSON.stringify(process.env.PUBLIC_PATH),
    KEY_APP: JSON.stringify(process.env.KEY_APP),
  },
});
