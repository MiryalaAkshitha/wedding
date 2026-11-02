import {defineConfig} from 'vite';
import themePlugin from './theme-plugin.mjs';
import {theme,wedding} from './wedding.config.mjs';
export default defineConfig({base:'./',esbuild:{jsx:'automatic'},build:{outDir:'dist',chunkSizeWarningLimit:600},publicDir:'public',plugins:[themePlugin(theme,wedding)]});
