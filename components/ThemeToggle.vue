<template>
  <button
    class="theme-toggle-btn"
    @click="toggleTheme"
    :class="{ dark: theme === 'dark' }"
  >
    <div class="sun-moon-container">
      <svg class="sun" viewBox="0 0 24 24">
        <circle class="sun-circle" cx="12" cy="12" r="6" />
        <g class="sun-beams">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
      <svg class="moon" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </div>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const theme = ref("light");

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.setItem("theme", theme.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  theme.value = savedTheme;
  document.documentElement.setAttribute("data-theme", savedTheme);
});
</script>

<style scoped>
.theme-toggle-btn {
  background: none;
  border: none;
  padding: 0;
  inline-size: 3rem;
  block-size: 3rem;
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

.sun-moon-container {
  --size: 1.5rem;
  position: relative;
  width: var(--size);
  height: var(--size);
  margin: auto;
}

.sun,
.moon {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  fill: var(--text-color);
  transition:
    transform 0.5s,
    opacity 0.5s;
}

.sun-beams {
  stroke: var(--text-color);
  stroke-width: 2px;
}

.theme-toggle-btn .moon {
  transform: translateY(100%) rotate(-120deg);
  opacity: 0;
}

.theme-toggle-btn.dark .sun {
  transform: translateY(-100%) rotate(120deg);
  opacity: 0;
}

.theme-toggle-btn.dark .moon {
  transform: translateY(0) rotate(0);
  opacity: 1;
}

@media (hover: none) {
  .theme-toggle-btn {
    --size: 48px;
  }
}
</style>
