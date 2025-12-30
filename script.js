let coins = 0;
let index = 0;
let quiz = [];

// 🔴 ONLINE RAW JSON LINK (same repo)
const JSON_URL =
"https://raw.githubusercontent.com/samkaushal44-cloud/Quizs/main/questions.json";

// Load questions
fetch(JSON_URL)
  .then(res => res.json())
  .then(data => {
    quiz = data;
    loadQuestion();
  })
  .catch(() => {
    document.getElementById("question").innerText =
      "Questions load nahi ho rahe";
  });

function loadQuestion() {
  if (index >= quiz.length) {
    index = 0; // unlimited loop
  }

  const q = quiz[index];
  document.getElementById("question").innerText = q.q;
  document.getElementById("A").innerText = q.options.A;
  document.getElementById("B").innerText = q.options.B;
  document.getElementById("C").innerText = q.options.C;
  document.getElementById("D").innerText = q.options.D;
  document.getElementById("level").innerText = "Level: " + q.level;
}

function checkAnswer(option) {
  const correct = quiz[index].ans;
  const btn = document.getElementById(option);

  if (option === correct) {
    // ✅ Correct animation
    btn.classList.add("correct");

    coins += quiz[index].reward;
    document.getElementById("coins").innerText = "Coins: " + coins;

    setTimeout(() => {
      btn.classList.remove("correct");
      index++;
      loadQuestion();
    }, 700);

  } else {
    // ❌ Wrong animation
    btn.classList.add("wrong");
    setTimeout(() => {
      btn.classList.remove("wrong");
    }, 500);
  }
}

function watchAd() {
  coins += 20;
  document.getElementById("coins").innerText = "Coins: " + coins;
  alert("📺 +20 Coins");
}
