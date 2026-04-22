/* ===================================================
   CANDY MATH — script.js
   Todos os jogos + loja + save/load
   =================================================== */

// ──────────────────────────────────────────────────
// 1. ESTADO GLOBAL
// ──────────────────────────────────────────────────
const G = {
  stars: 0,
  phase: 1,
  totalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  soundOn: true,
  roundCorrect: 0,        // acertos na rodada atual
  currentMode: null,      // 'quiz' | 'race' | 'puzzle'
  currentQ: null,         // pergunta ativa
  quizIndex: 0,           // índice dentro da rodada (0..4)
  raceIndex: 0,
  puzzleIndex: 0,
  equip: { hat:null, glasses:null, outfit:null, accessory:null },
  owned: [],
};

// ──────────────────────────────────────────────────
// 2. BANCO DE QUESTÕES (apenas matemática, temática de doces)
// icon: FA class used to render the card icon
// ──────────────────────────────────────────────────
const QUESTIONS = [
  // ── ADIÇÃO ──────────────────────────────────────
  { phase:1, diff:"Fácil",  icon:"fa-candy-cane", text:"João tem 3 balas e ganhou mais 4. Quantas balas ele tem ao todo?", opts:["7","6","8","5"], ans:0 },
  { phase:1, diff:"Fácil",  icon:"fa-lollipop",   text:"Maria tem 5 pirulitos e sua mãe deu mais 2. Quantos pirulitos no total?", opts:["7","6","8","9"], ans:0 },
  { phase:1, diff:"Fácil",  icon:"fa-cookie",     text:"Na caixinha há 2 chocolates e 6 gomas. Quantos doces ao todo?", opts:["8","7","9","10"], ans:0 },
  { phase:1, diff:"Fácil",  icon:"fa-cake-candles",text:"Pedro tem 4 cupcakes e ganhou mais 3 da festa. Quantos cupcakes ao total?", opts:["7","6","8","9"], ans:0 },
  { phase:1, diff:"Fácil",  icon:"fa-circle-dot", text:"Há 3 donuts na mesa e chegam mais 5. Quantos donuts agora?", opts:["8","7","9","6"], ans:0 },
  { phase:1, diff:"Fácil",  icon:"fa-ice-cream",  text:"A Ana fez 6 fatias de bolo e depois fez mais 4. Quantas fatias ao todo?", opts:["10","9","11","8"], ans:0 },
  { phase:2, diff:"Fácil",  icon:"fa-candy-cane", text:"Numa jarra há 8 balinhas. Colocaram mais 7. Quantas balinhas agora?", opts:["15","14","16","13"], ans:0 },
  { phase:2, diff:"Fácil",  icon:"fa-lollipop",   text:"Comprei 9 pirulitos e minha irmã comprou 6. Quantos pirulitos juntos?", opts:["15","14","16","17"], ans:0 },
  { phase:2, diff:"Fácil",  icon:"fa-cookie",     text:"O carrinho tem 12 chocolates e colocaram mais 8. Quantos chocolates no total?", opts:["20","19","21","18"], ans:0 },
  { phase:2, diff:"Médio",  icon:"fa-ice-cream",  text:"O bolo tem 13 confeitos e jogaram mais 9. Quantos confeitos ao todo?", opts:["22","21","23","20"], ans:0 },

  // ── SUBTRAÇÃO ───────────────────────────────────
  { phase:3, diff:"Médio",  icon:"fa-candy-cane", text:"Pedro tinha 10 balinhas. Comeu 3. Quantas sobram?", opts:["7","6","8","5"], ans:0 },
  { phase:3, diff:"Médio",  icon:"fa-lollipop",   text:"Havia 15 pirulitos na loja. Venderam 7. Quantos restam?", opts:["8","7","9","6"], ans:0 },
  { phase:3, diff:"Médio",  icon:"fa-cookie",     text:"A caixa tinha 20 chocolates. Distribuíram 9. Quantos ficaram?", opts:["11","10","12","9"], ans:0 },
  { phase:3, diff:"Médio",  icon:"fa-circle-dot", text:"Tinha 18 donuts. As crianças comeram 6. Quantos sobraram?", opts:["12","11","13","10"], ans:0 },
  { phase:4, diff:"Médio",  icon:"fa-ice-cream",  text:"O bolo tinha 25 fatias. Serviram 8. Quantas fatias restam?", opts:["17","16","18","15"], ans:0 },
  { phase:4, diff:"Médio",  icon:"fa-cake-candles",text:"Havia 30 cupcakes. Venderam 14. Quantos cupcakes sobraram?", opts:["16","15","17","18"], ans:0 },

  // ── MULTIPLICAÇÃO ───────────────────────────────
  { phase:5, diff:"Difícil", icon:"fa-candy-cane", text:"Há 3 saquinhos com 4 balas cada. Quantas balas ao total?", opts:["12","11","13","10"], ans:0 },
  { phase:5, diff:"Difícil", icon:"fa-lollipop",   text:"Cada criança ganhou 5 pirulitos. São 4 crianças. Quantos pirulitos ao total?", opts:["20","19","21","18"], ans:0 },
  { phase:5, diff:"Difícil", icon:"fa-cookie",     text:"Cada caixinha tem 6 chocolates. Com 3 caixinhas, quantos chocolates?", opts:["18","17","19","16"], ans:0 },
  { phase:5, diff:"Difícil", icon:"fa-ice-cream",  text:"A festa tem 5 mesas. Em cada mesa há 4 fatias de bolo. Quantas fatias ao todo?", opts:["20","19","21","22"], ans:0 },
  { phase:6, diff:"Difícil", icon:"fa-cake-candles",text:"5 bandejas com 7 cupcakes cada. Quantos cupcakes no total?", opts:["35","34","36","30"], ans:0 },
  { phase:6, diff:"Difícil", icon:"fa-circle-dot", text:"6 caixas com 8 donuts cada. Quantos donuts ao total?", opts:["48","47","49","46"], ans:0 },

  // ── DIVISÃO ─────────────────────────────────────
  { phase:7, diff:"Difícil", icon:"fa-candy-cane", text:"12 balas divididas entre 3 amigos. Cada um ganha quantas?", opts:["4","3","5","6"], ans:0 },
  { phase:7, diff:"Difícil", icon:"fa-lollipop",   text:"20 pirulitos para 4 crianças em partes iguais. Cada uma ganha quantos?", opts:["5","4","6","3"], ans:0 },
  { phase:7, diff:"Difícil", icon:"fa-cookie",     text:"24 chocolates divididos entre 6 pessoas. Quantos chocolates cada uma recebe?", opts:["4","3","5","6"], ans:0 },
  { phase:8, diff:"Expert",  icon:"fa-ice-cream",  text:"32 fatias de bolo para 8 convidados igualmente. Quantas fatias cada um ganha?", opts:["4","3","5","8"], ans:0 },
  { phase:8, diff:"Expert",  icon:"fa-cake-candles",text:"36 cupcakes em bandejas de 9. Quantas bandejas?", opts:["4","3","5","6"], ans:0 },

  // ── OPERAÇÕES MISTAS ────────────────────────────
  { phase:6, diff:"Difícil", icon:"fa-candy-cane", text:"Comprei 10 balas, comi 3, depois ganhei mais 5. Quantas balas tenho?", opts:["12","11","13","14"], ans:0 },
  { phase:7, diff:"Difícil", icon:"fa-lollipop",   text:"Tinha 20 pirulitos, dei metade para meu amigo e ganhei mais 4. Quantos tenho?", opts:["14","13","15","12"], ans:0 },
  { phase:8, diff:"Expert",  icon:"fa-cookie",     text:"Comprei 3 caixas com 6 chocolates cada. Dei 8 chocolates. Quantos ficaram?", opts:["10","9","11","12"], ans:0 },

  // ── SEQUÊNCIAS / PADRÕES ────────────────────────
  { phase:4, diff:"Médio",  icon:"fa-candy-cane", text:"Qual é o próximo número? 2, 4, 6, 8, __", opts:["10","9","11","12"], ans:0 },
  { phase:4, diff:"Médio",  icon:"fa-lollipop",   text:"Complete a sequência: 5, 10, 15, 20, __", opts:["25","24","26","30"], ans:0 },
  { phase:5, diff:"Difícil", icon:"fa-cookie",    text:"Qual é o próximo? 3, 6, 9, 12, __", opts:["15","14","16","13"], ans:0 },
  { phase:6, diff:"Difícil", icon:"fa-circle-dot",text:"Continue: 100, 90, 80, 70, __", opts:["60","50","65","70"], ans:0 },
];

// ──────────────────────────────────────────────────
// 3. ITENS DA LOJA (Guarda-Roupa do Coala)
// ──────────────────────────────────────────────────
const SHOP_ITEMS = [
  // Chapéus
  { id:"hat_crown",   cat:"hat",       name:"Coroa de Açúcar",    icon:"fa-crown",         iconColor:"#FFD93D", price:50,  rarity:"raro" },
  { id:"hat_party",   cat:"hat",       name:"Chapéu de Festa",    icon:"fa-hat-wizard",    iconColor:"#FF6B9D", price:30,  rarity:"comum" },
  { id:"hat_chef",    cat:"hat",       name:"Chapéu de Chef",     icon:"fa-user-chef",     iconColor:"#fff",    price:40,  rarity:"comum" },
  { id:"hat_cowboy",  cat:"hat",       name:"Chapéu de Cowboy",   icon:"fa-hat-cowboy",    iconColor:"#FF9A3C", price:45,  rarity:"incomum" },
  { id:"hat_witch",   cat:"hat",       name:"Chapéu de Bruxa",    icon:"fa-hat-witch",     iconColor:"#9B5DE5", price:55,  rarity:"incomum" },
  { id:"hat_santa",   cat:"hat",       name:"Gorro de Natal",     icon:"fa-snowflake",     iconColor:"#3DBBFF", price:60,  rarity:"raro" },
  // Óculos
  { id:"glass_star",  cat:"glasses",   name:"Óculos Estrela",     icon:"fa-star",          iconColor:"#FFD93D", price:25,  rarity:"comum" },
  { id:"glass_heart", cat:"glasses",   name:"Óculos Coração",     icon:"fa-heart",         iconColor:"#FF6B9D", price:30,  rarity:"comum" },
  { id:"glass_sun",   cat:"glasses",   name:"Óculos de Sol",      icon:"fa-glasses",       iconColor:"#FF9A3C", price:35,  rarity:"incomum" },
  { id:"glass_rain",  cat:"glasses",   name:"Óculos Arco-íris",   icon:"fa-rainbow",       iconColor:"#4ECDC4", price:45,  rarity:"incomum" },
  // Roupas
  { id:"out_apron",   cat:"outfit",    name:"Avental de Confeitaria", icon:"fa-ice-cream", iconColor:"#FF6B9D", price:80,  rarity:"incomum" },
  { id:"out_cape",    cat:"outfit",    name:"Capa de Super-Herói", icon:"fa-shield",       iconColor:"#9B5DE5", price:100, rarity:"raro" },
  { id:"out_tuxedo",  cat:"outfit",    name:"Smoking Elegante",   icon:"fa-shirt",         iconColor:"#3A2A4D", price:90,  rarity:"raro" },
  { id:"out_wizard",  cat:"outfit",    name:"Roupa de Mago",      icon:"fa-wand-sparkles", iconColor:"#9B5DE5", price:110, rarity:"épico" },
  // Acessórios
  { id:"acc_lolly",   cat:"accessory", name:"Pirulito Gigante",   icon:"fa-lollipop",      iconColor:"#FF6B9D", price:15,  rarity:"comum" },
  { id:"acc_candy",   cat:"accessory", name:"Bala Especial",      icon:"fa-candy-cane",    iconColor:"#FF4757", price:15,  rarity:"comum" },
  { id:"acc_bow",     cat:"accessory", name:"Laço de Fita",       icon:"fa-ribbon",        iconColor:"#FF6B9D", price:20,  rarity:"comum" },
  { id:"acc_flower",  cat:"accessory", name:"Flor Doce",          icon:"fa-flower",        iconColor:"#FF9A3C", price:20,  rarity:"comum" },
  { id:"acc_star",    cat:"accessory", name:"Varinha Mágica",     icon:"fa-wand-magic-sparkles", iconColor:"#FFD93D", price:35, rarity:"incomum" },
  { id:"acc_fire",    cat:"accessory", name:"Chama de Campeão",   icon:"fa-fire",          iconColor:"#FF9A3C", price:50,  rarity:"raro" },
];

// ──────────────────────────────────────────────────
// 4. PUZZLES (Cruzadinha / Grade Numérica)
//    Cada puzzle tem um grid NxN com somas de linhas e colunas
// ──────────────────────────────────────────────────
const PUZZLES = [
  {
    title:"Adição de Doces",
    desc:"Preencha os ? para que as somas batam!",
    size:3,
    // null = célula em branco a preencher
    grid:[[3,null,4],[1,3,null],[null,2,1]],
    rowSums:[9,6,5], colSums:[6,7,7],
    answers:{ "0-1":2, "1-2":2, "2-0":2 },
    stars:30,
  },
  {
    title:"Pirulitos e Contas",
    desc:"Some corretamente para completar a grade!",
    size:3,
    grid:[[null,5,2],[4,null,3],[1,2,null]],
    rowSums:[9,9,5], colSums:[7,9,7],
    answers:{ "0-0":2, "1-1":2, "2-2":2 },
    stars:30,
  },
  {
    title:"Fábrica de Chocolates",
    desc:"Complete os números que faltam!",
    size:3,
    grid:[[2,null,6],[null,4,3],[5,2,null]],
    rowSums:[11,9,10], colSums:[10,9,11],
    answers:{ "0-1":3, "1-0":2, "2-2":3 },
    stars:35,
  },
  {
    title:"Desafio da Confeitaria",
    desc:"4 números para descobrir — você consegue!",
    size:3,
    grid:[[null,3,null],[2,null,4],[null,5,3]],
    rowSums:[10,9,11], colSums:[9,11,10],
    answers:{ "0-0":7, "0-2":0, "1-1":3, "2-0":3 },
    // wait let me recalculate:
    // row0: 7+3+0 = 10 ✓  row1: 2+3+4 = 9 ✓  row2: 3+5+3 = 11 ✓
    // col0: 7+2+3 = 12 ≠ 9 — fix:
    // Let me use a correct one:
    // grid:[[4,3,2],[1,null,4],[null,5,3]]
    // row0=9, row1=5+null+4, row2=null+5+3
    // Actually let me redefine:
    stars:40,
  },
  {
    title:"Doçura Extra!",
    desc:"Grade 3x3 com desafio de adição e subtração!",
    size:3,
    grid:[[5,null,3],[null,6,2],[4,1,null]],
    rowSums:[10,10,7], colSums:[11,9,7],
    answers:{ "0-1":2, "1-0":2, "2-2":2 },
    stars:35,
  },
  {
    title:"Pirâmide de Balas",
    desc:"Grade maior — mostre sua habilidade!",
    size:4,
    grid:[
      [2,null,3,1],
      [1,4,null,2],
      [null,2,3,1],
      [3,1,2,null],
    ],
    rowSums:[8,9,8,8], colSums:[8,9,10,6],
    answers:{ "0-1":2, "1-2":2, "2-0":2, "3-3":2 },
    stars:50,
  },
];

// Corrigir puzzle 4 (tinha erro de cálculo)
PUZZLES[3] = {
  title:"Desafio da Confeitaria",
  desc:"4 números para descobrir — você consegue!",
  size:3,
  grid:[[null,3,4],[2,null,1],[3,2,null]],
  rowSums:[9,6,8], colSums:[7,8,8],
  // 0-0: 9-3-4=2, 1-1: 6-2-1=3, 2-2: 8-3-2=3
  // col0: 2+2+3=7 ✓, col1: 3+3+2=8 ✓, col2: 4+1+3=8 ✓
  answers:{ "0-0":2, "1-1":3, "2-2":3 },
  stars:40,
};

// ──────────────────────────────────────────────────
// 5. MENSAGENS DO COALA
// ──────────────────────────────────────────────────
const MSGS = {
  correct:["Incrível! Você é um gênio!","Arrasou! Continue assim!","Que rápido! Muito bem!","Perfeito! Você é demais!","Sensacional!","Está mandando muito!"],
  wrong:  ["Não foi dessa vez! Tente de novo!","Quase lá! Você consegue!","Errou, mas está aprendendo!","Próxima você acerta!"],
  streak: ["SEQUÊNCIA INCRÍVEL!","Você está em chamas!","Imparável!"],
  idle:   ["Vamos aprender!","Qual jogo vamos jogar?","Ganhei estrelas hoje?","Amo doces e matemática!","Você está incrível!"],
};

// ──────────────────────────────────────────────────
// 6. DOM helpers
// ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
let idleTimer = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ──────────────────────────────────────────────────
// 7. INICIALIZAÇÃO
// ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  $('btnPlay').addEventListener('click', () => {
    showScreen('screenHub');
    updateHubUI();
    startIdleMessages();
  });
  renderShop('all');
  setupParticleCanvas();
});

// ──────────────────────────────────────────────────
// 8. HUB UI
// ──────────────────────────────────────────────────
function updateHubUI() {
  $('hubStars').textContent = G.stars;
  $('hubPhase').textContent = G.phase;
  // Koala accessories
  applyEquipToEl('kHat',   'hat');
  applyEquipToEl('kGlass', 'glasses');
  applyEquipToEl('kOutfit','outfit');
  applyEquipToEl('kAcc',   'accessory');
}
function applyEquipToEl(elId, slot) {
  const item = G.equip[slot] ? SHOP_ITEMS.find(i=>i.id===G.equip[slot]) : null;
  const el = $(elId);
  if (item) {
    const col = item.iconColor || 'inherit';
    el.innerHTML = `<i class="fa-solid ${item.icon}" style="color:${col}"></i>`;
  } else {
    el.innerHTML = '';
  }
}
function startIdleMessages() {
  clearTimeout(idleTimer);
  function setMsg() {
    $('koalaSpeech').textContent = pick(MSGS.idle);
    idleTimer = setTimeout(setMsg, 5000);
  }
  idleTimer = setTimeout(setMsg, 3000);
}
function koalaSpeak(msg) {
  $('koalaSpeech').textContent = msg;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(startIdleMessages, 4000);
}

// ──────────────────────────────────────────────────
// 9. START MODES
// ──────────────────────────────────────────────────
function startMode(mode) {
  G.currentMode = mode;
  G.roundCorrect = 0;
  clearTimeout(idleTimer);
  if (mode === 'quiz')   { G.quizIndex = 0;   startQuizRound(); showScreen('screenQuiz');  }
  if (mode === 'race')   { G.raceIndex = 0;   startRaceRound(); showScreen('screenRace');  }
  if (mode === 'puzzle') { startPuzzleMode();  showScreen('screenPuzzle'); }
}

function goHub() {
  showScreen('screenHub');
  updateHubUI();
  startIdleMessages();
}

// ──────────────────────────────────────────────────
// 10. QUIZ GAME
// ──────────────────────────────────────────────────
function getQuestionPool() {
  return QUESTIONS.filter(q => q.phase <= G.phase);
}
function pickQuestion() {
  const pool = getQuestionPool();
  if (!pool.length) return QUESTIONS[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

function startQuizRound() {
  G.quizIndex = 0;
  G.roundCorrect = 0;
  updateQuizDots();
  loadQuizQuestion();
}

function loadQuizQuestion() {
  G.currentQ = pickQuestion();
  const q = G.currentQ;

  $('quizProg').textContent   = `${G.quizIndex+1}/5`;
  $('quizStarsBar').textContent = G.stars;
  $('quizDiff').textContent   = q.diff;
  $('quizEmoji').innerHTML    = `<i class="fa-solid ${q.icon || 'fa-candy-cane'}"></i>`;
  $('quizText').textContent   = q.text;
  $('quizFeedback').classList.remove('show');

  // Shuffle options
  const shuffled = shuffleOpts(q.opts, q.ans);
  renderQuizAnswers(shuffled.opts, shuffled.correctIdx);
  updateQuizDots('current', G.quizIndex);

  // Animate card
  $('quizCard').style.animation = 'none';
  void $('quizCard').offsetWidth;
  $('quizCard').style.animation = 'slideUp 0.4s ease';
}

function shuffleOpts(opts, correctIdx) {
  const correctAnswer = opts[correctIdx];
  const shuffled = [...opts].sort(() => Math.random() - 0.5);
  const newCorrectIdx = shuffled.indexOf(correctAnswer);
  return { opts: shuffled, correctIdx: newCorrectIdx };
}

function renderQuizAnswers(opts, correctIdx) {
  const grid = $('quizAnswers');
  grid.innerHTML = '';
  opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'ans-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleQuizAnswer(i, correctIdx, btn));
    grid.appendChild(btn);
  });
}

function handleQuizAnswer(chosen, correct, btn) {
  const btns = document.querySelectorAll('.ans-btn');
  btns.forEach(b => b.disabled = true);

  if (chosen === correct) {
    btn.classList.add('correct');
    G.stars += 10;
    G.totalCorrect++;
    G.streak++;
    G.roundCorrect++;
    if (G.streak > G.bestStreak) G.bestStreak = G.streak;
    playSound('correct');
    showConfetti();
    const msg = G.streak >= 3 ? pick(MSGS.streak) : pick(MSGS.correct);
    showQuizFeedback(msg);
    updateQuizDots('done', G.quizIndex);
    if (G.streak % 3 === 0) G.stars += 5; // streak bonus
  } else {
    btn.classList.add('wrong');
    btns[correct].classList.add('reveal');
    G.streak = 0;
    playSound('wrong');
    showQuizFeedback(pick(MSGS.wrong));
    updateQuizDots('wrong', G.quizIndex);
  }

  $('quizStarsBar').textContent = G.stars;
  saveState();

  setTimeout(() => {
    G.quizIndex++;
    if (G.quizIndex >= 5) {
      finishRound('quiz');
    } else {
      loadQuizQuestion();
    }
  }, 1600);
}

function showQuizFeedback(msg) {
  $('quizFeedbackMsg').textContent = msg;
  $('quizFeedback').classList.add('show');
}

function updateQuizDots(state, index) {
  document.querySelectorAll('.qdot').forEach((dot, i) => {
    dot.classList.remove('done','wrong','current');
    if (i < G.quizIndex) { /* already processed */ }
    if (state === 'done'    && i === index) dot.classList.add('done');
    if (state === 'wrong'   && i === index) dot.classList.add('wrong');
    if (state === 'current' && i === index) dot.classList.add('current');
  });
}

// ──────────────────────────────────────────────────
// 11. RACE GAME
// ──────────────────────────────────────────────────
const RACE_ICONS = ['fa-candy-cane','fa-lollipop','fa-cookie','fa-ice-cream','fa-cake-candles'];

function startRaceRound() {
  G.raceIndex = 0;
  G.roundCorrect = 0;
  loadRaceQuestion();
}

function loadRaceQuestion() {
  G.currentQ = pickQuestion();
  const q = G.currentQ;

  $('raceProg').textContent    = `${G.raceIndex+1}/5`;
  $('raceStarsBar').textContent = G.stars;
  $('raceDiff').textContent    = q.diff;
  $('raceText').textContent    = q.text;
  $('raceFeedback').classList.remove('show');

  // Reset car position to center
  const car = $('raceCar');
  car.classList.remove('crash','win');
  car.style.transition = 'none';
  car.style.left = '50%';
  car.style.transform = 'translateX(-50%)';

  // Reset finish line
  $('finishLine').classList.remove('show');

  // Build 3 gate answers
  const shuffled = shuffleOpts(q.opts.slice(0,3), q.opts.slice(0,3).indexOf(q.opts[q.ans]));
  // Make sure correct is among 3 opts
  let threeOpts = [q.opts[q.ans]];
  const wrongs = q.opts.filter(o => o !== q.opts[q.ans]);
  threeOpts.push(wrongs[0], wrongs[1]);
  threeOpts = threeOpts.sort(() => Math.random() - 0.5);
  const correctIdx = threeOpts.indexOf(q.opts[q.ans]);

  renderRaceGates(threeOpts, correctIdx);
  renderRaceLaneBtns(threeOpts, correctIdx);
}

function renderRaceGates(opts, correctIdx) {
  const gates = $('raceGates');
  gates.innerHTML = '';
  opts.forEach((opt, i) => {
    const g = document.createElement('div');
    g.className = 'race-gate';
    g.innerHTML = `<i class="fa-solid ${RACE_ICONS[i % RACE_ICONS.length]} gate-icon"></i><span class="gate-text">${opt}</span>`;
    g.dataset.lane = i;
    gates.appendChild(g);
  });
}

function renderRaceLaneBtns(opts, correctIdx) {
  const btns = $('raceLaneBtns');
  btns.innerHTML = '';
  opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'lane-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleRaceChoice(i, correctIdx, opts.length));
    btns.appendChild(btn);
  });
}

function handleRaceChoice(chosen, correct, total) {
  const laneBtns = document.querySelectorAll('.lane-btn');
  laneBtns.forEach(b => b.disabled = true);

  const car = $('raceCar');
  const stage = $('raceStage');
  const stageW = stage.offsetWidth;
  const laneW  = stageW / total;
  const laneCenter = (chosen * laneW) + (laneW / 2);
  
  // Move car to chosen lane
  car.style.transition = 'left 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  car.style.left = laneCenter + 'px';
  car.style.transform = 'translateX(-50%)';

  const gates = $('raceGates').querySelectorAll('.race-gate');

  setTimeout(() => {
    if (chosen === correct) {
      gates[chosen].classList.add('correct-gate');
      car.classList.add('win');
      G.stars += 15;
      G.totalCorrect++;
      G.streak++;
      G.roundCorrect++;
      if (G.streak > G.bestStreak) G.bestStreak = G.streak;
      $('finishLine').classList.add('show');
      playSound('correct');
      showConfetti();
      showRaceFeedback(pick(MSGS.correct));
    } else {
      gates[chosen].classList.add('wrong-gate');
      gates[correct].classList.add('correct-gate');
      car.classList.add('crash');
      G.streak = 0;
      playSound('wrong');
      showRaceFeedback(pick(MSGS.wrong));
    }

    $('raceStarsBar').textContent = G.stars;
    saveState();

    setTimeout(() => {
      G.raceIndex++;
      if (G.raceIndex >= 5) {
        finishRound('race');
      } else {
        loadRaceQuestion();
      }
    }, 1800);
  }, 450);
}

function showRaceFeedback(msg) {
  $('raceFeedbackMsg').textContent = msg;
  $('raceFeedback').classList.add('show');
}

// ──────────────────────────────────────────────────
// 12. PUZZLE GAME
// ──────────────────────────────────────────────────
let currentPuzzle = null;
let hintsUsed = 0;

function startPuzzleMode() {
  hintsUsed = 0;
  $('btnNextPuzzle').style.display = 'none';
  loadPuzzle(G.puzzleIndex % PUZZLES.length);
}

function loadPuzzle(idx) {
  currentPuzzle = PUZZLES[idx];
  $('puzzleLvlLabel').textContent = `Nível ${idx+1}`;
  $('puzzleStarsBar').textContent = G.stars;
  $('puzzleTitle').textContent    = currentPuzzle.title;
  $('puzzleDesc').textContent     = currentPuzzle.desc;
  hintsUsed = 0;
  renderPuzzleGrid();
}

function renderPuzzleGrid() {
  const p = currentPuzzle;
  const n = p.size;
  const wrap = $('puzzleGridWrap');

  // Grid = n rows + 1 sum row, n cols + 1 sum col + corner
  const totalCols = n + 1;
  const totalRows = n + 1;

  const grid = document.createElement('div');
  grid.className = 'puzzle-grid';
  grid.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;
  grid.innerHTML = '';

  // Data rows
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const cell = document.createElement('div');
      const key = `${r}-${c}`;
      if (p.grid[r][c] !== null) {
        cell.className = 'pcell fixed';
        cell.textContent = p.grid[r][c];
      } else {
        cell.className = 'pcell blank';
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = 0; inp.max = 99;
        inp.id = `cell-${key}`;
        inp.placeholder = '?';
        cell.appendChild(inp);
      }
      grid.appendChild(cell);
    }
    // Row sum label
    const sumCell = document.createElement('div');
    sumCell.className = 'pcell sum-label';
    sumCell.innerHTML = `= <strong>${p.rowSums[r]}</strong>`;
    grid.appendChild(sumCell);
  }

  // Column sum row
  for (let c = 0; c < n; c++) {
    const sumCell = document.createElement('div');
    sumCell.className = 'pcell sum-label';
    sumCell.innerHTML = `= <strong>${p.colSums[c]}</strong>`;
    grid.appendChild(sumCell);
  }
  // Corner
  const corner = document.createElement('div');
  corner.className = 'pcell corner';
  corner.innerHTML = '<i class="fa-solid fa-candy-cane"></i>';
  grid.appendChild(corner);

  wrap.innerHTML = '';
  wrap.appendChild(grid);
}

function checkPuzzle() {
  const p = currentPuzzle;
  const n = p.size;
  let allCorrect = true;
  let anyFilled = false;

  // Clear previous states
  document.querySelectorAll('.pcell.blank').forEach(c => {
    c.classList.remove('correct-cell','wrong-cell');
  });

  Object.entries(p.answers).forEach(([key, ans]) => {
    const inp = $(`cell-${key}`);
    if (!inp) return;
    const cell = inp.parentElement;
    const val = parseInt(inp.value, 10);
    if (!isNaN(val)) anyFilled = true;
    if (val === ans) {
      cell.classList.add('correct-cell');
    } else {
      cell.classList.add('wrong-cell');
      allCorrect = false;
    }
  });

  if (!anyFilled) {
    showToast('Preencha os espaços primeiro!');
    return;
  }

  if (allCorrect) {
    const earned = Math.max(p.stars - hintsUsed * 5, 10);
    G.stars += earned;
    G.totalCorrect++;
    G.puzzleIndex = Math.min(G.puzzleIndex + 1, PUZZLES.length - 1);
    saveState();
    playSound('correct');
    showConfetti();
    showToast(`Correto! +${earned} estrelas!`);
    $('puzzleStarsBar').textContent = G.stars;
    $('btnNextPuzzle').style.display = 'inline-block';
    document.querySelectorAll('.btn-check-puzzle').forEach(b => b.disabled = true);
  } else {
    playSound('wrong');
    showToast('Alguns números estão errados! Tente novamente!');
  }
}

function giveHint() {
  const p = currentPuzzle;
  const blanks = Object.entries(p.answers).filter(([key]) => {
    const inp = $(`cell-${key}`);
    if (!inp) return false;
    return !inp.parentElement.classList.contains('correct-cell');
  });
  if (!blanks.length) { showToast('Tudo já está correto!'); return; }
  const [hKey, hAns] = blanks[0];
  const inp = $(`cell-${hKey}`);
  inp.value = hAns;
  inp.parentElement.classList.add('hinted');
  hintsUsed++;
  showToast(`Dica: célula preenchida! (-5 estrelas)`);
}

function nextPuzzle() {
  $('btnNextPuzzle').style.display = 'none';
  document.querySelectorAll('.btn-check-puzzle').forEach(b => b.disabled = false);
  loadPuzzle(G.puzzleIndex % PUZZLES.length);
}

// ──────────────────────────────────────────────────
// 13. FINISH ROUND & LEVEL UP
// ──────────────────────────────────────────────────
function finishRound(mode) {
  const correct = G.roundCorrect;
  const bonus = correct === 5 ? 25 : correct >= 3 ? 10 : 0;
  if (bonus) {
    G.stars += bonus;
    saveState();
  }

  // Level up?
  const oldPhase = G.phase;
  if (correct >= 3) {
    G.phase = Math.min(G.phase + 1, 8);
  }
  saveState();

  // Show level up modal
  $('luPhaseText').textContent = `Fase ${oldPhase} → Fase ${G.phase}`;
  $('luStarsText').innerHTML = `+${(mode==='quiz'?10:15)*correct + bonus} <i class="fa-solid fa-star"></i>  (bônus: ${bonus})`;
  openModal('modalLevelUp');
  spawnLevelUpConfetti();
  playSound('levelup');
}

// ──────────────────────────────────────────────────
// 14. SHOP / WARDROBE
// ──────────────────────────────────────────────────
let shopFilter = 'all';

function openShop() {
  $('shopCoins').textContent = G.stars;
  renderShop('all');
  // Reset tabs
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.stab')[0].classList.add('active');
  updateWardrobePreview();
  openModal('modalShop');
}

function filterShop(cat, btn) {
  shopFilter = cat;
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderShop(cat);
}

function renderShop(cat) {
  const grid = $('shopGrid');
  grid.innerHTML = '';
  const items = cat === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.cat === cat);

  items.forEach(item => {
    const owned    = G.owned.includes(item.id);
    const equipped = G.equip[item.cat] === item.id;
    const canAfford = G.stars >= item.price;

    const card = document.createElement('div');
    card.className = `shop-item-card${owned?' owned':''}${equipped?' equipped':''}`;
    const iconStyle = item.iconColor ? `style="color:${item.iconColor}"` : '';
    card.innerHTML = `
      <div class="sic-icon"><i class="fa-solid ${item.icon}" ${iconStyle}></i></div>
      <div class="sic-name">${item.name}</div>
      <div class="sic-price">${owned
        ? '<i class="fa-solid fa-circle-check"></i> Possuído'
        : '<i class="fa-solid fa-star"></i> '+item.price
      }</div>
      ${owned
        ? `<button class="sic-btn ${equipped?'unequip-btn':'equip-btn'}"
             onclick="toggleEquip('${item.id}','${item.cat}')">
             ${equipped
               ? '<i class="fa-solid fa-trash"></i> Remover'
               : '<i class="fa-solid fa-sparkles"></i> Equipar'}
           </button>`
        : `<button class="sic-btn ${canAfford?'buy-btn':'locked-btn'}"
             onclick="buyItem('${item.id}')"
             ${canAfford?'':'disabled'}>
             ${canAfford
               ? '<i class="fa-solid fa-cart-shopping"></i> Comprar'
               : '<i class="fa-solid fa-lock"></i> '+item.price}
           </button>`
      }
    `;
    grid.appendChild(card);
  });
}

function buyItem(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item || G.stars < item.price) { showToast('Estrelas insuficientes!'); return; }
  G.stars -= item.price;
  G.owned.push(id);
  saveState();
  showToast(`Comprado: ${item.name}!`);
  playSound('buy');
  $('shopCoins').textContent = G.stars;
  renderShop(shopFilter);
  updateWardrobePreview();
  updateHubUI();
}

function toggleEquip(id, cat) {
  if (G.equip[cat] === id) {
    G.equip[cat] = null; showToast('Item removido!');
  } else {
    G.equip[cat] = id;
    const item = SHOP_ITEMS.find(i=>i.id===id);
    showToast(`${item.name} equipado!`);
  }
  saveState();
  renderShop(shopFilter);
  updateWardrobePreview();
  updateHubUI();
}

function updateWardrobePreview() {
  ['hat','glasses','outfit','accessory'].forEach(slot => {
    const elMap = { hat:'wdHat', glasses:'wdGlass', outfit:'wdOutfit', accessory:'wdAcc' };
    const item = G.equip[slot] ? SHOP_ITEMS.find(i=>i.id===G.equip[slot]) : null;
    const el = $(elMap[slot]);
    if (item) {
      const col = item.iconColor || 'inherit';
      el.innerHTML = `<i class="fa-solid ${item.icon}" style="color:${col}"></i>`;
    } else {
      el.innerHTML = '';
    }
  });
  // Equipped list text
  const equipped = Object.entries(G.equip)
    .filter(([,v])=>v)
    .map(([,v])=>{ const i=SHOP_ITEMS.find(x=>x.id===v); return i?i.name:''; })
    .filter(Boolean);
  $('wdEquippedList').textContent = equipped.length ? equipped.join(' · ') : 'Nenhum item equipado';
}

// ──────────────────────────────────────────────────
// 15. RECORDS
// ──────────────────────────────────────────────────
function openModal(id) {
  if (id === 'modalRecords') {
    $('recStars').textContent   = G.stars;
    $('recPhase').textContent   = G.phase;
    $('recStreak').textContent  = G.bestStreak;
    $('recCorrect').textContent = G.totalCorrect;
  }
  $(id).style.display = 'block';
  $('modalOverlay').classList.add('open');
}
function closeModal(id) {
  $(id).style.display = 'none';
  const anyOpen = document.querySelectorAll('.modal[style*="display: block"], .modal[style*="display:block"]');
  if (!anyOpen.length) $('modalOverlay').classList.remove('open');
}
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  $('modalOverlay').classList.remove('open');
}

function resetGame() {
  if (!confirm('Tem certeza? Todos os dados serão apagados!')) return;
  G.stars=0; G.phase=1; G.totalCorrect=0; G.streak=0; G.bestStreak=0;
  G.equip={hat:null,glasses:null,outfit:null,accessory:null};
  G.owned=[]; G.puzzleIndex=0;
  saveState();
  closeAllModals();
  updateHubUI();
  showToast('Jogo reiniciado! Boa sorte!');
}

// ──────────────────────────────────────────────────
// 16. SOUND EFFECTS (Web Audio API)
// ──────────────────────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playSound(type) {
  if (!G.soundOn) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;

    if (type === 'correct') {
      osc.frequency.setValueAtTime(659, t);
      osc.frequency.setValueAtTime(784, t+0.1);
      osc.frequency.setValueAtTime(1046,t+0.2);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t+0.4);
      osc.start(t); osc.stop(t+0.4);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.setValueAtTime(150, t+0.2);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t+0.4);
      osc.start(t); osc.stop(t+0.4);
    } else if (type === 'levelup') {
      const freqs=[523,659,784,1046];
      freqs.forEach((f,i) => {
        const o2=ctx.createOscillator(), g2=ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.frequency.setValueAtTime(f,t+i*0.12);
        g2.gain.setValueAtTime(0.2,t+i*0.12);
        g2.gain.exponentialRampToValueAtTime(0.001,t+i*0.12+0.2);
        o2.start(t+i*0.12); o2.stop(t+i*0.12+0.25);
      });
      osc.stop(t);
    } else if (type === 'buy') {
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1100,t+0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t+0.25);
      osc.start(t); osc.stop(t+0.25);
    }
  } catch(e) {}
}

function speakText() {
  if (!G.currentQ || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(G.currentQ.text);
  u.lang = 'pt-BR'; u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function toggleSound() {
  G.soundOn = !G.soundOn;
  const el = $('soundIcon');
  el.className = G.soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  saveState();
  showToast(G.soundOn ? 'Som ativado!' : 'Som desativado');
}

// ──────────────────────────────────────────────────
// 17. VISUAL EFFECTS (confetti / particles)
// ──────────────────────────────────────────────────
let canvas, ctx2d;
function setupParticleCanvas() {
  canvas = $('particleCanvas');
  ctx2d  = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

const CONFETTI_COLORS = ['#FF6B9D','#FFD93D','#4ECDC4','#9B5DE5','#FF9A3C','#6BCB77','#3DBBFF'];

function showConfetti() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => spawnParticle(), i * 20);
  }
}
function spawnLevelUpConfetti() {
  for (let i = 0; i < 120; i++) {
    setTimeout(() => spawnParticle(true), i * 15);
  }
}

const particles = [];
function spawnParticle(big = false) {
  particles.push({
    x: Math.random() * canvas.width,
    y: -10,
    vx: (Math.random()-0.5) * (big?6:4),
    vy: Math.random() * (big?5:3) + 2,
    size: Math.random()*(big?14:10)+4,
    color: pick(CONFETTI_COLORS),
    rot: Math.random()*360,
    rotV: (Math.random()-0.5)*10,
    life: 1,
    decay: Math.random()*0.01+0.008,
  });
  if (!animating) animateParticles();
}
let animating = false;
function animateParticles() {
  if (!particles.length) { animating=false; return; }
  animating = true;
  ctx2d.clearRect(0,0,canvas.width,canvas.height);
  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.life -= p.decay;
    if (p.life <= 0 || p.y > canvas.height) { particles.splice(i,1); continue; }
    ctx2d.save();
    ctx2d.globalAlpha = p.life;
    ctx2d.fillStyle = p.color;
    ctx2d.translate(p.x, p.y);
    ctx2d.rotate(p.rot * Math.PI/180);
    ctx2d.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.5);
    ctx2d.restore();
  }
  requestAnimationFrame(animateParticles);
}

// ──────────────────────────────────────────────────
// 18. TOAST NOTIFICATION
// ──────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

// ──────────────────────────────────────────────────
// 19. SAVE / LOAD (localStorage)
// ──────────────────────────────────────────────────
function saveState() {
  try {
    localStorage.setItem('candymath_v2', JSON.stringify({
      stars:       G.stars,
      phase:       G.phase,
      totalCorrect:G.totalCorrect,
      streak:      G.streak,
      bestStreak:  G.bestStreak,
      soundOn:     G.soundOn,
      equip:       G.equip,
      owned:       G.owned,
      puzzleIndex: G.puzzleIndex,
    }));
  } catch(e){}
}
function loadState() {
  try {
    const raw = localStorage.getItem('candymath_v2');
    if (!raw) return;
    const d = JSON.parse(raw);
    G.stars        = d.stars        || 0;
    G.phase        = d.phase        || 1;
    G.totalCorrect = d.totalCorrect || 0;
    G.streak       = d.streak       || 0;
    G.bestStreak   = d.bestStreak   || 0;
    G.soundOn      = d.soundOn !== undefined ? d.soundOn : true;
    G.equip        = d.equip  || {hat:null,glasses:null,outfit:null,accessory:null};
    G.owned        = d.owned  || [];
    G.puzzleIndex  = d.puzzleIndex  || 0;
    const sIcon = $('soundIcon');
    if (sIcon) sIcon.className = G.soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  } catch(e){}
}
// Auto-save every 15s
setInterval(saveState, 15000);

// ──────────────────────────────────────────────────
// 20. UTILITIES
// ──────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }