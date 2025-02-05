<template>
  <div>
    <ThreeBackground />
    <NuxtPage />
    <footer>
      <p>&copy; 2023 Maxime JACOB-SAUSSEREAU</p>
    </footer>
  </div>
</template>

<script setup>
import ThreeBackground from "~/components/ThreeBackground.vue";
</script>

<style>
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  color: #fff;
  background-color: transparent;
}

footer {
  text-align: center;
  padding: 20px;
  background-color: rgba(51, 51, 51, 0.8);
  color: #fff;
}
</style>
