import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight("#ffffff", 2.6);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.329, -0.141, -0.9);
directionalLight.rotation.set(1, 1, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff9000, 1.5);
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();
const moonTexture = textureLoader.load("/textures/moon2.jpeg");

/**
 * Floor
 */

// Moon
const sphereGeometry = new THREE.SphereGeometry(3.5, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial();
// sphereMaterial.color = new THREE.Color("green");
sphereMaterial.map = moonTexture;
// sphereMaterial.wireframe = true;
const moon = new THREE.Mesh(sphereGeometry, sphereMaterial);
moon.castShadow = true;
moon.position.set(0.8, 0.1, 1);

scene.add(moon);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2.87, 0.99, 8.771);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2));
// Render Color
// renderer.setClearColor("#e0d8d7");
// Render toneMapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
// Render shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  moon.rotation.y = elapsedTime * 0.2;
  directionalLight.position.z = Math.cos(elapsedTime * 0.4);

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
