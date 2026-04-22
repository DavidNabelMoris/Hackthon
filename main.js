// ===== LANGUAGE SWITCHER =====
let currentAppLang = 'fr';

function switchLanguage(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.location.href = url.toString();
}

function updateHomeText(lang) {
  const texts = {
    fr: {
      sub:     "Ta première aventure dans le code. Choisis ton langage !",
      hint:    "💡 Afficher l'indice",
      back:    "← Retour",
      check:   "✓ Vérifier",
      victory: "Niveau Complété !",
      next:    "Challenge suivant →",
      cards: {
        html:   { desc: "Construis le web, stylise le monde", diff: "★☆☆ Débutant" },
        js:     { desc: "Fais bouger les choses",             diff: "★★☆ Intermédiaire" },
        python: { desc: "Logique, données, algorithmes",      diff: "★★☆ Intermédiaire" },
      }
    },
    en: {
      sub:     "Your first adventure into programming. Choose your language!",
      hint:    "💡 Show hint",
      back:    "← Back",
      check:   "✓ Check",
      victory: "Level Complete!",
      next:    "Next Challenge →",
      cards: {
        html:   { desc: "Build the web, style the world", diff: "★☆☆ Beginner" },
        js:     { desc: "Make things move & interact",    diff: "★★☆ Intermediate" },
        python: { desc: "Logic, data, algorithms",        diff: "★★☆ Intermediate" },
      }
    }
  };

  const t = texts[lang];
  document.getElementById('home-sub').textContent      = t.sub;
  document.getElementById('btn-hint').textContent      = t.hint;
  document.getElementById('victory-title').textContent = t.victory;
  document.getElementById('btn-next').textContent      = t.next;
  document.querySelector('.btn-back').textContent      = t.back;
  document.querySelector('.btn-check').textContent     = t.check;

  ['html', 'js', 'python'].forEach(l => {
    const card = document.querySelector(`.lang-card[data-lang="${l}"]`);
    if (card) {
      card.querySelector('.lang-desc').textContent = t.cards[l].desc;
      card.querySelector('.lang-diff').textContent = t.cards[l].diff;
    }
  });
}

// ===== STATE =====
let currentLang  = null;
let currentLevel = 0;
let hintShown    = false;

// ===== NAVIGATION =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  showScreen('screen-home');
}

function startGame(lang) {
  currentLang  = lang;
  currentLevel = 0;
  loadLevel(currentLang, currentLevel);
  showScreen('screen-game');
}

function nextLevel() {
  currentLevel++;
  const levels = challenges[currentLang];
  if (currentLevel >= levels.length) {
    showAllDone();
  } else {
    loadLevel(currentLang, currentLevel);
    showScreen('screen-game');
  }
}

function showAllDone() {
  document.getElementById('victory-stars').textContent = '🏆';
  if (currentAppLang === 'fr') {
    document.getElementById('victory-sub').textContent = `Tu as terminé tous les ${challenges[currentLang].length} challenges ${currentLang.toUpperCase()} !`;
  } else {
    document.getElementById('victory-sub').textContent = `You completed all ${challenges[currentLang].length} ${currentLang.toUpperCase()} challenges!`;
  }
  document.getElementById('btn-next').style.display = 'none';
  showScreen('screen-victory');
}

// ===== LOAD LEVEL =====
function loadLevel(lang, level) {
  const data  = challenges[lang][level];
  const total = challenges[lang].length;
  hintShown   = false;

  const langNames = { html: 'HTML/CSS', js: 'JavaScript', python: 'Python' };
  document.getElementById('game-lang-label').textContent  = langNames[lang];
  document.getElementById('game-level-label').textContent = `Level ${level + 1} / ${total}`;
  document.getElementById('progress-bar').style.width     = `${(level / total) * 100}%`;

  document.getElementById('challenge-num').textContent   = `Challenge ${level + 1}`;
  document.getElementById('challenge-title').textContent = data.title;
  document.getElementById('challenge-desc').textContent  = data.desc;
  document.getElementById('editor-filename').textContent = data.filename;
  document.getElementById('code-editor').value           = data.starter;

  document.getElementById('hint-box').style.display = 'none';
  document.getElementById('hint-box').textContent   = '';

  document.getElementById('result-msg').textContent = '';
  document.getElementById('result-msg').className   = 'result-msg';

  document.getElementById('btn-next').style.display = '';

  const frame  = document.getElementById('preview-frame');
  const output = document.getElementById('output-box');

  if (data.preview) {
    frame.style.display  = 'block';
    output.style.display = 'none';
    frame.srcdoc         = '';
    document.getElementById('preview-header').textContent = 'Preview';
  } else {
    frame.style.display  = 'none';
    output.style.display = 'flex';
    output.textContent   = currentAppLang === 'fr'
      ? '// La sortie apparaîtra ici quand tu cliques sur Run'
      : '// Output will appear here when you click Run';
    document.getElementById('preview-header').textContent = 'Output';
  }
}

// ===== RUN CODE =====
function runCode() {
  const code = document.getElementById('code-editor').value;
  const data = challenges[currentLang][currentLevel];

  if (data.preview) {
    document.getElementById('preview-frame').srcdoc = code;
  } else {
    const output = document.getElementById('output-box');
    output.style.display       = 'flex';
    output.style.flexDirection = 'column';
    output.style.gap           = '2px';

    if (currentLang === 'js')          runJavaScript(code, output);
    else if (currentLang === 'python') simulatePython(code, output);
  }
}

function runJavaScript(code, output) {
  const logs = [];
  const origLog = console.log;
  console.log = (...args) => logs.push(args.join(' '));
  //console.log("test");


  try {
    eval(code);
    if (logs.length > 0) {
      output.innerHTML = logs.map(
        l => `<span style="color:green">${l}</span>`)
        .join('\n');
    } else {
      output.innerHTML = '// No output'; 
    }

  } catch (e) {
    output.innerHTML = `<span style="color:red">Erreur: ${e.message}</span>`;

  } finally {
    console.log = origLog;
  }

}

function simulatePython(code, output) {
  try {
    let jsCode = code
      .replace(/print\s*\(/g,         '__out__.push(String(')
      .replace(/\bTrue\b/g,           'true')
      .replace(/\bFalse\b/g,          'false')
      .replace(/\bNone\b/g,           'null')
      .replace(/str\(([^)]+)\)/g,     'String($1)')
      .replace(/#.*$/gm,              '');

    const __out__ = [];

    jsCode = jsCode.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*:/g,
      'for (let $1 = $2; $1 < $3; $1++) {');
    jsCode = jsCode.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:/g,
      'for (let $1 = 0; $1 < $2; $1++) {');
    jsCode = jsCode.replace(/for\s+(\w+)\s+in\s+(\w+)\s*:/g,   'for (let $1 of $2) {');
    jsCode = jsCode.replace(/elif\s+(.+?)\s*:/g,                '} else if ($1) {');
    jsCode = jsCode.replace(/if\s+(.+?)\s*:/g,                  '} if ($1) {');
    jsCode = jsCode.replace(/else\s*:/g,                        '} else {');
    jsCode = jsCode.replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g,  'function $1($2) {');
    jsCode = jsCode.replace(/^( {4}|\t)/gm, '');
    jsCode += '\n}}}}}';

    eval(jsCode);
    output.innerHTML = __out__.length
      ? __out__.map(l => `<span style="color:#a8e6cf">${escHtml(String(l))}</span>`).join('\n')
      : '<span style="color:#7070a0"># No output</span>';
  } catch(e) {
    const prints = [];
    const re = /print\s*\(\s*["'`]([^"'`]*)["'`]\s*\)/g;
    let m;
    while ((m = re.exec(code)) !== null) prints.push(m[1]);
    if (prints.length) {
      output.innerHTML = prints.map(l => `<span style="color:#a8e6cf">${escHtml(l)}</span>`).join('\n');
    } else {
      output.innerHTML = `<span style="color:#7070a0"># Run output shown here</span>`;
    }
  }
}

function checkAnswer() {
  const code      = document.getElementById('code-editor').value;
  const data      = challenges[currentLang][currentLevel];
  const resultMsg = document.getElementById('result-msg');

  runCode();

  if (data.check(code)) {
    resultMsg.textContent = currentAppLang === 'fr'
      ? '✓ Correct ! Bien joué ! 🎉'
      : '✓ Correct! Great work! 🎉';
    resultMsg.className = 'result-msg success';

    const total = challenges[currentLang].length;
    document.getElementById('progress-bar').style.width  = `${((currentLevel + 1) / total) * 100}%`;
    document.getElementById('victory-stars').textContent = hintShown ? '★★☆' : '★★★';
    document.getElementById('btn-next').style.display    = '';
    document.getElementById('victory-sub').textContent   = currentAppLang === 'fr'
      ? `Tu as résolu "${data.title}"`
      : `You solved "${data.title}"`;

    setTimeout(() => showScreen('screen-victory'), 600);
  } else {
    resultMsg.textContent = currentAppLang === 'fr'
      ? '✗ Pas tout à fait. Vérifie ton code et réessaie !'
      : '✗ Not quite right. Check your code and try again!';
    resultMsg.className = 'result-msg error';

    const editor = document.getElementById('code-editor');
    editor.style.animation = 'none';
    editor.offsetHeight;
    editor.style.animation = 'shake 0.4s ease';
  }
}

// ===== HINT =====
function showHint() {
  const data    = challenges[currentLang][currentLevel];
  const hintBox = document.getElementById('hint-box');
  hintBox.textContent   = '💡 ' + data.hint;
  hintBox.style.display = 'block';
  hintShown = true;
}

// ===== UTILS =====
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-8px); }
  40%     { transform: translateX(8px); }
  60%     { transform: translateX(-6px); }
  80%     { transform: translateX(6px); }
}`;
document.head.appendChild(shakeStyle);

// Tab key in editor
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end   = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
      }
    });
  }
});


(function() {
  const params = new URLSearchParams(window.location.search);
  const lang   = params.get('lang') || 'fr';
  currentAppLang = lang;

  if (lang !== 'fr') {

    const old = document.getElementById('levels-script');
    if (old) old.remove();

    const script  = document.createElement('script');
    script.id     = 'levels-script';
    script.src    = 'levels-en.js';
    script.onload = () => updateHomeText(lang);
    document.body.appendChild(script);
  } 
  
  
  else {

    updateHomeText('fr');
  }
})();