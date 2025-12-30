let coins = 0;
let index = 0;
let quiz = [];

const JSON_URL =
"https://raw.githubusercontent.com/samkaushal44-cloud/Quizs/main/questions.json";

fetch(JSON_URL)
  .then(res => res.json())
  .then(data => {
    quiz = data;
    loadQuestion();
  });

function loadQuestion() {
  if (index >= quiz.length) index = 0;
  const q = quiz[index];

  question.innerText = q.q;
  A.innerText = q.options.A;
  B.innerText = q.options.B;
  C.innerText = q.options.C;
  D.innerText = q.options.D;
  level.innerText = "Level: " + q.level;
}

/* 🔁 RESET BUTTON STATES */
function resetButtons() {
  ["A","B","C","D"].forEach(id => {
    document.getElementById(id).classList.remove("correct","wrong");
  });
}

/* 🎉 CONFETTI GENERATOR */
function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      ["#22c55e","#6366f1","#f59e0b","#ef4444","#06b6d4"]
      [Math.floor(Math.random() * 5)];

    confetti.style.animationDuration =
      Math.random() * 0.5 + 0.8 + "s";

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 1500);
  }
}

/* ✅ CHECK ANSWER */
function checkAnswer(option) {
  const btn = document.getElementById(option);
  resetButtons();
  void btn.offsetWidth;

  if (option === quiz[index].ans) {
    btn.classList.add("correct");

    coins += quiz[index].reward;
    coinsEl.innerText = "Coins: " + coins;

    // 💰 coin glow
    coinsEl.classList.add("coin-glow");
    setTimeout(() => coinsEl.classList.remove("coin-glow"), 800);

    // 🎉 confetti
    launchConfetti();

    // auto next
    setTimeout(() => {
      resetButtons();
      index++;
      loadQuestion();
    }, 900);

  } else {
    btn.classList.add("wrong");
  }
}

/* 📺 AD */
function watchAd() {
  coins += 20;
  coinsEl.innerText = "Coins: " + coins;
  coinsEl.classList.add("coin-glow");
  setTimeout(() => coinsEl.classList.remove("coin-glow"), 800);
  alert("+20 Coins");
}

const coinsEl = document.getElementById("coins");
