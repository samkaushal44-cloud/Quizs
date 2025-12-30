let coins = 0;
let level = "Easy";
let time = 10;
let timer;
let currentQuestion = null;

const questions = [
  {
    q: "Who was the first Prime Minister of India?",
    options: ["Gandhi","Jawaharlal Nehru","Patel","Rajendra Prasad"],
    answer: "Jawaharlal Nehru"
  },
  {
    q: "In ancient Greece, source of wise counsel?",
    options: ["Weasel","Titan","Oracle","Archon"],
    answer: "Oracle"
  },
  {
    q: "Capital of India?",
    options: ["Mumbai","Delhi","Chennai","Kolkata"],
    answer: "Delhi"
  }
];

function setLevel() {
  if (coins >= 100) level = "Hard";
  else if (coins >= 50) level = "Medium";
  else level = "Easy";
  document.getElementById("level").innerText = level;
}

function startTimer() {
  clearInterval(timer);
  time = 10;
  document.getElementById("time").innerText = time;
  document.getElementById("progress").style.width = "100%";

  timer = setInterval(() => {
    time--;
    document.getElementById("time").innerText = time;
    document.getElementById("progress").style.width = (time*10) + "%";

    if (time <= 0) {
      clearInterval(timer);
      showCorrect();
      setTimeout(loadQuestion, 2000);
    }
  }, 1000);
}

function loadQuestion() {
  startTimer();
  currentQuestion = questions[Math.floor(Math.random()*questions.length)];

  document.getElementById("question").innerText = currentQuestion.q;
  const box = document.getElementById("options");
  box.innerHTML = "";

  currentQuestion.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(btn, opt);
    box.appendChild(btn);
  });
}

function checkAnswer(btn, selected) {
  clearInterval(timer);
  const buttons = document.querySelectorAll("#options button");

  buttons.forEach(b => {
    if (b.innerText === currentQuestion.answer) {
      b.classList.add("correct");
    }
    if (b.innerText === selected && selected !== currentQuestion.answer) {
      b.classList.add("wrong");
    }
    b.disabled = true;
  });

  if (selected === currentQuestion.answer) {
    coins += 10;
    document.getElementById("coins").innerText = coins;
    setLevel();
  }

  setTimeout(loadQuestion, 2000);
}

function showCorrect() {
  document.querySelectorAll("#options button").forEach(b => {
    if (b.innerText === currentQuestion.answer) {
      b.classList.add("correct");
    }
    b.disabled = true;
  });
}

loadQuestion();
