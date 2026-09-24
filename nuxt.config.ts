// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // Keep production builds from overwriting a running dev server.
  $production: { buildDir: ".nuxt-production" },
  runtimeConfig: { restCountriesApiKey: "" },
  app: {
    head: {
      title: 'Country Finder', // default fallback title
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/flame.png' },
      ]
    }
  },
  modules: ['@pinia/nuxt'],
  compatibilityDate: '2025-04-23',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})