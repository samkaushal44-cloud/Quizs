let coins = 0;
let level = "GK / HISTORY";
let time = 10;
let timer;
let currentQuestion = null;
let usedQuestions = new Set();

const API_URL =
  "https://opentdb.com/api.php?amount=1&category=9&type=multiple";

document.getElementById("level").innerText = level;

function startTimer() {
  clearInterval(timer);
  time = 10;
  document.getElementById("time").innerText = time;
  document.getElementById("progress").style.width = "100%";

  timer = setInterval(() => {
    time--;
    document.getElementById("time").innerText = time;
    document.getElementById("progress").style.width = time * 10 + "%";

    if (time <= 0) {
      clearInterval(timer);
      showCorrect();
      setTimeout(loadQuestion, 1500);
    }
  }, 1000);
}

async function loadQuestion() {
  startTimer();

  document.getElementById("question").innerText = "Loading...";
  document.getElementById("options").innerHTML = "";

  let data, qText;

  do {
    const res = await fetch(API_URL);
    data = await res.json();
    qText = decode(data.results[0].question);
  } while (usedQuestions.has(qText));

  usedQuestions.add(qText);

  currentQuestion = {
    q: qText,
    answer: decode(data.results[0].correct_answer),
    options: shuffle([
      ...data.results[0].incorrect_answers.map(decode),
      decode(data.results[0].correct_answer)
    ])
  };

  document.getElementById("question").innerText = currentQuestion.q;

  currentQuestion.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(btn, opt);
    document.getElementById("options").appendChild(btn);
  });
}

function checkAnswer(btn, selected) {
  clearInterval(timer);

  document.querySelectorAll("#options button").forEach(b => {
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
  }

  setTimeout(loadQuestion, 1500);
}

function showCorrect() {
  document.querySelectorAll("#options button").forEach(b => {
    if (b.innerText === currentQuestion.answer) {
      b.classList.add("correct");
    }
    b.disabled = true;
  });
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function decode(text) {
  const t = document.createElement("textarea");
  t.innerHTML = text;
  return t.value;
}

// START
loadQuestion();
