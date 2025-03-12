<template>
  <div>
    <ThemeToggle />
    <NuxtPage />
  </div>
</template>

<script setup>
import ThemeToggle from "./components/layout/ThemeToggle.vue";
import { onMounted } from "vue";

onMounted(() => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const savedTheme =
    localStorage.getItem("theme") || (prefersDarkMode ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", savedTheme);
});
</script>

<style>
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  color: var(--text-color);
  background-color: transparent;
}
</style>
