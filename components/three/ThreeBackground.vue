<template>
  <div id="three-background"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  // Configuration de base
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  // Get the container dimensions instead of window
  const container = document.getElementById("three-background");
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Création des particules
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  const getParticleColor = () => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--particle-color")
      .trim();
    return color;
  };

  // Matériel des particules
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: getParticleColor(),
  });

  // Création du système de particules
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  camera.position.z = 2;

  // Animation
  const animate = () => {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;
    renderer.render(scene, camera);
  };

  animate();

  // Gestion du redimensionnement
  const handleResize = () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };

  window.addEventListener("resize", handleResize);

  // Observer les changements de thème
  const observer = new MutationObserver(() => {
    particlesMaterial.color.set(getParticleColor());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Nettoyage lors du démontage
  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener("resize", handleResize);
    // Clean up Three.js resources
    renderer.dispose();
    particlesGeometry.dispose();
    particlesMaterial.dispose();
  });
});
</script>

<style scoped>
#three-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
