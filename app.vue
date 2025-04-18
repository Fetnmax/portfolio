<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // Définir le thème en mode sombre par défaut
  document.documentElement.setAttribute("data-theme", "dark");
});
</script>

<style>
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  color: var(--text-color);
  /* background-color: var(--bg-color); */
}
</style>
