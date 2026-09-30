import './styles/variables.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/layout.css';

import { initHeroCanvas } from './components/HeroCanvas.js';
import { initMeshCanvas } from './components/MeshCanvas.js';
import { initWarpCanvas } from './components/WarpCanvas.js';
import { initSprintTabs } from './components/SprintTabs.js';
import { initModals } from './components/Modals.js';
import { initCustomCursor } from './components/Cursor.js';
import { initFloatingSkills } from './components/FloatingSkills.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Visuals
  initHeroCanvas('heroCanvas');
  initMeshCanvas('meshCanvas');
  const warpEngine = initWarpCanvas('warpCanvas');

  // Initialize Interactive Tabs, Modals & Floating Skills
  initSprintTabs();
  initModals();
  initCustomCursor();
  initFloatingSkills();

  // Mode Toggle: Manual Work vs Automation Pipeline
  const beforeBtn = document.getElementById('beforeModeBtn');
  const afterBtn = document.getElementById('afterModeBtn');
  const watermark = document.getElementById('warpWatermark');
  const beforeCards = document.getElementById('beforeCards');
  const afterCards = document.getElementById('afterCards');

  let isSwitching = false;

  function setWarpMode(mode) {
    if (isSwitching) return;
    const isBefore = mode === 'before';

    if (isBefore) {
      beforeBtn?.classList.add('active-before');
      afterBtn?.classList.remove('active-after');
    } else {
      afterBtn?.classList.add('active-after');
      beforeBtn?.classList.remove('active-before');
    }

    // Smooth watermark cross-fade
    if (watermark) {
      watermark.style.opacity = '0';
      watermark.style.transform = 'translate(-50%, -46%) scale(0.96)';

      setTimeout(() => {
        if (isBefore) {
          watermark.classList.remove('after-mode');
          watermark.classList.add('before-mode');
          watermark.innerHTML = 'MANUAL<br>// 48 HOURS';
        } else {
          watermark.classList.remove('before-mode');
          watermark.classList.add('after-mode');
          watermark.innerHTML = 'AUTOMATED<br>// 2 HOURS';
        }
        watermark.style.opacity = isBefore ? '0.12' : '0.18';
        watermark.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 160);
    }

    // Smooth cards cross-fade
    const currentContainer = isBefore ? afterCards : beforeCards;
    const targetContainer = isBefore ? beforeCards : afterCards;

    if (currentContainer && targetContainer) {
      isSwitching = true;
      currentContainer.classList.add('leaving');
      currentContainer.classList.remove('entering');

      setTimeout(() => {
        currentContainer.style.display = 'none';
        currentContainer.classList.remove('leaving');

        targetContainer.style.display = 'grid';
        targetContainer.classList.add('entering');
        setTimeout(() => {
          targetContainer.classList.remove('entering');
          isSwitching = false;
        }, 350);
      }, 180);
    }

    warpEngine?.setMode(mode);
  }

  beforeBtn?.addEventListener('click', () => setWarpMode('before'));
  afterBtn?.addEventListener('click', () => setWarpMode('after'));

  // Live Time Clocks in Footer: Mumbai (IST), San Francisco (PST), London (GMT)
  function updateClocks() {
    const formatTime = (timeZone) => {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(new Date());
    };

    const mumEl = document.getElementById('timeMUM');
    const sfEl = document.getElementById('timeSF');
    const lonEl = document.getElementById('timeLON');

    if (mumEl) mumEl.textContent = formatTime('Asia/Kolkata');
    if (sfEl) sfEl.textContent = formatTime('America/Los_Angeles');
    if (lonEl) lonEl.textContent = formatTime('Europe/London');
  }

  updateClocks();
  setInterval(updateClocks, 1000);

  // Scroll text lighting effect for About Section
  const aboutSection = document.querySelector('.about-section');
  const dimWords = document.querySelectorAll('.about-text-reveal .dim');

  window.addEventListener('scroll', () => {
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.5)));

    dimWords.forEach((word, idx) => {
      const threshold = (idx + 1) / (dimWords.length + 1);
      if (progress > threshold) {
        word.classList.add('active');
      } else {
        word.classList.remove('active');
      }
    });
  });
});
