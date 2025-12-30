const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const coinEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const timeText = document.getElementById("time");
const progressBar = document.getElementById("progress-bar");

let questions = [
  {
    q: "In ancient Greece, what was considered a source of wise counsel?",
    options: ["Weasel", "Titan", "Oracle", "Archon"],
    answer: "Oracle"
  },
  {
    q: "Who was the first Prime Minister of India?",
    options: ["Gandhi", "Jawaharlal Nehru", "Patel", "Rajendra Prasad"],
    answer: "Jawaharlal Nehru"
  },
  {
    q: "Capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    answer: "Delhi"
  }
];

let index = 0;
let coins = 0;
let time = 10;
let timer;
let locked = false;

coinEl.innerText = coins;
levelEl.innerText = "GK / HISTORY";

function loadQuestion() {
  locked = false;
  clearInterval(timer);
  time = 10;
  timeText.innerText = time + "s";
  progressBar.style.width = "100%";

  if (index >= questions.length) {
    index = 0;
    shuffle(questions);
  }

  const q = questions[index];
  questionEl.innerText = q.q;
  optionsEl.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;

    btn.onclick = () => selectAnswer(btn, q.answer);
    optionsEl.appendChild(btn);
  });

  startTimer(q.answer);
}

function startTimer(correct) {
  timer = setInterval(() => {
    time--;
    timeText.innerText = time + "s";
    progressBar.style.width = (time * 10) + "%";

    if (time <= 0) {
      clearInterval(timer);
      showCorrect(correct);
      setTimeout(nextQuestion, 1500);
    }
  }, 1000);
}

function selectAnswer(btn, correct) {
  if (locked) return;
  locked = true;
  clearInterval(timer);

  const buttons = document.querySelectorAll(".option");

  buttons.forEach(b => {
    if (b.innerText === correct) {
      b.style.background = "#2ecc71";
    }
    b.disabled = true;
  });

  if (btn.innerText === correct) {
    btn.style.background = "#2ecc71";
    coins += 10;
    coinEl.innerText = coins;
  } else {
    btn.style.background = "#e74c3c";
  }

  setTimeout(nextQuestion, 1500);
}

function showCorrect(correct) {
  const buttons = document.querySelectorAll(".option");
  buttons.forEach(b => {
    if (b.innerText === correct) {
      b.style.background = "#2ecc71";
    }
    b.disabled = true;
  });
}

function nextQuestion() {
  index++;
  loadQuestion();
}

function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}

/* START */
shuffle(questions);
loadQuestion();
