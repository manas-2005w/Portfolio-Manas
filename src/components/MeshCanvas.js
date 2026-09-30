import * as THREE from 'three';

export function initMeshCanvas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Topographic plane
  const width = 12;
  const height = 9;
  const segmentsX = 80;
  const segmentsY = 60;
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  geometry.rotateX(-Math.PI / 2.3);

  // Wireframe material with subtle glowing lines
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x444444,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });

  const mesh = new THREE.Mesh(geometry, wireMat);
  mesh.position.y = -0.5;
  scene.add(mesh);

  // Particle nodes at vertices
  const pointsMat = new THREE.PointsMaterial({
    color: 0xff5731,
    size: 0.03,
    transparent: true,
    opacity: 0.7
  });
  const points = new THREE.Points(geometry, pointsMat);
  points.position.y = -0.5;
  scene.add(points);

  const posAttr = geometry.attributes.position;
  const origPositions = posAttr.array.slice();

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }
  });

  let clock = new THREE.Clock();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    for (let i = 0; i < posAttr.count; i++) {
      const u = origPositions[i * 3];
      const v = origPositions[i * 3 + 1];
      const origZ = origPositions[i * 3 + 2];

      // Wave calculation
      const wave1 = Math.sin(u * 0.8 + time * 1.5) * 0.4;
      const wave2 = Math.cos(v * 0.7 + time * 1.2) * 0.3;
      const wave3 = Math.sin((u + v) * 0.5 + time * 2) * 0.2;
      const mouseDist = Math.hypot(u - mouseX * 4, v - mouseY * 4);
      const mouseWave = Math.sin(mouseDist * 2 - time * 3) * Math.max(0, 1 - mouseDist / 3) * 0.4;

      posAttr.setZ(i, origZ + wave1 + wave2 + wave3 + mouseWave);
    }
    posAttr.needsUpdate = true;

    mesh.rotation.z = Math.sin(time * 0.2) * 0.05;
    points.rotation.z = mesh.rotation.z;

    renderer.render(scene, camera);
  }
  animate();

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
