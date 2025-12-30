let coins = 0;
let index = 0;
let quiz = [];

// ✅ CORRECT RAW JSON LINK
const JSON_URL =
"https://raw.githubusercontent.com/samkaushal44-cloud/Quizs/main/questions.json";

// Load questions from online JSON
fetch(JSON_URL)
  .then(res => res.json())
  .then(data => {
    quiz = data;
    loadQuestion();
  })
  .catch(err => {
    document.getElementById("question").innerText =
      "Questions load nahi ho rahe";
    console.log(err);
  });

function loadQuestion() {
  if (index >= quiz.length) {
    index = 0; // unlimited loop
  }

  document.getElementById("question").innerText = quiz[index].q;
  document.getElementById("A").innerText = quiz[index].options.A;
  document.getElementById("B").innerText = quiz[index].options.B;
  document.getElementById("C").innerText = quiz[index].options.C;
  document.getElementById("D").innerText = quiz[index].options.D;
  document.getElementById("level").innerText =
    "Level: " + quiz[index].level;
}

function checkAnswer(option) {
  if (option === quiz[index].ans) {
    coins += quiz[index].reward;
    document.getElementById("coins").innerText =
      "Coins: " + coins;

    // correct → auto next
    setTimeout(() => {
      index++;
      loadQuestion();
    }, 700);
  } else {
    alert("❌ Wrong Answer");
  }
}
