<template>
  <section class="projects-section">
    <div class="section-content">
      <div class="title-container">
        <h2 class="section-title">Projets</h2>
        <div class="help-container">
          <button
            class="help-button"
            @mouseenter="showHelp = true"
            @mouseleave="showHelp = false"
          >
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M512 81.408a422.4 422.4 0 1 0 422.4 422.4A422.4 422.4 0 0 0 512 81.408z m26.624 629.76a45.056 45.056 0 0 1-31.232 12.288 42.496 42.496 0 0 1-31.232-12.8 41.984 41.984 0 0 1-12.8-30.72 39.424 39.424 0 0 1 12.8-30.72 42.496 42.496 0 0 1 31.232-12.288 43.008 43.008 0 0 1 31.744 12.288 39.424 39.424 0 0 1 12.8 30.72 43.008 43.008 0 0 1-13.312 31.744z m87.04-235.52a617.472 617.472 0 0 1-51.2 47.104 93.184 93.184 0 0 0-25.088 31.232 80.896 80.896 0 0 0-9.728 39.936v10.24h-64v-10.24a119.808 119.808 0 0 1 12.288-57.344A311.296 311.296 0 0 1 555.52 460.8l10.24-11.264a71.168 71.168 0 0 0 16.896-44.032A69.632 69.632 0 0 0 563.2 358.4a69.632 69.632 0 0 0-51.2-17.92 67.072 67.072 0 0 0-58.88 26.112 102.4 102.4 0 0 0-16.384 61.44h-61.44a140.288 140.288 0 0 1 37.888-102.4 140.8 140.8 0 0 1 104.96-38.4 135.68 135.68 0 0 1 96.256 29.184 108.032 108.032 0 0 1 36.352 86.528 116.736 116.736 0 0 1-25.088 73.216z"
              />
            </svg>
          </button>

          <!-- Tooltip d'aide -->
          <div class="help-tooltip" v-if="showHelp">
            <div class="tooltip-content">
              <h3>Comment ça marche ?</h3>
              <p>
                Cette sphère interactive représente mes projets. Chaque point
                rouge est un projet sur lequel vous pouvez cliquer pour voir
                plus de détails.
              </p>
              <ul>
                <li>
                  Faites tourner la sphère en la faisant glisser avec votre
                  souris
                </li>
                <li>Survolez un point rouge pour voir le nom du projet</li>
                <li>Cliquez sur un point pour ouvrir les détails du projet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="sphere-container" ref="container"></div>
    </div>

    <!-- Modal pour afficher les détails du projet -->
    <div class="project-modal" v-if="selectedProject" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <h3>{{ selectedProject.title }}</h3>
        <p>{{ selectedProject.description }}</p>
        <div class="project-details">
          <div class="technologies">
            <h4>Technologies</h4>
            <ul>
              <li
                v-for="(tech, index) in selectedProject.technologies"
                :key="index"
              >
                {{ tech }}
              </li>
            </ul>
          </div>
          <div
            class="links"
            v-if="selectedProject.links && selectedProject.links.length > 0"
          >
            <h4>Liens</h4>
            <div class="link-buttons">
              <a
                v-for="(link, index) in selectedProject.links"
                :key="index"
                :href="link.url"
                target="_blank"
                class="link-button"
              >
                {{ link.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="project-image" v-if="selectedProject.image">
          <img :src="selectedProject.image" :alt="selectedProject.title" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import projectsData from "../../data/projects.json";

export default {
  name: "ProjectsSection",
  setup() {
    const container = ref(null);
    const selectedProject = ref(null);
    const showHelp = ref(false);

    // Référence pour stocker les objets Three.js
    let scene, camera, renderer, controls;
    let sphere, raycaster, mouse;
    let projectPoints = [];

    // Utilisation des projets depuis le fichier JSON
    const projects = projectsData;

    // Initialisation de Three.js
    const initThree = () => {
      // Création de la scène
      scene = new THREE.Scene();
      scene.background = null;

      // Création de la caméra
      camera = new THREE.PerspectiveCamera(
        75,
        container.value.clientWidth / container.value.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 1.8;

      // Création du renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(
        container.value.clientWidth,
        container.value.clientHeight
      );
      container.value.appendChild(renderer.domElement);

      // Ajout des contrôles pour la rotation
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;

      // Solution 1: Désactiver complètement le zoom
      controls.enableZoom = false;

      // Solution 2 (alternative): Garder le zoom mais limiter sa portée
      // controls.enableZoom = true;
      // controls.minDistance = 1.8;
      // controls.maxDistance = 2.2;

      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      // Création de la sphère
      createSphere();

      // Ajout des points pour les projets
      addProjectPoints();

      // Initialisation du raycaster pour la détection des clics
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Ajout des événements
      window.addEventListener("resize", onWindowResize);
      renderer.domElement.addEventListener("click", onClick);
      renderer.domElement.addEventListener("mousemove", onMouseMove);

      // Animation
      animate();
    };

    // Création de la sphère avec des lignes de grille
    const createSphere = () => {
      // Création de la géométrie de la sphère
      const geometry = new THREE.SphereGeometry(1, 32, 32);

      // Matériau transparent pour la sphère
      const material = new THREE.MeshBasicMaterial({
        color: 0x1a1a3a,
        transparent: true,
        opacity: 0.1,
        wireframe: false,
      });

      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Ajout des lignes horizontales (latitudes)
      const latitudeCount = 15;
      for (let i = 0; i <= latitudeCount; i++) {
        const phi = (Math.PI * i) / latitudeCount;
        const radius = Math.sin(phi);
        const y = Math.cos(phi);

        if (radius > 0.01) {
          // Éviter les cercles trop petits aux pôles
          const segments = 64;
          const points = [];

          for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);
            points.push(new THREE.Vector3(x, y, z));
          }

          const lineColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--primary-color");

          const latitudeGeometry = new THREE.BufferGeometry().setFromPoints(
            points
          );
          const latitudeLine = new THREE.Line(
            latitudeGeometry,
            new THREE.LineBasicMaterial({
              color: lineColor,
              transparent: true,
              opacity: 0.3,
            })
          );

          scene.add(latitudeLine);
        }
      }

      // Ajout des lignes verticales (longitudes)
      const longitudeCount = 15;
      for (let i = 0; i < longitudeCount; i++) {
        const theta = (2 * Math.PI * i) / longitudeCount;

        const points = [];
        for (let j = 0; j <= 64; j++) {
          const phi = (Math.PI * j) / 64;
          const radius = 1;

          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);

          points.push(new THREE.Vector3(x, y, z));
        }

        const lineColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--primary-color");

        const longitudeGeometry = new THREE.BufferGeometry().setFromPoints(
          points
        );

        const longitudeLine = new THREE.Line(
          longitudeGeometry,
          new THREE.LineBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.3,
          })
        );

        scene.add(longitudeLine);
      }
    };

    // Ajout des points pour les projets
    const addProjectPoints = () => {
      projects.forEach((project) => {
        // Normalisation de la position pour être sur la sphère
        const position = new THREE.Vector3(
          project.position.x,
          project.position.y,
          project.position.z
        ).normalize();

        // Création du point
        const geometry = new THREE.SphereGeometry(0.02, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xff3333 });
        const point = new THREE.Mesh(geometry, material);

        point.position.copy(position);
        point.userData = { project };

        scene.add(point);
        projectPoints.push(point);

        // Ajout d'un halo autour du point
        const haloGeometry = new THREE.SphereGeometry(0.025, 16, 16);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xff5555,
          transparent: true,
          opacity: 0.5,
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);

        halo.position.copy(position);
        scene.add(halo);
      });
    };

    // Gestion du redimensionnement de la fenêtre
    const onWindowResize = () => {
      camera.aspect =
        container.value.clientWidth / container.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        container.value.clientWidth,
        container.value.clientHeight
      );
    };

    // Gestion des clics sur les points
    const onClick = (event) => {
      // Calcul de la position de la souris en coordonnées normalisées
      mouse.x =
        ((event.clientX - container.value.getBoundingClientRect().left) /
          container.value.clientWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - container.value.getBoundingClientRect().top) /
          container.value.clientHeight
        ) *
          2 +
        1;

      // Lancer un rayon depuis la caméra
      raycaster.setFromCamera(mouse, camera);

      // Vérifier les interse ctions avec les points
      const intersects = raycaster.intersectObjects(projectPoints);

      if (intersects.length > 0) {
        const project = intersects[0].object.userData.project;
        selectedProject.value = project;
        controls.autoRotate = false;

        // Masquer le tooltip lorsqu'un projet est sélectionné
        if (document.querySelector(".project-tooltip")) {
          document.querySelector(".project-tooltip").style.display = "none";
        }
      }
    };

    // Gestion du survol des points
    const onMouseMove = (event) => {
      mouse.x =
        ((event.clientX - container.value.getBoundingClientRect().left) /
          container.value.clientWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - container.value.getBoundingClientRect().top) /
          container.value.clientHeight
        ) *
          2 +
        1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(projectPoints);

      // Réinitialiser la taille de tous les points
      projectPoints.forEach((point) => {
        point.scale.set(1, 1, 1);
      });

      // Masquer le tooltip s'il n'y a pas de survol
      if (document.querySelector(".project-tooltip")) {
        document.querySelector(".project-tooltip").style.display = "none";
      }

      // Agrandir le point survolé et changer le curseur
      if (intersects.length > 0) {
        intersects[0].object.scale.set(1.5, 1.5, 1.5);
        renderer.domElement.style.cursor = "pointer";

        // Récupérer les informations du projet
        const project = intersects[0].object.userData.project;
        document.title = project.title;

        // Afficher le tooltip avec le titre du projet
        showProjectTooltip(event, project.title);
      } else {
        renderer.domElement.style.cursor = "default";
        document.title = "Portfolio";
      }
    };

    // Fonction pour afficher le tooltip du projet
    const showProjectTooltip = (event, title) => {
      // Créer ou récupérer le tooltip
      let tooltip = document.querySelector(".project-tooltip");

      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "project-tooltip";
        document.body.appendChild(tooltip);
      }

      // Mettre à jour le contenu et la position
      tooltip.textContent = title;
      tooltip.style.display = "block";
      tooltip.style.left = `${event.clientX + 10}px`;
      tooltip.style.top = `${event.clientY + 10}px`;
    };

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // Fermeture de la modal
    const closeModal = () => {
      selectedProject.value = null;
      controls.autoRotate = true;
    };

    // Initialisation au montage du composant
    onMounted(() => {
      initThree();
    });

    // Nettoyage avant de démonter le composant
    onBeforeUnmount(() => {
      window.removeEventListener("resize", onWindowResize);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);

      // Libération des ressources
      if (renderer) {
        renderer.dispose();
        container.value.removeChild(renderer.domElement);
      }
    });

    return {
      container,
      selectedProject,
      closeModal,
      showHelp,
    };
  },
};
</script>

<style scoped>
.projects-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  padding: 2rem;
}

.section-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: inline-block;
}

.sphere-container {
  width: 100%;
  height: 70vh;
  position: relative;
}

/* Styles pour la modal */
.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: var(--modal-background);
  border-radius: 10px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 0 30px var(--modal-shadow-color);
  border: 1px solid var(--modal-border-color);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  transform: scale(0.9);
  opacity: 0;
  animation: showModal 0.3s forwards;
}

@keyframes showModal {
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.3s,
    transform 0.2s;
}

.close-button:hover {
  color: var(--text-color);
  transform: scale(1.2);
  background-color: transparent;
}

.modal-content h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.modal-content p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.project-details {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.technologies,
.links {
  flex: 1;
  min-width: 200px;
}

.technologies h4,
.links h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.technologies ul {
  list-style: none;
  padding: 0;
}

.technologies li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.technologies li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.link-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.link-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.link-button:hover {
  background-color: var(--secondary-color);
}

.project-image {
  width: 100%;
  margin-top: 1rem;
  border-radius: 5px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 5px;
}

/* Animation pour les points de la sphère */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* Media queries pour la responsivité */
@media (max-width: 768px) {
  .sphere-container {
    height: 50vh;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .project-details {
    flex-direction: column;
    gap: 1rem;
  }
}

.title-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
}

.help-button {
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: -35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.help-button svg {
  width: 24px;
  height: 24px;
  fill: var(--text-color);
  color: var(--background-color);
}

.help-button:hover {
  transform: scale(1.1);
}

.help-tooltip {
  position: absolute;
  top: 40px;
  right: -200px;
  background-color: var(--secondary-color);
  border-radius: 10px;
  padding: 1.5rem;
  width: 300px;
  z-index: 100;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--primary-color);
}

.tooltip-content {
  position: relative;
  font-size: 0.9rem;
}

.close-tooltip {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--primary-color);
  border: 2px solid var(--primary-color);
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-tooltip:hover {
  background-color: var(--secondary-color);
}

.help-tooltip h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--primary-color);
}

.help-tooltip p {
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.help-tooltip ul {
  list-style: none;
  padding: 0;
}

.help-tooltip li {
  margin-bottom: 0.4rem;
  padding-left: 1rem;
  position: relative;
}

.help-tooltip li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

/* Styles pour le tooltip des projets */
:global(.project-tooltip) {
  position: fixed;
  background-color: var(--secondary-color);
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--primary-color);
  max-width: 200px;
  white-space: nowrap;
}
</style>
