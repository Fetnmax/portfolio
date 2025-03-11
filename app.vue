<template>
  <div>
    <ThemeToggle />
    <ThreeBackground />
    <NuxtPage />
    <footer>
      <p>&copy; 2025 Maxime JACOB-SAUSSEREAU</p>
    </footer>
  </div>
</template>

<script setup>
import ThreeBackground from "~/components/ThreeBackground.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
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

footer {
  text-align: center;
  padding: 20px;
  background-color: rgba(51, 51, 51, 0.8);
  color: #fff;
}
</style>
