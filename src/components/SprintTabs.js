export const SPRINT_PHASES = [
  {
    id: 'phase-01',
    tabLabel: '01. ShieldAI (Fraud Protection)',
    dotClass: 'dot-orange',
    number: '01',
    title: 'ShieldAI',
    tagline: 'AI-powered fraud protection for detecting suspicious UPI IDs, QR codes, phone numbers, and links.',
    arch: 'Detection → Risk Scoring → Decision',
    desc: 'Built an AI-powered fraud protection application for Android using a multi-stage detection engine that combines behavioral analysis, rule-based detection, machine learning, risk scoring, and final decision logic.\n\nEngineered the FastAPI backend with Supabase for authentication, PostgreSQL data storage, real-time SMS-based scam detection, and WebSocket-driven live fraud alerts.',
    tech: 'React Native (Expo) · FastAPI · PostgreSQL · Supabase · Python',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'phase-02',
    tabLabel: '02. YouTube AI Narrator',
    dotClass: 'dot-yellow',
    number: '02',
    title: 'YouTube AI Narrator',
    tagline: 'An AI-powered tool that turns educational YouTube videos into enriched learning experiences.',
    arch: 'Download → Transcribe → Segment → Explain → Synthesize → Combine',
    desc: 'Built a tool that downloads educational YouTube videos, transcribes their content, segments them into logical concepts, and inserts AI-generated spoken explanations between segments.\n\nDesigned the system as a modular pipeline—download → transcribe → segment → explain → synthesize → combine—with configurable Whisper model sizes and CLI options for output control.',
    tech: 'Python · OpenAI Whisper',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'phase-03',
    tabLabel: '03. LetsUpgrade Experience',
    dotClass: 'dot-green',
    number: '03',
    title: 'LetsUpgrade — Software Developer Intern · Automation Engineer',
    tagline: 'June 2025 — July 2026 · Internal automation, content pipelines & LMS deployment.',
    arch: '48 Hours → 2 Hours (95% Turnaround Reduction)',
    desc: 'Worked on internal automation, content-generation workflows, and LMS development, focusing on reducing manual effort and improving operational efficiency.\n\nDeveloped Python scripts and scheduled jobs that reduced internal content turnaround time from 48 hours to 2 hours (95% reduction). Collaborated on the design and deployment of an LMS across multiple companies, and built an n8n AI content workflow.',
    tech: 'Python · n8n · REST APIs · Scheduled Jobs · LMS Deployment',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'phase-04',
    tabLabel: '04. Education & Credentials',
    dotClass: 'dot-cyan',
    number: '04',
    title: 'Education, Certifications & Achievements',
    tagline: 'Academic foundations, cloud certification, and competitive problem solving.',
    arch: 'Technical Foundations → Applied Impact',
    desc: 'ITM Skills University: Bachelor of Technology in Computer Science (Aug. 2023 — May 2027).\nThakur College of Science and Commerce: Higher Secondary Education (Aug. 2021 — Mar. 2023).\n\nCertification: AWS Cloud Practitioner Essentials.\nAchievements: 1× Business Pitch Competition Winner, 1× Hackathon Winner, 2× Hackathon Finalist.',
    tech: 'B.Tech CS · AWS Cloud Practitioner · Competition Winner',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop'
  }
];

export function initSprintTabs() {
  const tabs = document.querySelectorAll('.sprint-phase-tab');
  const titleEl = document.getElementById('sprintTitle');
  const taglineEl = document.getElementById('sprintTagline');
  const archEl = document.getElementById('sprintArch');
  const descEl = document.getElementById('sprintDesc');
  const imgEl = document.getElementById('sprintImg');
  const techEl = document.getElementById('sprintTech');

  if (!tabs.length || !titleEl || !descEl || !imgEl) return;

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const phase = SPRINT_PHASES[index];
      if (phase) {
        titleEl.style.opacity = '0';
        if (taglineEl) taglineEl.style.opacity = '0';
        if (archEl) archEl.style.opacity = '0';
        descEl.style.opacity = '0';
        imgEl.style.opacity = '0';
        if (techEl) techEl.style.opacity = '0';

        setTimeout(() => {
          titleEl.textContent = phase.title;
          if (taglineEl) taglineEl.textContent = phase.tagline;
          if (archEl) archEl.textContent = phase.arch;
          descEl.textContent = phase.desc;
          imgEl.src = phase.image;
          imgEl.alt = phase.title;
          if (techEl) techEl.textContent = phase.tech;

          titleEl.style.opacity = '1';
          if (taglineEl) taglineEl.style.opacity = '1';
          if (archEl) archEl.style.opacity = '1';
          descEl.style.opacity = '1';
          imgEl.style.opacity = '1';
          if (techEl) techEl.style.opacity = '1';
        }, 180);
      }
    });
  });
}
