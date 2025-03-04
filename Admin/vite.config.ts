import { defineConfig } from 'vite'
import { resolve } from 'path'
import image from '@rollup/plugin-image'
import { createHtmlPlugin } from 'vite-plugin-html'
import htmlPurge from 'vite-plugin-html-purgecss'

import app from './package.json';

export default defineConfig({
    root: './app',
    base: '/Admin/',
    resolve: {
      alias: {
        '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
        '~bootstrap-icons': resolve(__dirname, 'node_modules/bootstrap-icons'),
      },
    },
    plugins: [
        image(),
        htmlPurge(),
    ],
    define: {
        'APP_VERSION': JSON.stringify(app.version),
        'process.env.NODE_ENV': JSON.stringify('developpment'), //JSON.stringify('production'),
    },
});
