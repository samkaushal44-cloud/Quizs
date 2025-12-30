let coins = 0;
let index = 0;
let quiz = [];

// 🔗 JSON
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

  document.getElementById("question").innerText = q.q;
  document.getElementById("A").innerText = q.options.A;
  document.getElementById("B").innerText = q.options.B;
  document.getElementById("C").innerText = q.options.C;
  document.getElementById("D").innerText = q.options.D;
  document.getElementById("level").innerText = "Level: " + q.level;
}

function resetButtons() {
  ["A","B","C","D"].forEach(id => {
    document.getElementById(id).classList.remove("correct","wrong");
  });
}

/* ✅ FINAL GUARANTEED CELEBRATION */
function checkAnswer(option) {
  const btn = document.getElementById(option);
  const app = document.querySelector(".app");

  resetButtons();
  void btn.offsetWidth;

  if (option === quiz[index].ans) {
    btn.classList.add("correct");

    coins += quiz[index].reward;
    document.getElementById("coins").innerText = "Coins: " + coins;

    // 🎉 APP FLASH (WORKING 100%)
    app.classList.add("celebrate");
    setTimeout(() => app.classList.remove("celebrate"), 500);

    setTimeout(() => {
      resetButtons();
      index++;
      loadQuestion();
    }, 700);

  } else {
    btn.classList.add("wrong");
  }
}

function watchAd() {
  coins += 20;
  document.getElementById("coins").innerText = "Coins: " + coins;
  alert("+20 Coins");
}
