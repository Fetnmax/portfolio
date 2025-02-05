<template>
  <section id="projects" class="projects">
    <h2>Mes Projets</h2>
    <div class="project-list">
      <div v-for="project in projects" :key="project.title" class="project">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <a :href="project.link" target="_blank">Voir le projet</a>
      </div>
    </div>
  </section>
</template>

<script setup>
const projects = [
  {
    title: "Projet 1",
    description: "Description du projet 1.",
    link: "#",
  },
  {
    title: "Projet 2",
    description: "Description du projet 2.",
    link: "#",
  },
];
</script>

<style scoped>
.projects {
  padding: 50px 20px;
  background-color: #fff;
  color: #333;
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.project {
  flex: 1 1 300px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
