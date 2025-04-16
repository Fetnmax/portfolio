<template>
  <div class="content">
    <section class="about">
      <h2>À propos</h2>
      <div class="about-grid">
        <div class="about-text">
          <h3>Qui suis-je ?</h3>
          <p>
            Je m'appelle Maxime JACOB-SAUSSEREAU, développeur Full Stack
            passionné par le développement web et les nouvelles technologies.
          </p>
          <p>
            Curieux de nature, j’aime explorer les technologies frontend comme
            Vue.js, Nuxt.js ou Svelte, tout en m'intéressant de près aux bases
            de données, au backend et aux enjeux DevOps.
          </p>
          <p>
            Issu d’un BUT Informatique, j’ai eu l’occasion de concevoir des
            projets concrets, notamment un éditeur d’algorithmes en ligne.
            Chaque réalisation est pour moi une opportunité d’apprendre, de
            repousser mes limites et de proposer des solutions soignées, aussi
            bien sur le fond que sur la forme.
          </p>
        </div>

        <div class="timeline-container">
          <h3>Mon parcours</h3>
          <div class="timeline">
            <div
              v-for="(item, index) in timelineItems"
              :key="index"
              class="timeline-item"
              :class="{ active: activeItem === index }"
              @mouseenter="activeItem = index"
              @mouseleave="activeItem = null"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-date">{{ item.date }}</div>
              <div class="timeline-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Update the type to allow both null and number
const activeItem = ref<number | null>(null);

const timelineItems = ref([
  {
    date: "Septembre 2024 - Présent",
    title: "Alternance Développeur Full Stack - Sayaris",
    description:
      "Développement d'une application web avec Laravel et Vue.js, intégration de fonctionnalités avancées.",
  },
  {
    date: "Avril 2024 - Juin 2024",
    title: "Stage Développeur - SolidPepper",
    description:
      "Développement d’une application console en C# et d’un projet angular",
  },
  {
    date: "2022 - Présent",
    title: "BUT Informatique",
    description:
      "Prépare aux métiers de l’informatique tout en répondant aux exigences des entreprises.",
  },
]);
</script>

<style scoped>
.content {
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.about {
  max-width: 1200px;
  margin: 0 auto;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about-text {
  padding-right: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.timeline-container {
  position: relative;
}

.timeline {
  position: relative;
  padding: 1rem 0;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 8px;
  width: 2px;
  background: var(--primary-color);
}

.timeline-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  transform: translateX(0%);
  transition: all 0.3s ease;
}

.timeline-date {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.timeline-content {
  background: rgba(var(--primary-color-rgb, 49, 130, 206), 0.1);
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.timeline-content h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.timeline-content p {
  margin: 0;
}

.timeline-item.active .timeline-dot {
  transform: translateX(0%) scale(1.3);
  box-shadow: 0 0 10px rgba(var(--primary-color-rgb, 49, 130, 206), 0.5);
}

.timeline-item.active .timeline-content {
  transform: translateX(5px);
  background: rgba(var(--primary-color-rgb, 49, 130, 206), 0.2);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-text {
    padding-right: 0;
  }
}
</style>
