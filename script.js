const questions = [
  {
    q: "India ki rajdhani kya hai?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    answer: 0,
    level: "GK"
  },
  {
    q: "Ashoka kis vansh se tha?",
    options: ["Maurya", "Gupta", "Kushan", "Chola"],
    answer: 0,
    level: "History"
  },
  {
    q: "UNO ka headquarters kahan hai?",
    options: ["Paris", "London", "New York", "Geneva"],
    answer: 2,
    level: "GK"
  },
  {
    q: "Harappa sabhyata kis nadi ke kinare thi?",
    options: ["Ganga", "Yamuna", "Indus", "Godavari"],
    answer: 2,
    level: "History"
  }
];

let index = 0;
let coins = 0;
let timer = 10;
let interval;
let locked = false;

const qEl = document.getElementById("question");
const opts = document.querySelectorAll(".option");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const timeEl = document.getElementById("time");
const bar = document.querySelector(".progress-bar");

function loadQuestion() {
  locked = false;
  clearInterval(interval);

  const q = questions[index % questions.length];

  qEl.innerText = q.q;
  levelEl.innerText = q.level;
  coinsEl.innerText = coins;

  opts.forEach((btn, i) => {
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
    bar.style.width = (timer * 10) + "%";

    if (timer <= 0) {
      clearInterval(interval);
      showAnswer(-1);
    }
  }, 1000);
}

opts.forEach((btn, i) => {
  btn.onclick = () => {
    if (locked) return;
    showAnswer(i);
  };
});

function showAnswer(selected) {
  locked = true;
  clearInterval(interval);

  const correct = questions[index % questions.length].answer;

  opts.forEach((btn, i) => {
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
