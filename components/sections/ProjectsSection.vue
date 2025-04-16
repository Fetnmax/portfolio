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

      <!-- Filtres de technologies -->
      <div class="filters-container">
        <button
          class="filter-button"
          :class="{ active: !activeFilters.length }"
          @click="clearFilters"
        >
          Tous
        </button>
        <button
          v-for="tech in usedTechnologies"
          :key="tech.id"
          class="filter-button"
          :class="{ active: activeFilters.includes(tech.id) }"
          @click="toggleFilter(tech.id)"
        >
          <span class="tech-icon" v-if="tech.icon">
            <Icon :name="tech.icon" size="18px" />
          </span>
          {{ tech.name }}
        </button>
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
                v-for="(techId, index) in selectedProject.technologies"
                :key="index"
              >
                {{ getTechnologyName(techId) }}
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

    <!-- Prévisualisation au survol -->
    <div
      class="project-preview"
      v-if="hoveredProject && !selectedProject"
      :style="previewStyle"
    >
      <h4>{{ hoveredProject.title }}</h4>
      <div class="preview-tech">
        <span
          v-for="techId in hoveredProject.technologies.slice(0, 3)"
          :key="techId"
          >{{ getTechnologyName(techId) }}</span
        >
        <span class="more-tech" v-if="hoveredProject.technologies.length > 3">
          +{{ hoveredProject.technologies.length - 3 }}
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted, ref, onBeforeUnmount, computed } from "vue";
import projectsData from "../../data/projects.json";
import skillsData from "../../data/skills.json";

export default {
  name: "ProjectsSection",
  setup() {
    const container = ref(null);
    const selectedProject = ref(null);
    const showHelp = ref(false);
    const hoveredProject = ref(null);
    const hoverPosition = ref({ x: 0, y: 0 });
    const activeFilters = ref([]);

    // Référence pour stocker les objets Three.js
    let scene, camera, renderer, controls;
    let sphere, raycaster, mouse;
    let projectPoints = [];

    // Utilisation des projets depuis le fichier JSON
    const projects = projectsData;

    // Fonction pour obtenir le nom d'une technologie à partir de son ID
    const getTechnologyName = (techId) => {
      // Parcourir toutes les catégories de compétences
      for (const category of skillsData.skillCategories) {
        // Chercher la compétence avec l'ID correspondant
        const skill = category.skills.find((skill) => skill.id === techId);
        if (skill) {
          return skill.name;
        }
      }
      // Si l'ID n'est pas trouvé, retourner l'ID lui-même
      return techId;
    };

    // Fonction pour obtenir les technologies utilisées dans les projets
    const getUsedTechnologies = () => {
      const techIds = new Set();

      // Collecter tous les IDs de technologies utilisées dans les projets
      projects.forEach((project) => {
        if (project.technologies) {
          project.technologies.forEach((techId) => {
            techIds.add(techId);
          });
        }
      });

      // Créer un tableau d'objets de technologies avec leurs détails
      const technologies = [];
      techIds.forEach((id) => {
        // Rechercher les détails de la technologie
        let found = false;
        for (const category of skillsData.skillCategories) {
          const skill = category.skills.find((skill) => skill.id === id);
          if (skill) {
            technologies.push({
              id: skill.id,
              name: skill.name,
              icon: skill.icon,
            });
            found = true;
            break;
          }
        }

        // Si la technologie n'est pas trouvée dans skills.json, ajouter avec l'ID uniquement
        if (!found) {
          technologies.push({
            id: id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            icon: null,
          });
        }
      });

      // Trier les technologies par nom
      return technologies.sort((a, b) => a.name.localeCompare(b.name));
    };

    // Récupérer les technologies utilisées
    const usedTechnologies = getUsedTechnologies();

    // Filtrer les projets en fonction des filtres actifs
    const filteredProjects = computed(() => {
      if (!activeFilters.value.length) {
        return projects;
      }

      return projects.filter((project) => {
        // Un projet est inclus s'il utilise AU MOINS UNE des technologies filtrées
        return project.technologies.some((techId) =>
          activeFilters.value.includes(techId)
        );
      });
    });

    // Activer/désactiver un filtre
    const toggleFilter = (techId) => {
      const index = activeFilters.value.indexOf(techId);
      if (index === -1) {
        activeFilters.value.push(techId);
      } else {
        activeFilters.value.splice(index, 1);
      }
      updateVisibleProjects();
    };

    // Effacer tous les filtres
    const clearFilters = () => {
      activeFilters.value = [];
      updateVisibleProjects();
    };

    // Mettre à jour la visibilité des projets dans la sphère
    const updateVisibleProjects = () => {
      const filtered = filteredProjects.value;

      // Parcourir tous les points et mettre à jour leur visibilité
      projectPoints.forEach((point) => {
        const project = point.userData.project;
        const isVisible = filtered.some((p) => p.id === project.id);

        // Mettre à jour la visibilité du point et de son halo
        point.visible = isVisible;

        // Trouver le halo correspondant et le mettre à jour
        const halo = scene.children.find(
          (child) =>
            child.type === "Mesh" &&
            child.position.x === point.position.x &&
            child.position.y === point.position.y &&
            child.position.z === point.position.z &&
            child !== point
        );

        if (halo) {
          halo.visible = isVisible;
        }
      });
    };

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
      // Récupération de la couleur des lignes depuis le CSS
      const lineColor = new THREE.Color(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary-color")
          .trim() || "#3182ce"
      );

      // Création du matériau de base pour la sphère
      const material = new THREE.MeshBasicMaterial({
        color: 0x1a1a3a,
        transparent: true,
        opacity: 0.1,
        wireframe: false,
      });

      // 1. Sphère principale (presque invisible)
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // 2. Deux sphères wireframe pour garantir la visibilité de toutes les lignes
      // Première sphère wireframe légèrement plus grande
      const wireframeGeometry1 = new THREE.SphereGeometry(1.001, 32, 32);
      const wireframeMaterial1 = new THREE.MeshBasicMaterial({
        color: lineColor,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        depthTest: false, // Désactive le test de profondeur pour cette sphère
      });
      const wireframeSphere1 = new THREE.Mesh(
        wireframeGeometry1,
        wireframeMaterial1
      );
      scene.add(wireframeSphere1);

      // Deuxième sphère wireframe légèrement plus petite avec mode depthTest activé
      const wireframeGeometry2 = new THREE.SphereGeometry(0.999, 32, 32);
      const wireframeMaterial2 = new THREE.MeshBasicMaterial({
        color: lineColor,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const wireframeSphere2 = new THREE.Mesh(
        wireframeGeometry2,
        wireframeMaterial2
      );
      scene.add(wireframeSphere2);

      // 3. Lignes principales (méridiens et parallèles) avec des LineSegments pour une meilleure visibilité
      // Ces lignes sont créées explicitement pour garantir qu'elles soient toujours visibles

      // Méridiens (longitudes)
      const longitudeCount = 12;
      for (let i = 0; i < longitudeCount; i++) {
        const theta = (2 * Math.PI * i) / longitudeCount;

        // Création de la géométrie pour cette ligne de longitude
        const longitudeGeometry = new THREE.BufferGeometry();
        const points = [];

        // Générer les points avec une densité élevée pour des courbes lisses
        const segmentCount = 100;
        for (let j = 0; j <= segmentCount; j++) {
          const phi = (Math.PI * j) / segmentCount;
          const x = Math.sin(phi) * Math.cos(theta);
          const y = Math.cos(phi);
          const z = Math.sin(phi) * Math.sin(theta);
          points.push(new THREE.Vector3(x, y, z));
        }

        longitudeGeometry.setFromPoints(points);

        // Création de la ligne avec LineSegments pour un rendu plus fin
        const lineMaterial = new THREE.LineBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0.4,
          depthTest: false, // Désactive le test de profondeur pour toujours voir la ligne
          linewidth: 1.5, // Notez que cette propriété n'est pas supportée par certains renderers WebGL
        });

        const line = new THREE.Line(longitudeGeometry, lineMaterial);
        scene.add(line);
      }

      // Parallèles (latitudes)
      const latitudeCount = 10;
      for (let i = 0; i <= latitudeCount; i++) {
        const phi = (Math.PI * i) / latitudeCount;
        const y = Math.cos(phi);
        const radius = Math.sin(phi);

        if (radius < 0.01) continue; // Éviter les cercles trop petits aux pôles

        // Création de la géométrie pour cette ligne de latitude
        const latitudeGeometry = new THREE.BufferGeometry();
        const points = [];

        // Générer les points avec une haute densité pour des cercles lisses
        const segmentCount = 100;
        for (let j = 0; j <= segmentCount; j++) {
          const theta = (j / segmentCount) * Math.PI * 2;
          const x = radius * Math.cos(theta);
          const z = radius * Math.sin(theta);
          points.push(new THREE.Vector3(x, y, z));
        }

        latitudeGeometry.setFromPoints(points);

        // Création de la ligne avec LineSegments pour un rendu plus fin
        const lineMaterial = new THREE.LineBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0.4,
          depthTest: false, // Désactive le test de profondeur pour toujours voir la ligne
          linewidth: 1.5,
        });

        const line = new THREE.Line(latitudeGeometry, lineMaterial);
        scene.add(line);
      }

      // 4. Points aux intersections principales pour renforcer la structure visuelle
      // Points à l'équateur
      const equatorPoints = [];
      for (let i = 0; i < 12; i++) {
        const theta = (Math.PI * 2 * i) / 12;
        const x = Math.cos(theta);
        const z = Math.sin(theta);
        equatorPoints.push(new THREE.Vector3(x, 0, z));
      }

      // Points aux pôles et sur certaines intersections clés
      const keyPoints = [
        new THREE.Vector3(0, 1, 0), // Pôle nord
        new THREE.Vector3(0, -1, 0), // Pôle sud
      ];

      // Tous les points d'intersection importants
      const allPoints = [...equatorPoints, ...keyPoints];

      // Création des points visibles aux intersections
      allPoints.forEach((point) => {
        const dotGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({
          color: lineColor,
          transparent: false,
          opacity: 0.9,
          depthTest: false, // Important pour voir les points même à l'arrière
        });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.copy(point);
        scene.add(dot);
      });
    };

    // Ajout des points pour les projets
    const addProjectPoints = () => {
      // Palette de couleurs variées pour les points
      const colorPalette = [
        0xff3333, // Rouge (couleur originale)
        0xff9900, // Orange
        0x66ff66, // Vert clair
        0xffcc33, // Jaune orangé
        0xcc66ff, // Violet
        0xff66cc, // Rose
        0x33ffcc, // Turquoise
        0xff9966, // Pêche
        0xff5500, // Orange brûlé
        0xffff66, // Jaune citron
      ];

      projects.forEach((project, index) => {
        // Normalisation de la position pour être sur la sphère
        const position = new THREE.Vector3(
          project.position.x,
          project.position.y,
          project.position.z
        ).normalize();

        // Sélection d'une couleur de la palette (en boucle si plus de projets que de couleurs)
        const pointColor = colorPalette[index % colorPalette.length];

        // Création du point (légèrement plus grand: 0.028)
        const geometry = new THREE.SphereGeometry(0.028, 16, 16);
        // Matériau plus opaque (1.0 au lieu de la valeur par défaut)
        const material = new THREE.MeshBasicMaterial({
          color: pointColor,
          transparent: false,
          opacity: 1.0,
        });
        const point = new THREE.Mesh(geometry, material);

        point.position.copy(position);
        point.userData = { project };

        scene.add(point);
        projectPoints.push(point);

        // Ajout d'un halo autour du point (avec couleur assortie)
        const haloGeometry = new THREE.SphereGeometry(0.035, 16, 16);

        // Créer une version plus claire de la même couleur pour le halo
        const haloColor = new THREE.Color(pointColor);
        haloColor.offsetHSL(0, -0.2, 0.2); // Légèrement désaturé et plus lumineux

        const haloMaterial = new THREE.MeshBasicMaterial({
          color: haloColor,
          transparent: true,
          opacity: 0.65, // Halo également plus opaque (0.65 au lieu de 0.5)
        });

        const halo = new THREE.Mesh(haloGeometry, haloMaterial);

        halo.position.copy(position);
        scene.add(halo);
      });

      // Appliquer les filtres initiaux (tous les projets visibles par défaut)
      updateVisibleProjects();
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

    // Fonction pour afficher le tooltip du projet
    const showProjectTooltip = (event, title) => {
      // Mettre à jour la position du survol pour le project-preview
      hoverPosition.value = {
        x: event.clientX,
        y: event.clientY,
      };

      // Nous n'avons plus besoin de créer/mettre à jour un tooltip séparé
      // car nous utilisons project-preview à la place

      // Supprimer l'ancien tooltip s'il existe encore
      const oldTooltip = document.querySelector(".project-tooltip");
      if (oldTooltip) {
        oldTooltip.parentNode.removeChild(oldTooltip);
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

      // Réinitialiser le projet survolé par défaut
      hoveredProject.value = null;

      // Agrandir le point survolé et changer le curseur
      if (intersects.length > 0) {
        intersects[0].object.scale.set(1.5, 1.5, 1.5);
        renderer.domElement.style.cursor = "pointer";

        // Récupérer les informations du projet
        const project = intersects[0].object.userData.project;
        document.title = project.title;

        // Mettre à jour le projet survolé (active l'affichage de project-preview)
        hoveredProject.value = project;

        // Mettre à jour la position
        showProjectTooltip(event, project.title);

        // Marquer ce point comme ayant été survolé récemment
        intersects[0].object.userData.wasHovered = true;

        // Réinitialiser après un délai
        setTimeout(() => {
          if (intersects[0].object) {
            intersects[0].object.userData.wasHovered = false;
          }
        }, 5000);
      } else {
        renderer.domElement.style.cursor = "default";
        document.title = "Portfolio";
      }
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

    const previewStyle = computed(() => {
      return {
        left: `${hoverPosition.value.x + 15}px`,
        top: `${hoverPosition.value.y + 15}px`,
      };
    });

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
      hoveredProject,
      previewStyle,
      getTechnologyName,
      usedTechnologies,
      activeFilters,
      toggleFilter,
      clearFilters,
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
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  display: inline-block;
}

/* Styles pour les filtres */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  max-width: 900px;
}

.filter-button {
  background-color: var(--bg-card);
  /* border: 1px solid var(--modal-border-color); */
  color: var(--text-color);
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 100px;
  text-align: center;
  height: 38px;
  white-space: nowrap;
  line-height: 1;
}

.filter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: var(--bg-light);
}

.filter-button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--text-color);
  font-weight: 500;
}

.tech-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-right: 2px;
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

.project-preview {
  position: fixed;
  z-index: 100;
  background-color: var(--modal-background);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-left: 3px solid var(--primary-color);
  max-width: 250px;
  pointer-events: none;
  transform: translateY(5px);
  animation: fadeIn 0.2s forwards;
}

.project-preview h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.preview-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.preview-tech span {
  font-size: 0.8rem;
  padding: 0.1rem 0.5rem;
  background-color: var(--bg-light);
  border-radius: 3px;
}

.preview-tech .more-tech {
  font-size: 0.7rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media queries pour la responsivité des filtres */
@media (max-width: 768px) {
  .filters-container {
    gap: 0.5rem;
  }

  .filter-button {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
}
</style>
