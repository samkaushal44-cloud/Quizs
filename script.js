const questions = [
  {
    q: "Who was the first Prime Minister of India?",
    options: ["Gandhi", "Jawaharlal Nehru", "Patel", "Rajendra Prasad"],
    answer: 1,
    level: "GK / HISTORY"
  },
  {
    q: "Ashoka belonged to which dynasty?",
    options: ["Maurya", "Gupta", "Chola", "Mughal"],
    answer: 0,
    level: "HISTORY"
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
let timeLeft = 10;
let timerInterval = null;
let answered = false;

const qEl = document.getElementById("question");
const options = document.querySelectorAll(".option");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const timeEl = document.getElementById("time");
const bar = document.querySelector(".progress-bar");

function loadQuestion() {
  answered = false;
  clearInterval(timerInterval);

  const q = questions[index % questions.length];

  qEl.innerText = q.q;
  levelEl.innerText = q.level;
  coinsEl.innerText = coins;

  options.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.className = "option";
    btn.disabled = false;
  });

  timeLeft = 10;
  timeEl.innerText = timeLeft + "s";
  bar.style.width = "100%";

  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft + "s";
    bar.style.width = (timeLeft * 10) + "%";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showAnswer(-1); // time up
    }
  }, 1000);
}

options.forEach((btn, i) => {
  btn.onclick = () => {
    if (answered) return;
    showAnswer(i);
  };
});

function showAnswer(selectedIndex) {
  answered = true;
  clearInterval(timerInterval);

  const correctIndex = questions[index % questions.length].answer;

  options.forEach((btn, i) => {
    btn.disabled = true;

    if (i === correctIndex) {
      btn.classList.add("correct");
    }

    if (i === selectedIndex && i !== correctIndex) {
      btn.classList.add("wrong");
    }
  });

  if (selectedIndex === correctIndex) {
    coins += 10;
    coinsEl.innerText = coins;
  }

  // 🔥 VERY IMPORTANT — ALWAYS GO NEXT
  setTimeout(() => {
    index++;
    loadQuestion();
