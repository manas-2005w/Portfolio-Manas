export function initModals() {
  const hireModal = document.getElementById('hireModal');
  const resumeModal = document.getElementById('resumeModal');

  // Trigger buttons
  const hireTriggers = document.querySelectorAll('[data-open-modal="hire"]');
  const resumeTriggers = document.querySelectorAll('[data-open-modal="resume"]');
  const closeButtons = document.querySelectorAll('.modal-close-btn, [data-close-modal]');

  // Open Hire Modal
  hireTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      hireModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Open Resume / Profile Modal
  resumeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modals
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      hireModal?.classList.remove('open');
      resumeModal?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click
  [hireModal, resumeModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Role pill selector
  const rolePills = document.querySelectorAll('.budget-pill-btn');
  rolePills.forEach(pill => {
    pill.addEventListener('click', () => {
      rolePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });

  // Hire Form Submit
  const hireForm = document.getElementById('hireForm');
  hireForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = hireForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'TRANSMITTING MESSAGE...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '✓ MESSAGE SENT. I WILL REPLY SHORTLY.';
        submitBtn.style.background = '#22c55e';
        submitBtn.style.borderColor = '#22c55e';

        setTimeout(() => {
          hireModal?.classList.remove('open');
          document.body.style.overflow = '';
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          hireForm.reset();
        }, 2200);
      }, 900);
    }
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hireModal?.classList.remove('open');
      resumeModal?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
