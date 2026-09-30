import * as THREE from 'three';

export function initHeroCanvas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;



  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7;
  camera.position.y = 0.5;


  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // Group for the 3D honey sculpture
  const group = new THREE.Group();
  scene.add(group);

  // Shiny obsidian/black honey material with high specular reflection
  const honeyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transmission: 0.35,
    ior: 1.52,
    reflectivity: 0.9,
    sheen: 0.5,
    sheenColor: 0x222222
  });

  // Central organic honey bulb / column
  const stemGeom = new THREE.CylinderGeometry(0.35, 0.65, 4.5, 64, 64);
  const stemPos = stemGeom.attributes.position;
  for (let i = 0; i < stemPos.count; i++) {
    const y = stemPos.getY(i);
    const radiusMod = 1 + 0.4 * Math.sin(y * 1.5) + 0.2 * Math.cos(y * 3.0);
    stemPos.setX(i, stemPos.getX(i) * radiusMod);
    stemPos.setZ(i, stemPos.getZ(i) * radiusMod);
  }
  stemGeom.computeVertexNormals();
  const stemMesh = new THREE.Mesh(stemGeom, honeyMaterial);
  stemMesh.position.y = 0.6;
  group.add(stemMesh);

  // Organic droplet bulb
  const bulbGeom = new THREE.SphereGeometry(1.25, 64, 64);
  const bulbPos = bulbGeom.attributes.position;
  for (let i = 0; i < bulbPos.count; i++) {
    const x = bulbPos.getX(i);
    const y = bulbPos.getY(i);
    const z = bulbPos.getZ(i);
    const noise = Math.sin(x * 3) * Math.cos(y * 3) * Math.sin(z * 3) * 0.12;
    bulbPos.setX(i, x + x * noise);
    bulbPos.setY(i, y * 1.15 + y * noise);
    bulbPos.setZ(i, z + z * noise);
  }
  bulbGeom.computeVertexNormals();
  const bulbMesh = new THREE.Mesh(bulbGeom, honeyMaterial);
  bulbMesh.position.set(-0.2, 0.2, 0.1);
  group.add(bulbMesh);

  // Honeycomb lattice structure
  const latticeGroup = new THREE.Group();
  const hexMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    roughness: 0.15,
    metalness: 0.6,
    clearcoat: 0.9
  });

  const cellGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 6);
  for (let u = -3; u <= 3; u++) {
    for (let v = -3; v <= 3; v++) {
      if (u * u + v * v < 10) {
        const cell = new THREE.Mesh(cellGeom, hexMat);
        const x = (u + (v % 2) * 0.5) * 0.34;
        const y = v * 0.3;
        const z = Math.sqrt(Math.max(0, 1.4 - (x * x + y * y))) * 0.7;
        cell.position.set(x, y, z);
        cell.rotation.x = Math.PI / 2;
        latticeGroup.add(cell);
      }
    }
  }
  latticeGroup.position.set(0.6, 0.1, 0.2);
  latticeGroup.scale.set(0.85, 0.85, 0.85);
  group.add(latticeGroup);
  // Studio lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x7090ff, 2.0);
  fillLight.position.set(-6, -2, -4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xffffff, 5, 20);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  const accentLight = new THREE.PointLight(0xff5731, 2, 10);
  accentLight.position.set(2, -2, 3);
  scene.add(accentLight);

  // Mouse interaction & rotation
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouseX * 0.45;
    targetRotationX = -mouseY * 0.25;
  });

  // Animation Loop
  let clock = new THREE.Clock();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle organic floating
    group.rotation.y += (targetRotationY - group.rotation.y) * 0.05 + 0.003;
    group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;
    group.position.y = 0.15 + Math.sin(elapsedTime * 1.5) * 0.08;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  function handleResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
  };
}
