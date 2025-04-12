<template>
  <section id="skills" class="skills-section">
    <div class="container">
      <h2 class="section-title">Mes Compétences</h2>

      <div class="skills-container">
        <div
          v-for="(category, index) in skillCategories"
          :key="index"
          class="skill-category"
        >
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="skills-grid">
            <div
              v-for="(skill, skillIndex) in category.skills"
              :key="skillIndex"
              class="skill-item"
            >
              <div class="skill-icon">
                <Icon :name="skill.icon" size="2.5rem" />
              </div>
              <div class="skill-info">
                <h4>{{ skill.name }}</h4>
                <div class="skill-level">
                  <div
                    class="skill-level-bar"
                    :style="{ width: `${skill.level}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
interface Skill {
  name: string;
  icon: string;
  level: number; // 0-100
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Développement Frontend",
    skills: [
      { name: "HTML5", icon: "vscode-icons:file-type-html", level: 95 },
      { name: "CSS3", icon: "vscode-icons:file-type-css", level: 90 },
      { name: "JavaScript", icon: "logos:javascript", level: 92 },
      { name: "TypeScript", icon: "logos:typescript-icon", level: 85 },
      { name: "Vue.js", icon: "logos:vue", level: 90 },
      { name: "React", icon: "logos:react", level: 80 },
      { name: "Nuxt.js", icon: "logos:nuxt-icon", level: 88 },
    ],
  },
  {
    name: "Développement Backend",
    skills: [
      { name: "Node.js", icon: "logos:nodejs-icon", level: 88 },
      { name: "Express", icon: "simple-icons:express", level: 85 },
      { name: "Python", icon: "logos:python", level: 75 },
      { name: "PHP", icon: "logos:php", level: 70 },
      { name: "MongoDB", icon: "logos:mongodb-icon", level: 80 },
      { name: "MySQL", icon: "logos:mysql", level: 85 },
    ],
  },
  {
    name: "Outils & DevOps",
    skills: [
      { name: "Git", icon: "logos:git-icon", level: 90 },
      { name: "Docker", icon: "logos:docker-icon", level: 75 },
      { name: "AWS", icon: "logos:aws", level: 70 },
      { name: "GitHub", icon: "mdi:github", level: 85 },
      { name: "CI/CD", icon: "carbon:continuous-deployment", level: 75 },
    ],
  },
  {
    name: "Design & UI/UX",
    skills: [
      { name: "Figma", icon: "logos:figma", level: 80 },
      { name: "Photoshop", icon: "logos:adobe-photoshop", level: 65 },
      { name: "Responsive Design", icon: "mdi:responsive", level: 90 },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon", level: 85 },
    ],
  },
];
</script>

<style scoped>
.skills-section {
  padding: 5rem 0;
  background-color: var(--bg-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: var(--primary-color);
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  border-left: 4px solid var(--primary-color);
  padding-left: 0.75rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-item {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  color: var(--primary-color);
}

.skill-info {
  flex: 1;
}

.skill-info h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.skill-level {
  height: 6px;
  background-color: var(--bg-light);
  border-radius: 3px;
  overflow: hidden;
}

.skill-level-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--primary-light)
  );
  border-radius: 3px;
  transition: width 1s ease-in-out;
}

/* Media queries pour la responsivité */
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .category-title {
    font-size: 1.25rem;
  }
}
</style>
