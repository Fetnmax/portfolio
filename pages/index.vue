<template>
  <div class="home">
    <div class="hero">
      <h1>Maxime JACOB-SAUSSEREAU</h1>
      <p class="subtitle">Développeur Full Stack</p>
    </div>
    <Projects />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
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
</style>
