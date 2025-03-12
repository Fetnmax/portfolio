Temp

<template>
  <div class="projects-container">
    <div class="sphere-container">
      <div class="sphere" ref="sphere">
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="project-point"
          :style="getPointStyle(index)"
          @mouseover="activeProject = project"
          @mouseleave="activeProject = null"
          @click="selectProject(project)"
        >
          <div class="point-dot"></div>
          <div class="project-tooltip" v-if="activeProject === project">
            {{ project.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="project-details" v-if="selectedProject">
      <div class="close-button" @click="selectedProject = null">×</div>
      <h2>{{ selectedProject.title }}</h2>
      <p>{{ selectedProject.description }}</p>
      <div class="project-images">
        <img
          v-for="(image, idx) in selectedProject.images"
          :key="idx"
          :src="image"
          :alt="selectedProject.title"
        />
      </div>
      <div class="project-links" v-if="selectedProject.links">
        <a
          v-for="(link, idx) in selectedProject.links"
          :key="idx"
          :href="link.url"
          target="_blank"
          >{{ link.text }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Projects",
  data() {
    return {
      projects: [
        {
          id: 1,
          title: "Projet 1",
          description: "Description détaillée du projet 1...",
          images: ["/images/project1-1.jpg", "/images/project1-2.jpg"],
          links: [
            { text: "Voir le site", url: "https://example.com/project1" },
            { text: "GitHub", url: "https://github.com/username/project1" },
          ],
        },
        {
          id: 2,
          title: "Projet 2",
          description: "Description détaillée du projet 2...",
          images: ["/images/project2-1.jpg"],
          links: [
            { text: "Voir le site", url: "https://example.com/project2" },
          ],
        },
        // Ajoutez d'autres projets ici
        {
          id: 3,
          title: "Projet 3",
          description: "Description détaillée du projet 3...",
          images: ["/images/project3-1.jpg"],
          links: [],
        },
        {
          id: 4,
          title: "Projet 4",
          description: "Description détaillée du projet 4...",
          images: ["/images/project4-1.jpg"],
          links: [],
        },
        {
          id: 5,
          title: "Projet 5",
          description: "Description détaillée du projet 5...",
          images: ["/images/project5-1.jpg"],
          links: [],
        },
      ],
      activeProject: null,
      selectedProject: null,
      sphereRotation: { x: 0, y: 0 },
      isDragging: false,
      lastMousePosition: { x: 0, y: 0 },
    };
  },
  mounted() {
    this.initSphereInteraction();
  },
  methods: {
    getPointStyle(index) {
      // Distribuer les points sur la sphère en utilisant la formule du fibonnaci sphere
      const phi = Math.acos(-1 + (2 * index) / this.projects.length);
      const theta = Math.sqrt(this.projects.length * Math.PI) * phi;

      // Convertir les coordonnées sphériques en coordonnées cartésiennes
      const x = Math.cos(theta) * Math.sin(phi) * 180;
      const y = Math.sin(theta) * Math.sin(phi) * 180;
      const z = Math.cos(phi) * 180;

      // Appliquer la rotation actuelle
      const rotatedX =
        x * Math.cos(this.sphereRotation.y) -
        z * Math.sin(this.sphereRotation.y);
      const rotatedZ =
        x * Math.sin(this.sphereRotation.y) +
        z * Math.cos(this.sphereRotation.y);
      const rotatedY =
        y * Math.cos(this.sphereRotation.x) +
        rotatedZ * Math.sin(this.sphereRotation.x);

      // Calculer la taille et l'opacité en fonction de la position z
      const scale = ((rotatedZ + 100) / 200) * 0.5 + 0.5;
      const opacity = ((rotatedZ + 100) / 200) * 0.8 + 0.2;

      return {
        transform: `translate(${rotatedX}px, ${rotatedY}px) scale(${scale})`,
        opacity: opacity,
        zIndex: Math.floor(rotatedZ + 100),
      };
    },
    selectProject(project) {
      this.selectedProject = project;
    },
    initSphereInteraction() {
      const sphere = this.$refs.sphere;

      sphere.addEventListener("mousedown", (e) => {
        this.isDragging = true;
        this.lastMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener("mousemove", (e) => {
        if (this.isDragging) {
          const deltaX = e.clientX - this.lastMousePosition.x;
          const deltaY = e.clientY - this.lastMousePosition.y;

          this.sphereRotation.y += deltaX * 0.01;
          this.sphereRotation.x += deltaY * 0.01;

          this.lastMousePosition = { x: e.clientX, y: e.clientY };

          // Forcer la mise à jour du rendu
          this.$forceUpdate();
        }
      });

      window.addEventListener("mouseup", () => {
        this.isDragging = false;
      });

      // Animation de rotation automatique légère
      const autoRotate = () => {
        if (!this.isDragging) {
          this.sphereRotation.y += 0.002;
          this.$forceUpdate();
        }
        requestAnimationFrame(autoRotate);
      };

      autoRotate();
    },
  },
};
</script>

<style scoped>
.projects-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #0a0a1a;
  color: white;
}

.sphere-container {
  position: relative;
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.sphere {
  position: relative;
  width: 500px;
  height: 500px;
  transform-style: preserve-3d;
  cursor: grab;
}

.sphere:active {
  cursor: grabbing;
}

.project-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.point-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #ff3366;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.8);
  transition: all 0.3s ease;
}

.project-point:hover .point-dot {
  width: 18px;
  height: 18px;
  background-color: #ff6699;
  box-shadow: 0 0 20px rgba(255, 102, 153, 0.9);
}

.project-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 1000;
}

.project-details {
  position: relative;
  width: 80%;
  max-width: 800px;
  margin-top: 50px;
  padding: 30px;
  background-color: rgba(20, 20, 40, 0.8);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s ease-out;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s;
}

.close-button:hover {
  color: white;
}

.project-details h2 {
  margin-top: 0;
  color: #ff3366;
  font-size: 24px;
}

.project-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.project-images img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.project-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.project-links a {
  display: inline-block;
  padding: 8px 15px;
  background-color: #ff3366;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.project-links a:hover {
  background-color: #ff6699;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajout d'un effet de particules en arrière-plan */
.projects-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      circle at center,
      transparent 0%,
      transparent 70%,
      rgba(10, 10, 26, 0.8) 100%
    ),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff10'/%3E%3C/svg%3E");
  background-size:
    100% 100%,
    50px 50px;
  pointer-events: none;
  z-index: -1;
}
</style>
