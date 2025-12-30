let coins = 0;
let index = 0;
let answered = false;
let timer;
let timeLeft = 10;

const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const qEl = document.getElementById("question");
const timeEl = document.getElementById("time");
const bar = document.querySelector(".progress-bar");
const options = document.querySelectorAll(".option");

/* 🔁 SAFE INDIA GK QUESTIONS (fallback) */
const fallbackQuestions = [
  {
    q: "Capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    answer: "Delhi",
    level: "GK"
  },
  {
    q: "First Prime Minister of India?",
    options: ["Gandhi", "Nehru", "Patel", "Rajendra Prasad"],
    answer: "Nehru",
    level: "History"
  },
  {
    q: "Who wrote Ramayana?",
    options: ["Tulsidas", "Valmiki", "Kalidas", "Ved Vyas"],
    answer: "Valmiki",
    level: "History"
  }
];

let questions = fallbackQuestions;

/* 🔥 LOAD QUESTION */
function loadQuestion() {
  answered = false;
  clearInterval(timer);

  if (!questions.length) {
    qEl.innerText = "No questions available";
    return;
  }

  const q = questions[index % questions.length];

  qEl.innerText = q.q;
  levelEl.innerText = q.level;

  options.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.className = "option";
    btn.disabled = false;
  });

  startTimer(q.answer);
}

/* ⏱ TIMER */
function startTimer(correctAnswer) {
  timeLeft = 10;
  timeEl.innerText = timeLeft + "s";
  bar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft + "s";
    bar.style.width = (timeLeft * 10) + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      revealAnswer(correctAnswer);
      goNext();
    }
  }, 1000);
}

/* 🧠 CLICK HANDLER */
options.forEach(btn => {
  btn.onclick = () => {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    const correct = questions[index % questions.length].answer;

    options.forEach(b => {
      b.disabled = true;
      if (b.innerText === correct) b.classList.add("correct");
      if (b === btn && b.innerText !== correct) b.classList.add("wrong");
    });

    if (btn.innerText === correct) {
      coins += 10;
      coinsEl.innerText = coins;
    }

    goNext();
  };
});

/* ✅ SHOW CORRECT */
function revealAnswer(correct) {
  options.forEach(b => {
    b.disabled = true;
    if (b.innerText === correct) b.classList.add("correct");
  });
}

/* 🔁 NEXT QUESTION (ANTI-STUCK) */
function goNext() {
  setTimeout(() => {
    index++;
    loadQuestion();
  }, 1500);
}

/* 🚀 START */
