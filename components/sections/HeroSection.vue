<template>
  <ThreeBackground />
  <div class="hero">
    <h1>Maxime JACOB-SAUSSEREAU</h1>
    <p class="subtitle">Développeur Full Stack</p>
    <div class="scroll-arrow" @click="scrollToNext">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M7 13l5 5 5-5M7 7l5 5 5-5"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThreeBackground from "~/components/three/ThreeBackground.vue";

const scrollToNext = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
};
</script>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

h1 {
  font-size: 4rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.5rem;
  margin-top: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.scroll-arrow {
  position: absolute;
  bottom: 2rem;
  cursor: pointer;
  animation: bounce 2s infinite;
  color: var(--text-color);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.scroll-arrow:hover {
  opacity: 1;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>
