/**
 * FloatingSkills.js
 * Balanced, restrained scroll-driven floating glass cards scene.
 * Keeps cards strictly inside the viewport, eliminates card-on-card collisions,
 * preserves safe reading zone for the heading, and provides a clean 65-75% viewport fill.
 */

export function initFloatingSkills() {
  const section = document.getElementById('skills');
  if (!section) return;

  const cards = section.querySelectorAll('.floating-glass-card');
  if (!cards.length) return;

  // Desktop Trajectories:
  // 5 distinct non-overlapping zones framing the central heading across TOP, MIDDLE, and BOTTOM:
  // Card 1: Upper-Left (Backend & APIs - Core Focus)
  // Card 2: Lower-Left (Programming - Languages)
  // Card 3: Upper-Center/Right (Databases - Data Storage)
  // Card 4: Upper-Right (Frontend / App Dev - Client Apps)
  // Card 5: Lower-Right (Developer Tools - Platforms & Tools)
  const desktopTrajectories = [
    // Card 1: Backend & APIs (CORE FOCUS, [01], Upper-Left)
    {
      start: { x: -30, y: -18, z: 20, rotX: 1.5,  rotY: 2.5,  rotZ: -2,   scale: 1.0 },
      mid:   { x: -27, y: -15, z: 30, rotX: 0.5,  rotY: 1.0,  rotZ: -1,   scale: 1.02 },
      end:   { x: -31, y: -17, z: 15, rotX: -1.5, rotY: -1.5, rotZ: 1.5,  scale: 0.99 }
    },
    // Card 2: Programming (LANGUAGES, [02], Lower-Left)
    {
      start: { x: -25, y: 22,  z: -5,  rotX: -2,  rotY: 2,   rotZ: 2.5,  scale: 0.99 },
      mid:   { x: -22, y: 26,  z: 5,   rotX: 1,   rotY: -1,  rotZ: 1,    scale: 1.01 },
      end:   { x: -27, y: 24,  z: -10, rotX: 2,   rotY: 1,   rotZ: -2,   scale: 1.0 }
    },
    // Card 3: Databases (DATA STORAGE, [03], Upper-Center / Right)
    {
      start: { x: 4,   y: -25, z: 15,  rotX: 2,   rotY: -1.5, rotZ: -1.5, scale: 1.0 },
      mid:   { x: -2,  y: -22, z: 25,  rotX: 0.5, rotY: 1.0,  rotZ: 1.0,  scale: 1.02 },
      end:   { x: 5,   y: -24, z: 10,  rotX: -1.5, rotY: 1.5, rotZ: 2.0,  scale: 0.99 }
    },
    // Card 4: Frontend / App Dev (CLIENT APPLICATIONS, [04], Upper-Right)
    {
      start: { x: 31,  y: -17, z: -10, rotX: -1.5, rotY: -2,  rotZ: 2,    scale: 0.99 },
      mid:   { x: 27,  y: -14, z: -2,  rotX: 1.5,  rotY: -1,  rotZ: 0.5,  scale: 1.02 },
      end:   { x: 32,  y: -16, z: -15, rotX: -1,   rotY: 2,   rotZ: -2,   scale: 0.98 }
    },
    // Card 5: Developer Tools (PLATFORMS & TOOLS, [05], Lower-Right)
    {
      start: { x: 23,  y: 23,  z: 10,  rotX: 2,   rotY: -2,  rotZ: -2,   scale: 1.0 },
      mid:   { x: 26,  y: 27,  z: 20,  rotX: -1,  rotY: 1,   rotZ: 1,    scale: 1.02 },
      end:   { x: 20,  y: 25,  z: 5,   rotX: -2,  rotY: 2,   rotZ: 2,    scale: 0.99 }
    }
  ];

  // Mobile Trajectories: Adjusted for tall/narrow portrait screens
  const mobileTrajectories = [
    // Card 1: Backend & APIs (Upper)
    {
      start: { x: 0, y: -24, z: 10, rotX: 1,  rotY: 1,  rotZ: -1, scale: 0.95 },
      mid:   { x: 0, y: -20, z: 15, rotX: 0,  rotY: 0,  rotZ: 0,  scale: 0.97 },
      end:   { x: 0, y: -22, z: 10, rotX: -1, rotY: -1, rotZ: 1,  scale: 0.95 }
    },
    // Card 2: Programming
    {
      start: { x: 0, y: 15,  z: -5, rotX: -1, rotY: 1,  rotZ: 1,  scale: 0.94 },
      mid:   { x: 0, y: 18,  z: 0,  rotX: 0,  rotY: 0,  rotZ: 0,  scale: 0.96 },
      end:   { x: 0, y: 16,  z: -5, rotX: 1,  rotY: -1, rotZ: -1, scale: 0.94 }
    },
    // Card 3: Databases
    {
      start: { x: 0, y: -36, z: 5,  rotX: 1,  rotY: -1, rotZ: -1, scale: 0.93 },
      mid:   { x: 0, y: -32, z: 10, rotX: 0,  rotY: 0,  rotZ: 0,  scale: 0.95 },
      end:   { x: 0, y: -34, z: 5,  rotX: -1, rotY: 1,  rotZ: 1,  scale: 0.93 }
    },
    // Card 4: Frontend / App Dev
    {
      start: { x: 0, y: 28,  z: -10, rotX: -1, rotY: -1, rotZ: 1,  scale: 0.94 },
      mid:   { x: 0, y: 30,  z: -5,  rotX: 0,  rotY: 0,  rotZ: 0,  scale: 0.96 },
      end:   { x: 0, y: 29,  z: -10, rotX: 1,  rotY: 1,  rotZ: -1, scale: 0.94 }
    },
    // Card 5: Developer Tools
    {
      start: { x: 0, y: 40,  z: 5,  rotX: 1,  rotY: -1, rotZ: -1, scale: 0.93 },
      mid:   { x: 0, y: 42,  z: 10, rotX: 0,  rotY: 0,  rotZ: 0,  scale: 0.95 },
      end:   { x: 0, y: 41,  z: 5,  rotX: -1, rotY: 1,  rotZ: 1,  scale: 0.93 }
    }
  ];

  // Smoothstep interpolation
  function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  function interpolate(p0, pMid, p1, t) {
    if (t <= 0.5) {
      const u = smoothstep(0, 0.5, t);
      return p0 + (pMid - p0) * u;
    } else {
      const u = smoothstep(0.5, 1, t);
      return pMid + (p1 - pMid) * u;
    }
  }

  let currentProgress = -1;

  function update() {
    const rect = section.getBoundingClientRect();
    const totalScroll = section.offsetHeight - window.innerHeight;

    if (totalScroll <= 0) {
      requestAnimationFrame(update);
      return;
    }

    const currentScroll = -rect.top;
    const rawProgress = currentScroll / totalScroll;
    const progress = Math.max(0, Math.min(1, rawProgress));

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      cards.forEach((card) => {
        card.style.transform = "";
      });
      return;
    }

    // Only update when scroll changes
    if (Math.abs(progress - currentProgress) > 0.0001) {
      currentProgress = progress;
      const trajectories = desktopTrajectories;

      cards.forEach((card, idx) => {
        const traj = trajectories[idx];
        if (!traj) return;

        const x = interpolate(traj.start.x, traj.mid.x, traj.end.x, progress);
        const y = interpolate(traj.start.y, traj.mid.y, traj.end.y, progress);
        const z = interpolate(traj.start.z, traj.mid.z, traj.end.z, progress);
        const rotX = interpolate(traj.start.rotX, traj.mid.rotX, traj.end.rotX, progress);
        const rotY = interpolate(traj.start.rotY, traj.mid.rotY, traj.end.rotY, progress);
        const rotZ = interpolate(traj.start.rotZ, traj.mid.rotZ, traj.end.rotZ, progress);
        const scale = interpolate(traj.start.scale, traj.mid.scale, traj.end.scale, progress);

        card.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}vw), calc(-50% + ${y.toFixed(2)}vh), ${z.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    }

    requestAnimationFrame(update);
  }

  update();

  window.addEventListener('resize', () => {
    currentProgress = -1;
  });
}
