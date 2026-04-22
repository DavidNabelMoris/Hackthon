// ===== CHALLENGES DATA =====

const challenges = {
  html: [
    {
      title: "Say Hello to the World!",
      desc: "Every programmer's first step. Write a big heading that says 'Hello World!' using an HTML tag. The tag for headings is <h1>.",
      hint: "A heading tag looks like: <h1>Your text here</h1>",
      filename: "index.html",
      starter: `<!-- Write your heading below! -->

`,
      check: (code) => /<h1[^>]*>\s*Hello\s*World\s*!?\s*<\/h1>/i.test(code),
      preview: true,
    },
    {
      title: "Painting with Color",
      desc: "Make a paragraph that says 'I love CSS!' and give it a red color using the style attribute.",
      hint: `Use: <p style="color: red;">Your text</p>`,
      filename: "index.html",
      starter: `<!-- Add a colored paragraph below -->

`,
      check: (code) => /<p[^>]*style[^>]*color\s*:\s*red[^>]*>.*I love CSS.*<\/p>/i.test(code),
      preview: true,
    },
    {
      title: "Link it Up!",
      desc: "Create a clickable link to https://google.com that displays the text 'Visit Google'. Links use the <a> tag.",
      hint: `<a href="URL">text to click</a>`,
      filename: "index.html",
      starter: `<!-- Create your link here -->

`,
      check: (code) => /<a[^>]*href=["']https?:\/\/google\.com["'][^>]*>.*Visit Google.*<\/a>/i.test(code),
      preview: true,
    },
    {
      title: "A Beautiful Button",
      desc: "Make a button that says 'Click me!'. When clicked, it should show an alert saying 'Hello!'",
      hint: `<button onclick="alert('Hello!')">Click me!</button>`,
      filename: "index.html",
      starter: `<!-- Your button here -->

`,
      check: (code) => /<button[^>]*onclick[^>]*>.*Click me.*<\/button>/i.test(code),
      preview: true,
    },
  ],

  js: [
    {
      title: "Your First Variable",
      desc: "Create a variable called 'name' and set it to your name. Then use console.log() to print: 'My name is [your name]'",
      hint: `let name = "Alice";\nconsole.log("My name is " + name);`,
      filename: "script.js",
      starter: `// Create your variable here
`,
      check: (code) => /let\s+name\s*=/.test(code) && /console\.log/.test(code),
      preview: false,
    },
    {
      title: "Simple Math",
      desc: "Create two variables: a = 10 and b = 5. Then print their sum, difference, and product using console.log.",
      hint: `let a = 10;\nlet b = 5;\nconsole.log(a + b); // sum`,
      filename: "script.js",
      starter: `// Define a and b, then log their sum, difference and product
`,
      check: (code) => /let\s+a\s*=\s*10/.test(code) && /let\s+b\s*=\s*5/.test(code) && (code.match(/console\.log/g) || []).length >= 3,
      preview: false,
    },
    {
      title: "If / Else",
      desc: "Write code that checks if a number is positive or negative. If the number is greater than 0, print 'Positive!', otherwise print 'Negative!'",
      hint: `let num = 7;\nif (num > 0) {\n  console.log("Positive!");\n} else {\n  console.log("Negative!");\n}`,
      filename: "script.js",
      starter: `let num = 7; // Try changing this number!

// Write your if/else here
`,
      check: (code) => /if\s*\(/.test(code) && /else/.test(code) && /console\.log/.test(code),
      preview: false,
    },
    {
      title: "Loop de Loop",
      desc: "Use a for loop to print the numbers 1 to 5 in the console. Each number on its own line.",
      hint: `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}`,
      filename: "script.js",
      starter: `// Write your for loop here
`,
      check: (code) => /for\s*\(/.test(code) && /console\.log/.test(code),
      preview: false,
    },
  ],

  python: [
    {
      title: "Print it out!",
      desc: "Python's version of Hello World is just one line! Use the print() function to display 'Hello, World!'",
      hint: `print("Hello, World!")`,
      filename: "main.py",
      starter: `# Write your print statement here
`,
      check: (code) => /print\s*\(\s*["']Hello,?\s*World!?["']\s*\)/i.test(code),
      preview: false,
    },
    {
      title: "Variables in Python",
      desc: "Create a variable called 'age' and set it to your age. Then print: 'I am X years old' (with your actual age).",
      hint: `age = 18\nprint("I am " + str(age) + " years old")`,
      filename: "main.py",
      starter: `# Your variable here
`,
      check: (code) => /age\s*=\s*\d+/.test(code) && /print\s*\(/.test(code),
      preview: false,
    },
    {
      title: "Make a List",
      desc: "Create a list called 'fruits' with 3 fruits. Then print the first fruit (index 0) and the last one (index 2 or -1).",
      hint: `fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])\nprint(fruits[-1])`,
      filename: "main.py",
      starter: `# Create your list of fruits

`,
      check: (code) => /\w+\s*=\s*\[/.test(code) && /print\s*\(/.test(code),
      preview: false,
    },
    {
      title: "A Python Loop",
      desc: "Use a for loop to print each number from 1 to 5. Tip: use range(1, 6) to generate those numbers.",
      hint: `for i in range(1, 6):\n    print(i)`,
      filename: "main.py",
      starter: `# Your for loop here
`,
      check: (code) => /for\s+\w+\s+in\s+range/.test(code) && /print\s*\(/.test(code),
      preview: false,
    },
  ],
};

// ===== STATE =====
let currentLang = null;
let currentLevel = 0;
let hintShown = false;

// ===== NAVIGATION =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  showScreen('screen-home');
}

function startGame(lang) {
  currentLang = lang;
  currentLevel = 0;
  loadLevel();
  showScreen('screen-game');
}

function nextLevel() {
  currentLevel++;
  const levels = challenges[currentLang];
  if (currentLevel >= levels.length) {
    // All done!
    showAllDone();
  } else {
    loadLevel();
    showScreen('screen-game');
  }
}

function showAllDone() {
  document.getElementById('victory-stars').textContent = '🏆';
  document.getElementById('victory-sub').textContent = `You completed all ${challenges[currentLang].length} ${currentLang.toUpperCase()} challenges!`;
  document.querySelector('.btn-next').style.display = 'none';
  showScreen('screen-victory');
}

// ===== LOAD LEVEL =====
function loadLevel() {
  const level = challenges[currentLang][currentLevel];
  const total = challenges[currentLang].length;
  hintShown = false;

  // Header
  const langNames = { html: 'HTML/CSS', js: 'JavaScript', python: 'Python' };
  document.getElementById('game-lang-label').textContent = langNames[currentLang];
  document.getElementById('game-level-label').textContent = `Level ${currentLevel + 1} / ${total}`;
  document.getElementById('progress-bar').style.width = `${((currentLevel) / total) * 100}%`;

  // Challenge info
  document.getElementById('challenge-num').textContent = `Challenge ${currentLevel + 1}`;
  document.getElementById('challenge-title').textContent = level.title;
  document.getElementById('challenge-desc').textContent = level.desc;
  document.getElementById('editor-filename').textContent = level.filename;

  // Editor
  document.getElementById('code-editor').value = level.starter;

  // Hint
  document.getElementById('hint-box').style.display = 'none';
  document.getElementById('hint-box').textContent = '';

  // Result
  document.getElementById('result-msg').textContent = '';
  document.getElementById('result-msg').className = 'result-msg';

  // Preview vs output
  const frame = document.getElementById('preview-frame');
  const output = document.getElementById('output-box');
  if (level.preview) {
    frame.style.display = 'block';
    output.style.display = 'none';
    frame.srcdoc = '';
    document.querySelector('.preview-header').textContent = 'Preview';
  } else {
    frame.style.display = 'none';
    output.style.display = 'flex';
    output.textContent = '// Output will appear here when you click Run';
    document.querySelector('.preview-header').textContent = 'Output';
  }
}

// ===== RUN CODE =====
function runCode() {
  const code = document.getElementById('code-editor').value;
  const level = challenges[currentLang][currentLevel];

  if (level.preview) {
    // HTML preview
    document.getElementById('preview-frame').srcdoc = code;
  } else {
    // Simulate JS/Python output
    const output = document.getElementById('output-box');
    output.style.display = 'flex';
    output.style.flexDirection = 'column';
    output.style.gap = '2px';

    if (currentLang === 'js') {
      runJavaScript(code, output);
    } else if (currentLang === 'python') {
      simulatePython(code, output);
    }
  }
}

function runJavaScript(code, output) {
  const logs = [];
  const origLog = console.log;
  console.log = (...args) => logs.push(args.map(String).join(' '));

  try {
    eval(code);
    output.innerHTML = logs.length
      ? logs.map(l => `<span style="color:#a8e6cf">${escHtml(l)}</span>`).join('\n')
      : '<span style="color:#7070a0">// No output</span>';
  } catch (e) {
    output.innerHTML = `<span style="color:#ff6b6b">Error: ${escHtml(e.message)}</span>`;
  } finally {
    console.log = origLog;
  }
}

function simulatePython(code, output) {
  // Simple Python output simulation
  const lines = code.split('\n');
  const results = [];

  // Extract print statements
  const printRegex = /print\s*\(\s*(.*?)\s*\)/g;
  let match;
  const fullCode = code;

  // Try to simulate basic python output
  try {
    // Convert simple python to JS for simulation
    let jsCode = code
      .replace(/print\s*\(/g, '__out__.push(String(')
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/str\(([^)]+)\)/g, 'String($1)')
      .replace(/#.*$/gm, '');

    const __out__ = [];
    // Handle for i in range(a, b):
    jsCode = jsCode.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*:/g,
      'for (let $1 = $2; $1 < $3; $1++) {');
    jsCode = jsCode.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:/g,
      'for (let $1 = 0; $1 < $2; $1++) {');
    // Handle for x in list:
    jsCode = jsCode.replace(/for\s+(\w+)\s+in\s+(\w+)\s*:/g,
      'for (let $1 of $2) {');
    // Convert indentation blocks (4 spaces → braces, simplified)
    jsCode = jsCode.replace(/^( {4}|\t)/gm, '');
    // Close blocks (very simplified)
    jsCode += '\n}}}}}';

    eval(jsCode);
    output.innerHTML = __out__.length
      ? __out__.map(l => `<span style="color:#a8e6cf">${escHtml(String(l))}</span>`).join('\n')
      : '<span style="color:#7070a0"># No output</span>';
  } catch(e) {
    // fallback: just extract print content via regex
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

// ===== CHECK ANSWER =====
function checkAnswer() {
  const code = document.getElementById('code-editor').value;
  const level = challenges[currentLang][currentLevel];
  const resultMsg = document.getElementById('result-msg');

  // Run first
  runCode();

  if (level.check(code)) {
    resultMsg.textContent = '✓ Correct! Great work! 🎉';
    resultMsg.className = 'result-msg success';

    // Update progress
    const total = challenges[currentLang].length;
    document.getElementById('progress-bar').style.width = `${((currentLevel + 1) / total) * 100}%`;

    // Show victory after short delay
    setTimeout(() => {
      document.getElementById('victory-sub').textContent = `You solved "${level.title}"`;
      document.getElementById('victory-stars').textContent = hintShown ? '★★☆' : '★★★';
      document.querySelector('.btn-next').style.display = '';
      showScreen('screen-victory');
    }, 800);
  } else {
    resultMsg.textContent = '✗ Not quite right. Check your code and try again!';
    resultMsg.className = 'result-msg error';
    // Shake the editor
    const editor = document.getElementById('code-editor');
    editor.style.animation = 'none';
    editor.offsetHeight;
    editor.style.animation = 'shake 0.4s ease';
  }
}

// ===== HINT =====
function showHint() {
  const level = challenges[currentLang][currentLevel];
  const hintBox = document.getElementById('hint-box');
  hintBox.textContent = '💡 ' + level.hint;
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
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
`;
document.head.appendChild(shakeStyle);

// Tab key in editor
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
      }
    });
  }
});