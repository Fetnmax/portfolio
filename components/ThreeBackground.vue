<template>
  <div id="three-background"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted } from "vue";

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
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-background").appendChild(renderer.domElement);

  // Création des particules
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 5000;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  // Matériel des particules
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: "#FFFFFF",
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
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
</script>

<style scoped>
#three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(45deg, #0f2027, #203a43, #2c5364);
}
</style>
