import * as THREE from 'three';

export function initWarpCanvas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Starfield Geometry & Warp Lines
  const starCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const speeds = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 2] = Math.random() * 800;
    speeds[i] = 1 + Math.random() * 3;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Point material for Before mode
  const pointMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.2,
    transparent: true,
    opacity: 0.8
  });

  const starPoints = new THREE.Points(geometry, pointMat);
  scene.add(starPoints);

  // Line segments for After mode (hyperspace streaks)
  const lineCount = 350;
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(lineCount * 6); // 2 vertices per line
  const lineData = [];

  for (let i = 0; i < lineCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 350;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = (Math.random() - 0.5) * 800;
    const speed = 14 + Math.random() * 18;

    lineData.push({ x, y, z, speed, length: 45 + Math.random() * 65 });
  }

  // Pre-set attribute on geometry once to prevent GC churn
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xff5731,
    transparent: true,
    opacity: 0.85,
    linewidth: 2
  });

  const warpLines = new THREE.LineSegments(lineGeo, lineMat);
  warpLines.visible = true;
  scene.add(warpLines);

  let currentMode = 'after';
  let targetSpeedMultiplier = 1.0;
  let currentSpeedMultiplier = 1.0;
  let targetLineOpacity = 0.85;

  function setMode(mode) {
    currentMode = mode;
    if (mode === 'before') {
      targetSpeedMultiplier = 0.12;
      targetLineOpacity = 0.0;
    } else {
      targetSpeedMultiplier = 1.0;
      targetLineOpacity = 0.85;
    }
  }

  // Set initial mode
  setMode('after');

  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);

    // Smooth speed & opacity interpolation
    currentSpeedMultiplier += (targetSpeedMultiplier - currentSpeedMultiplier) * 0.08;
    lineMat.opacity += (targetLineOpacity - lineMat.opacity) * 0.08;
    warpLines.visible = lineMat.opacity > 0.02;

    const pos = geometry.attributes.position.array;

    if (currentMode === 'before') {
      // Gentle floating drift
      for (let i = 0; i < starCount; i++) {
        pos[i * 3 + 2] += 0.5 * (currentSpeedMultiplier / 0.12);
        if (pos[i * 3 + 2] > 400) {
          pos[i * 3 + 2] = -400;
        }
      }
      pointMat.color.setHex(0xffffff);
      pointMat.size = 2.0;
    } else {
      // Hyperspace warp mode with smooth speed
      for (let i = 0; i < starCount; i++) {
        pos[i * 3 + 2] += speeds[i] * 3.2 * currentSpeedMultiplier;
        if (pos[i * 3 + 2] > 400) {
          pos[i * 3 + 2] = -400;
          pos[i * 3] = (Math.random() - 0.5) * 1200;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
        }
      }
      pointMat.color.setHex(0xffaa88);
      pointMat.size = 2.6;
    }

    // Always update warp streak lines if visible
    if (warpLines.visible) {
      for (let i = 0; i < lineCount; i++) {
        const item = lineData[i];
        item.z += item.speed * currentSpeedMultiplier;
        if (item.z > 400) {
          item.z = -400;
        }

        const idx = i * 6;
        linePositions[idx] = item.x;
        linePositions[idx + 1] = item.y;
        linePositions[idx + 2] = item.z;

        linePositions[idx + 3] = item.x * 1.12;
        linePositions[idx + 4] = item.y * 1.12;
        linePositions[idx + 5] = item.z - item.length;
      }
      lineGeo.attributes.position.needsUpdate = true;
    }

    geometry.attributes.position.needsUpdate = true;
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

  return {
    setMode,
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    }
  };
}
