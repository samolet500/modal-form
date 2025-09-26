// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxtjs/google-fonts'],
  css: ['vue-final-modal/style.css', '~/assets/styles/index.scss'],
  googleFonts: {
    families: {
      Montserrat: [300, 400, 500, 600, 700]
    },
    display: 'swap'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/styles/variables.scss" as *;
        `,
        }
      }
    }
  },
})