'use strict';

// ============================================================
// APP STATE
// ============================================================
let questionsData = null;

const STATE = {
  progress: {
    points: 0,
    levelResults: {},   // { topicId: { best: 0-15, stars: 0-3, attempts: 0 } }
    examResults: {},    // { examId: { best: 0-100, stars: 0-3, attempts: 0 } }
    failedQuestions: [],// [ questionId ] — preguntes fallades pendents de repàs
  },
  quiz: {
    mode: null,         // 'level' | 'exam' | 'final' | 'review'
    topicId: null,
    examId: null,
    questions: [],
    currentIdx: 0,
    answers: [],        // { questionId, chosen, correct }
    points: 0,
    timerInterval: null,
    timeLeft: 0,
    answered: false,
  }
};

// ============================================================
// TOPICS & EXAMS CONFIG
// ============================================================
const TOPICS = [
  { id:1,  icon:'⚖️',  shortName:'Constitució i Estatut',          name:'T1 – Legislació: Constitució espanyola i Estatut d\'Autonomia' },
  { id:2,  icon:'👨‍💼', shortName:'Personal Administracions',         name:'T2 – Legislació: Personal al servei de les administracions' },
  { id:3,  icon:'🦺',  shortName:'Prevenció Riscos Laborals',        name:'T3 – Legislació: Llei 31/1995 de prevenció de riscos laborals' },
  { id:4,  icon:'🚒',  shortName:'Lleis SPEIS i Protecció Civil',    name:'T4 – Legislació: Llei 5/1994 dels SPEIS i Llei 4/1997 PC' },
  { id:5,  icon:'⚡',  shortName:'Física',                           name:'T5 – Física' },
  { id:6,  icon:'🔥',  shortName:'Física del Foc',                   name:'T6 – Física del foc' },
  { id:7,  icon:'🧯',  shortName:'Agents Extintors',                 name:'T7 – Agents extintors' },
  { id:8,  icon:'⚙️',  shortName:'Mecànica',                         name:'T8 – Mecànica' },
  { id:9,  icon:'🧪',  shortName:'Química',                          name:'T9 – Química' },
  { id:10, icon:'☣️',  shortName:'Risc Químic',                      name:'T10 – Risc químic (MATPEL)' },
  { id:11, icon:'💧',  shortName:'Hidràulica',                       name:'T11 – Hidràulica' },
  { id:12, icon:'🚛',  shortName:'Mecànica de Vehicles',             name:'T12 – Mecànica de vehicles' },
  { id:13, icon:'🏗️',  shortName:'Prevenció Incendis',               name:'T13 – Prevenció i protecció contra incendis' },
  { id:14, icon:'🏥',  shortName:'Atenció Sanitària',                name:'T14 – Atenció sanitària (primers auxilis)' },
  { id:15, icon:'🧱',  shortName:'Construcció: Materials',           name:'T15 – Construcció: materials' },
  { id:16, icon:'🏛️',  shortName:'Construcció: Estructures',         name:'T16 – Construcció: estructures' },
  { id:17, icon:'🔌',  shortName:'Electricitat',                     name:'T17 – Electricitat' },
  { id:18, icon:'🗺️',  shortName:'Cartografia',                      name:'T18 – Cartografia' },
  { id:19, icon:'⛰️',  shortName:'Geografia Física',                 name:'T19 – Geografia física' },
  { id:20, icon:'🏙️',  shortName:'Territori Català',                 name:'T20 – Coneixement del territori català' },
  { id:21, icon:'🌤️',  shortName:'Meteorologia',                     name:'T21 – Meteorologia' },
];

const EXAMS = [
  { id:'exam1', badge:'⚖️', title:'Examen Legislació',         desc:'Temes 1-4: Constitució, Personal, PRL, SPEIS', topicIds:[1,2,3,4], questions:20, time:30 },
  { id:'exam2', badge:'🔬', title:'Examen Ciències Bàsiques',  desc:'Temes 5-10: Física, Foc, Extintors, Mecànica, Química, MATPEL', topicIds:[5,6,7,8,9,10], questions:25, time:35 },
  { id:'exam3', badge:'🚒', title:'Examen Operatiu',           desc:'Temes 11-14: Hidràulica, Vehicles, Prevenció, Sanitari', topicIds:[11,12,13,14], questions:20, time:30 },
  { id:'exam4', badge:'🏗️', title:'Examen Tècnic i Territori',desc:'Temes 15-21: Construcció, Electricitat, Cartografia, Geo, Met.', topicIds:[15,16,17,18,19,20,21], questions:25, time:35 },
  { id:'final', badge:'🏅', title:'EXAMEN FINAL OFICIAL',      desc:'Els 21 temes · 50 preguntes · Simulació real de l\'oposició', topicIds:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], questions:50, time:60, isFinal:true },
];

// ============================================================
// CONFETTI ENGINE
// ============================================================
const Confetti = (() => {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  const colors = ['#ff6b00','#ffba00','#ff3a00','#27c96a','#e94560','#fff','#3498db'];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function burst(x, y, count = 60) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        r: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        life: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    if (!animId) animate();
  }

  function rain() {
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 3,
        vy: 3 + Math.random() * 5,
        r: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        life: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    if (!animId) animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.rot += p.rotSpeed; p.life -= 0.012;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      if (p.shape === 'rect') ctx.fillRect(-p.r/2, -p.r/4, p.r, p.r/2);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r/2, 0, Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
    if (particles.length > 0) animId = requestAnimationFrame(animate);
    else animId = null;
  }

  return { burst, rain };
})();

// ============================================================
// FIREWORKS ENGINE
// ============================================================
function launchFireworks(container) {
  container.innerHTML = '';
  const colors = ['#ff6b00','#ffba00','#ff3a00','#27c96a','#e94560','#3498db','#fff'];
  function spawnBurst() {
    const cx = 20 + Math.random() * 60;
    const cy = 10 + Math.random() * 60;
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'firework';
      const angle = (i / 14) * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      el.style.cssText = `left:${cx}%;top:${cy}%;background:${colors[Math.floor(Math.random()*colors.length)]};--tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;animation-duration:${0.8+Math.random()*0.6}s`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }
  spawnBurst();
  const ids = [100,300,500,800,1100,1400,1700,2000].map(d => setTimeout(spawnBurst, d));
  return () => ids.forEach(clearTimeout);
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout;
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2500);
}

// ============================================================
// SCREEN MANAGEMENT
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.style.display = ''; });
  const el = document.getElementById(id);
  el.classList.add('active');
  el.style.display = 'flex';
}

function closeOverlays() {
  document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
}

// ============================================================
// PROGRESS PERSISTENCE
// ============================================================
async function loadProgress() {
  // 1) Prova el fitxer via IPC (persistència principal)
  try {
    if (window.electronAPI && window.electronAPI.loadProgress) {
      const saved = await window.electronAPI.loadProgress();
      if (saved) { Object.assign(STATE.progress, saved); return; }
    }
  } catch(e) { /* continua amb el fallback */ }
  // 2) Fallback localStorage (i recuperació de progrés antic)
  try {
    const raw = localStorage.getItem('bombers_progress');
    if (raw) Object.assign(STATE.progress, JSON.parse(raw));
  } catch(e) { /* res a fer */ }
}

async function saveProgress() {
  // Sempre guarda a localStorage com a còpia de seguretat...
  try { localStorage.setItem('bombers_progress', JSON.stringify(STATE.progress)); } catch(e) {}
  // ...i al fitxer via IPC si està disponible (persistència principal)
  try {
    if (window.electronAPI && window.electronAPI.saveProgress) {
      await window.electronAPI.saveProgress(STATE.progress);
    }
  } catch(e) { /* la còpia de localStorage ja s'ha desat */ }
}

// ============================================================
// MAIN APP OBJECT
// ============================================================
const App = {
  _currentOverlayCloseAction: null,

  async init() {
    await loadProgress();
    // Load questions
    try {
      // Try Electron API first (more reliable with file:// protocol)
      if (window.electronAPI && window.electronAPI.loadQuestions) {
        questionsData = window.electronAPI.loadQuestions();
      }
      if (!questionsData) {
        const resp = await fetch('./data/questions.json');
        questionsData = await resp.json();
      }
    } catch(e) {
      console.error('Error loading questions:', e);
    }
    if (!questionsData) { document.getElementById('loadingBar').style.background = 'var(--red)'; }
    // Animate loading bar
    const bar = document.getElementById('loadingBar');
    let pct = 0;
    const interval = setInterval(() => {
      pct += 2 + Math.random() * 3;
      bar.style.width = Math.min(pct, 100) + '%';
      if (pct >= 100) { clearInterval(interval); setTimeout(() => { showScreen('screen-menu'); App.updateMenuStats(); }, 300); }
    }, 40);
  },

  updateMenuStats() {
    const p = STATE.progress;
    document.getElementById('totalPoints').textContent = p.points.toLocaleString();
    const completed = Object.values(p.levelResults).filter(r => r.stars > 0).length;
    document.getElementById('levelsCompleted').textContent = completed;
    // global percent
    const allR = Object.values(p.levelResults);
    if (allR.length > 0) {
      const avg = allR.reduce((s, r) => s + (r.bestPct || 0), 0) / allR.length;
      document.getElementById('globalPercent').textContent = Math.round(avg);
    } else { document.getElementById('globalPercent').textContent = '0'; }
    document.getElementById('headerPoints').textContent = p.points.toLocaleString();
    document.getElementById('headerPointsExams').textContent = p.points.toLocaleString();
    // Any actual al subtítol
    const yEl = document.getElementById('currentYear');
    if (yEl) yEl.textContent = new Date().getFullYear();
    // Comptador de preguntes fallades
    const failedN = (p.failedQuestions || []).length;
    const reviewSub = document.getElementById('reviewCount');
    if (reviewSub) reviewSub.textContent = failedN > 0 ? `${failedN} pendent${failedN !== 1 ? 's' : ''} de repàs` : 'Cap error pendent';
    const reviewBtn = document.getElementById('btnReview');
    if (reviewBtn) reviewBtn.classList.toggle('is-empty', failedN === 0);
  },

  showMenu() { showScreen('screen-menu'); this.updateMenuStats(); closeOverlays(); },

  showLevels() {
    showScreen('screen-levels');
    this.updateMenuStats();
    this.renderLevels();
  },

  renderLevels() {
    const grid = document.getElementById('levelsGrid');
    const p = STATE.progress;
    let html = '';
    TOPICS.forEach((t, idx) => {
      const r = p.levelResults[t.id] || {};
      const stars = r.stars || 0;
      const isCompleted = stars > 0;
      const isLocked = idx > 0 && !(p.levelResults[TOPICS[idx-1].id]?.stars > 0);
      const starStr = ['☆☆☆','★☆☆','★★☆','★★★'][stars];
      const bestStr = r.bestPct ? `${Math.round(r.bestPct)}% millor` : 'Sense completar';
      const classes = ['level-card', isLocked ? 'locked' : '', isCompleted ? 'completed' : ''].filter(Boolean).join(' ');
      html += `
        <div class="${classes}" onclick="${isLocked ? `App.lockedTip()` : `App.startLevel(${t.id})`}">
          ${isLocked ? `<div class="level-lock">🔒</div>` : ''}
          <div class="level-num">NIVELL ${idx+1}</div>
          <div class="level-icon">${t.icon}</div>
          <div class="level-name">${t.shortName}</div>
          <div class="level-desc">${t.name}</div>
          <div class="level-footer">
            <div class="level-stars">${starStr}</div>
            <div class="level-best">${bestStr}</div>
          </div>
        </div>`;
    });
    grid.innerHTML = html;
  },

  getExamStars(examId) {
    const r = STATE.progress.examResults[examId] || {};
    return ['☆☆☆','★☆☆','★★☆','★★★'][r.stars||0];
  },
  getExamBest(examId) {
    const r = STATE.progress.examResults[examId] || {};
    return r.bestPct ? `${Math.round(r.bestPct)}% millor` : 'Sense completar';
  },

  showExams() {
    showScreen('screen-exams');
    this.renderExams();
  },

  renderExams() {
    const grid = document.getElementById('examsGrid');
    const p = STATE.progress;
    let html = '';
    EXAMS.forEach(exam => {
      const r = p.examResults[exam.id] || {};
      const stars = r.stars || 0;
      const isLocked = exam.isFinal ? (Object.keys(p.examResults).length < 4) : false;
      const bestStr = r.bestPct ? `Millor: ${Math.round(r.bestPct)}% (${['☆☆☆','★☆☆','★★☆','★★★'][stars]})` : '';
      html += `
        <div class="exam-card-big ${isLocked ? 'locked' : ''}" onclick="${isLocked ? `App.showToast('Completa primer els exàmens de bloc!')` : `App.startExam('${exam.id}')`}">
          ${isLocked ? '<div style="position:absolute;top:16px;right:16px;font-size:1.5rem">🔒</div>' : ''}
          <div class="exam-badge-big">${exam.badge}</div>
          <div class="exam-title-big">${exam.title}</div>
          <div class="exam-desc-big">${exam.desc}</div>
          <div class="exam-meta">
            <div class="exam-meta-item">📝 <span>${exam.questions}</span> preguntes</div>
            <div class="exam-meta-item">⏱️ <span>${exam.time}</span> min</div>
          </div>
          ${bestStr ? `<div class="exam-best">${bestStr}</div>` : ''}
        </div>`;
    });
    grid.innerHTML = html;
  },

  showStats() {
    showScreen('screen-stats');
    this.renderStats();
  },

  renderStats() {
    const p = STATE.progress;
    const allTopicR = TOPICS.map(t => ({ t, r: p.levelResults[t.id] || {} }));
    const totalAttempts = allTopicR.reduce((s, { r }) => s + (r.attempts || 0), 0);
    const completedCount = allTopicR.filter(({ r }) => r.stars > 0).length;

    let html = `
      <div class="stats-section">
        <h3>📊 RESUM GENERAL</h3>
        <div class="stats-row"><span class="stats-label">Punts totals</span><span class="stats-val">⭐ ${p.points.toLocaleString()}</span></div>
        <div class="stats-row"><span class="stats-label">Nivells completats</span><span class="stats-val">${completedCount} / 21</span></div>
        <div class="stats-row"><span class="stats-label">Tests realitzats</span><span class="stats-val">${totalAttempts}</span></div>
      </div>
      <div class="stats-section">
        <h3>📚 PROGRÉS PER TEMA</h3>`;

    allTopicR.forEach(({ t, r }) => {
      const pct = r.bestPct || 0;
      const cls = pct >= 70 ? 'good' : pct >= 50 ? 'medium' : 'bad';
      html += `
        <div class="topic-progress-item">
          <div class="tp-header"><span class="tp-name">${t.icon} ${t.shortName}</span><span class="tp-pct">${Math.round(pct)}%</span></div>
          <div class="tp-bar"><div class="tp-fill ${cls}" style="width:${pct}%"></div></div>
        </div>`;
    });

    html += `</div><div class="stats-section"><h3>📝 EXÀMENS</h3>`;
    EXAMS.forEach(exam => {
      const r = p.examResults[exam.id] || {};
      html += `<div class="stats-row"><span class="stats-label">${exam.title}</span><span class="stats-val">${r.bestPct ? Math.round(r.bestPct)+'%' : '–'}</span></div>`;
    });
    html += `</div>`;

    // Tips section
    const weak = allTopicR.filter(({ r }) => (r.bestPct||0) < 60 && (r.attempts||0) > 0).map(({ t }) => t.shortName);
    if (weak.length > 0) {
      html += `<div class="stats-section"><h3>💡 CONSELLS DE MILLORA</h3>`;
      weak.forEach(name => {
        html += `<div class="tip-item"><span class="tip-icon">⚠️</span><span>Repassa <strong>${name}</strong> – tens menys del 60% d'encerts</span></div>`;
      });
      html += `</div>`;
    }

    document.getElementById('statsContent').innerHTML = html;
  },

  lockedTip() { showToast('🔒 Completa el nivell anterior per desbloquejar!'); },
  showToast(msg) { showToast(msg); },

  // ============================================================
  // QUIZ LOGIC
  // ============================================================
  startLevel(topicId) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic || !questionsData) { showToast('Error carregant preguntes'); return; }
    const topicData = questionsData.topics.find(t => t.id === topicId);
    if (!topicData) { showToast('Preguntes no disponibles'); return; }

    const questions = shuffle([...topicData.questions]).slice(0, Math.min(15, topicData.questions.length));
    this._startQuiz({ mode: 'level', topicId, name: topic.shortName, questions, timePerQ: 30 });
  },

  startExam(examId) {
    const exam = EXAMS.find(e => e.id === examId);
    if (!exam || !questionsData) return;

    let pool = [];
    exam.topicIds.forEach(tid => {
      const td = questionsData.topics.find(t => t.id === tid);
      if (td) pool.push(...td.questions);
    });
    const questions = shuffle(pool).slice(0, exam.questions);
    this._startQuiz({ mode: 'exam', examId, name: exam.title, questions, timePerQ: exam.isFinal ? 72 : 60 });
  },

  startReview() {
    if (!questionsData) { showToast('Error carregant preguntes'); return; }
    const ids = STATE.progress.failedQuestions || [];
    if (!ids.length) { showToast('🎉 Cap pregunta fallada. Bon treball!'); return; }
    const byId = {};
    questionsData.topics.forEach(t => t.questions.forEach(qq => { byId[qq.id] = qq; }));
    const pool = ids.map(id => byId[id]).filter(Boolean);
    if (!pool.length) { showToast('🎉 Cap pregunta fallada. Bon treball!'); return; }
    const questions = shuffle([...pool]).slice(0, Math.min(20, pool.length));
    this._startQuiz({ mode: 'review', name: 'Repàs de preguntes fallades', questions, timePerQ: 30 });
  },

  _startQuiz({ mode, topicId, examId, name, questions, timePerQ }) {
    const q = STATE.quiz;
    q.mode = mode;
    q.topicId = topicId || null;
    q.examId = examId || null;
    q.questions = questions;
    q.currentIdx = 0;
    q.answers = [];
    q.points = 0;
    q.answered = false;
    if (q.timerInterval) clearInterval(q.timerInterval);

    document.getElementById('quizTopicName').textContent = name;
    document.getElementById('quizPointsLive').lastElementChild.textContent = '0';
    showScreen('screen-quiz');
    this.renderQuestion();
  },

  renderQuestion() {
    const q = STATE.quiz;
    if (q.currentIdx >= q.questions.length) { this.finishQuiz(); return; }

    const question = q.questions[q.currentIdx];
    const total = q.questions.length;
    q.answered = false;

    document.getElementById('quizCounter').textContent = `${q.currentIdx + 1} / ${total}`;
    document.getElementById('questionNum').textContent = `PREGUNTA ${q.currentIdx + 1}`;
    document.getElementById('questionText').textContent = question.question;

    const pct = (q.currentIdx / total) * 100;
    document.getElementById('quizProgressFill').style.width = pct + '%';

    // Options
    const grid = document.getElementById('optionsGrid');
    const letters = ['a','b','c','d'];
    grid.innerHTML = letters.map(l => `
      <button class="option-btn" onclick="App.answer('${l}')" data-opt="${l}">
        <span class="option-letter">${l.toUpperCase()}</span>
        <span>${question.options[l]}</span>
      </button>`).join('');

    // Timer
    if (q.timerInterval) clearInterval(q.timerInterval);
    const timePerQ = q.mode === 'exam' ? 60 : 30;
    q.timeLeft = timePerQ;
    const timerFill = document.getElementById('quizTimerFill');
    timerFill.style.width = '100%';
    timerFill.style.background = 'var(--green)';
    q.timerInterval = setInterval(() => {
      q.timeLeft -= 0.1;
      const pct = (q.timeLeft / timePerQ) * 100;
      timerFill.style.width = Math.max(0, pct) + '%';
      timerFill.style.background = pct > 50 ? 'var(--green)' : pct > 25 ? '#f59e0b' : 'var(--red)';
      if (q.timeLeft <= 0) { clearInterval(q.timerInterval); if (!q.answered) App.answer(null); }
    }, 100);
  },

  answer(chosen) {
    const q = STATE.quiz;
    if (q.answered) return;
    q.answered = true;
    clearInterval(q.timerInterval);

    const question = q.questions[q.currentIdx];
    const correct = question.correct;
    const isCorrect = chosen === correct;

    // Record answer
    q.answers.push({ question, chosen, correct, isCorrect });

    // Track failed questions for review (afegir si falla, treure si encerta)
    const failed = STATE.progress.failedQuestions || (STATE.progress.failedQuestions = []);
    const fIdx = failed.indexOf(question.id);
    if (!isCorrect) { if (fIdx === -1) failed.push(question.id); }
    else if (fIdx !== -1) { failed.splice(fIdx, 1); }

    // Points
    const timeBonus = Math.max(0, Math.round(q.timeLeft));
    const pts = isCorrect ? (10 + timeBonus) : 0;
    q.points += pts;
    STATE.progress.points += pts;
    document.getElementById('quizPointsLive').lastElementChild.textContent = q.points;

    // Highlight options
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(btn => {
      btn.disabled = true;
      const opt = btn.dataset.opt;
      if (opt === correct) btn.classList.add('correct');
      else if (opt === chosen && !isCorrect) btn.classList.add('wrong');
    });

    // Show explanation
    const grid = document.getElementById('optionsGrid');
    const expDiv = document.createElement('div');
    expDiv.className = 'quiz-explanation';
    expDiv.innerHTML = `<strong>${isCorrect ? '✅ Correcte!' : '❌ Incorrecte.'}</strong> ${question.explanation}`;
    grid.appendChild(expDiv);

    // Confetti on correct
    if (isCorrect) Confetti.burst(window.innerWidth/2, window.innerHeight/2, 30);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-next';
    nextBtn.textContent = q.currentIdx + 1 < q.questions.length ? 'Següent →' : '📊 Veure resultats';
    nextBtn.onclick = () => { q.currentIdx++; App.renderQuestion(); };
    document.getElementById('optionsGrid').appendChild(nextBtn);
  },

  finishQuiz() {
    const q = STATE.quiz;
    const correct = q.answers.filter(a => a.isCorrect).length;
    const total = q.questions.length;
    const pct = Math.round((correct / total) * 100);
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;

    // Save result (el repàs no registra resultats de nivell/examen, però sí el progrés de fallades)
    if (q.mode === 'level') {
      const existing = STATE.progress.levelResults[q.topicId] || {};
      STATE.progress.levelResults[q.topicId] = {
        stars: Math.max(existing.stars || 0, stars),
        bestPct: Math.max(existing.bestPct || 0, pct),
        attempts: (existing.attempts || 0) + 1,
      };
    } else if (q.mode === 'exam') {
      const existing = STATE.progress.examResults[q.examId] || {};
      STATE.progress.examResults[q.examId] = {
        stars: Math.max(existing.stars || 0, stars),
        bestPct: Math.max(existing.bestPct || 0, pct),
        attempts: (existing.attempts || 0) + 1,
      };
    }
    saveProgress();

    // Render results screen
    this.renderResults(correct, total, pct, stars, q.points);

    // Trigger overlays (només per nivells i exàmens)
    if (stars > 0 && (q.mode === 'level' || q.mode === 'exam')) {
      setTimeout(() => {
        if (q.mode === 'level') this.showLevelComplete(q.topicId, stars, q.points);
        else if (q.examId === 'final') this.showFinalComplete(pct, q.points);
        else this.showExamComplete(q.examId, stars, pct, q.points);
      }, 1000);
    }
  },

  renderResults(correct, total, pct, stars, points) {
    showScreen('screen-results');

    // Header
    const icon = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '📚' : '💪';
    const title = pct >= 90 ? 'Excel·lent!' : pct >= 70 ? 'Molt bé!' : pct >= 50 ? 'Aprovat!' : 'Segueix practicant';
    const subtitle = pct >= 70 ? 'Has superat el llindar mínim del 70%' : `Necessites ${70-pct}% més per superar el test`;
    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsSubtitle').textContent = subtitle;
    document.getElementById('scoreNum').textContent = correct;
    document.getElementById('scoreDenom').textContent = `/ ${total}`;
    document.getElementById('scoreStars').textContent = ['☆☆☆','★☆☆','★★☆','★★★'][stars];
    document.getElementById('pointsEarned').textContent = `+${points} punts`;
    document.getElementById('percentScore').textContent = `${pct}% encerts`;

    // Tips
    const q = STATE.quiz;
    const wrongAnswers = q.answers.filter(a => !a.isCorrect);
    const tipsEl = document.getElementById('tipsSection');
    if (wrongAnswers.length > 0) {
      const tips = generateTips(wrongAnswers);
      tipsEl.innerHTML = `<h3>💡 Consells de millora</h3>` + tips.map(t => `<div class="tip-item"><span class="tip-icon">📌</span><span>${t}</span></div>`).join('');
      tipsEl.style.display = '';
    } else {
      tipsEl.style.display = 'none';
    }

    // Review list
    const reviewEl = document.getElementById('reviewList');
    reviewEl.innerHTML = q.answers.map((a, i) => `
      <div class="review-item ${a.isCorrect ? 'correct' : 'wrong'}">
        <div class="review-q">${i+1}. ${a.question.question}</div>
        <div class="review-answer">
          ${a.isCorrect
            ? `<span class="correct-ans">✅ ${a.question.options[a.correct]}</span>`
            : `<span class="wrong-ans">${a.chosen ? `La teva: ${a.question.options[a.chosen]}` : 'Sense resposta (temps esgotat)'}</span> → <span class="correct-ans">✅ ${a.question.options[a.correct]}</span>`}
        </div>
        <div class="review-explanation">💬 ${a.question.explanation}</div>
      </div>`).join('');

    // Buttons
    document.getElementById('btnNext').style.display = pct >= 50 ? '' : 'none';

    if (pct >= 70) { Confetti.rain(); }
  },

  exitQuiz() {
    if (STATE.quiz.timerInterval) clearInterval(STATE.quiz.timerInterval);
    this.showLevels();
  },

  repeatQuiz() {
    const q = STATE.quiz;
    if (q.mode === 'level') this.startLevel(q.topicId);
    else if (q.mode === 'review') this.startReview();
    else this.startExam(q.examId);
  },

  goNext() {
    const q = STATE.quiz;
    if (q.mode === 'level') {
      const idx = TOPICS.findIndex(t => t.id === q.topicId);
      if (idx + 1 < TOPICS.length) this.startLevel(TOPICS[idx+1].id);
      else this.showLevels();
    } else if (q.mode === 'review') {
      this.showMenu();
    } else {
      this.showExams();
    }
  },

  // ============================================================
  // OVERLAYS
  // ============================================================
  showLevelComplete(topicId, stars, points) {
    const topic = TOPICS.find(t => t.id === topicId);
    document.getElementById('levelCompleteName').textContent = topic.name;
    document.getElementById('levelCompleteStars').textContent = ['','★','★★','★★★'][stars];
    document.getElementById('levelCompletePoints').textContent = points;
    const fw = document.getElementById('fireworks');
    launchFireworks(fw);
    Confetti.rain();
    document.getElementById('overlay-levelcomplete').classList.remove('hidden');
  },

  showExamComplete(examId, stars, pct, points) {
    const exam = EXAMS.find(e => e.id === examId);
    document.getElementById('examCompleteName').textContent = exam.title;
    document.getElementById('examScore').textContent = `${pct}%`;
    document.getElementById('examCompleteStars').textContent = ['','★','★★','★★★'][stars];
    document.getElementById('examCompletePoints').textContent = points;
    const fb = document.getElementById('examFireBg');
    launchFireworks(fb);
    Confetti.rain();
    document.getElementById('overlay-examcomplete').classList.remove('hidden');
  },

  showFinalComplete(pct, points) {
    const p = STATE.progress;
    const totalPoints = p.points;
    const qs = Object.values(p.levelResults).filter(r => r.stars > 0).length;
    const fs = document.getElementById('finalStats');
    fs.innerHTML = `
      <div class="final-stat"><div class="final-stat-num">⭐ ${totalPoints.toLocaleString()}</div><div class="final-stat-label">Punts totals</div></div>
      <div class="final-stat"><div class="final-stat-num">${qs}/21</div><div class="final-stat-label">Nivells completats</div></div>
      <div class="final-stat"><div class="final-stat-num">${pct}%</div><div class="final-stat-label">Examen final</div></div>`;
    const ff = document.getElementById('finalFireShow');
    launchFireworks(ff);
    Confetti.rain();
    setTimeout(() => Confetti.rain(), 1500);
    setTimeout(() => Confetti.rain(), 3000);
    document.getElementById('overlay-final').classList.remove('hidden');
  },

  closeOverlay() {
    closeOverlays();
    this.showMenu();
  },

  resetProgress() {
    if (confirm('Segur que vols esborrar tot el progrés? Aquesta acció no es pot desfer.')) {
      STATE.progress = { points: 0, levelResults: {}, examResults: {}, failedQuestions: [] };
      saveProgress();
      this.updateMenuStats();
      showToast('✅ Progrés reiniciat');
    }
  },

  copyBizum() {
    const num = '635165846';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(num);
      } else {
        const ta = document.createElement('textarea');
        ta.value = num; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      showToast('📋 Número de Bizum copiat: +34 ' + num + ' · Gràcies! 🔥');
    } catch (e) {
      showToast('💛 Bizum: +34 ' + num);
    }
  },
};

// ============================================================
// HELPERS
// ============================================================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateTips(wrongAnswers) {
  const tips = [];
  if (wrongAnswers.length > 5) tips.push('Revisa el tema en profunditat – hi ha moltes respostes incorrectes.');
  if (wrongAnswers.length <= 3) tips.push('Molt bé! Repassa les preguntes fallades i les tornaràs a encertar.');
  tips.push(`Has fallat ${wrongAnswers.length} pregunta${wrongAnswers.length !== 1 ? 'es' : ''}. Llegeix les explicacions detallades a continuació.`);
  return tips;
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => App.init());
