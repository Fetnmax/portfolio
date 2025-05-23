// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/global.css"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxt/icon"],
});
