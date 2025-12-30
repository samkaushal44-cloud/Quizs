const questions = [
  {
    q: "Who was the first Prime Minister of India?",
    options: ["Gandhi", "Jawaharlal Nehru", "Patel", "Rajendra Prasad"],
    answer: 1,
    level: "GK / HISTORY"
  },
  {
    q: "Capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    answer: 1,
    level: "GK"
  }
];

let index = 0;
let coins = 0;
let timer = 10;
let interval;
let answered = false;

const qEl = document.getElementById("question");
const options = document.querySelectorAll(".option");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const timeEl = document.getElementById("time");
const bar = document.querySelector(".progress-bar");

function loadQuestion() {
  if (!questions.length) return;

  answered = false;
  clearInterval(interval);

  const q = questions[index % questions.length];

  qEl.innerText = q.q;
  levelEl.innerText = q.level;
  coinsEl.innerText = coins;

  options.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.className = "option";
    btn.disabled = false;
  });

  timer = 10;
  timeEl.innerText = timer + "s";
  bar.style.width = "100%";

  startTimer();
}

function startTimer() {
  interval = setInterval(() => {
    timer--;
    timeEl.innerText = timer + "s";
    bar.style.width = timer * 10 + "%";

    if (timer <= 0) {
      clearInterval(interval);
      showAnswer(-1);
    }
  }, 1000);
}

options.forEach((btn, i) => {
  btn.onclick = () => {
    if (answered) return;
    showAnswer(i);
  };
});

function showAnswer(selected) {
  answered = true;
  clearInterval(interval);

  const correct = questions[index % questions.length].answer;

  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("wrong");
  });

  if (selected === correct) coins += 10;

  setTimeout(() => {
    index++;
    loadQuestion();
  }, 1200);
}

loadQuestion();
