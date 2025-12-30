let coins = 0;
let timeLeft = 10;
let timer;
let answered = false;
let currentQuestion = null;

const questions = [
  {
    q: "Capital of India?",
    options: ["Mumbai","Delhi","Chennai","Kolkata"],
    answer: "Delhi",
    level: "GK"
  },
  {
    q: "Ashoka belonged to which dynasty?",
    options: ["Maurya","Gupta","Chola","Mughal"],
    answer: "Maurya",
    level: "History"
  },
  {
    q: "Father of Indian Constitution?",
    options: ["Gandhi","Ambedkar","Nehru","Patel"],
    answer: "Ambedkar",
    level: "GK"
  }
];

const qEl = document.getElementById("question");
const optionBtns = document.querySelectorAll(".option");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const timeEl = document.getElementById("time");
const bar = document.querySelector(".progress-bar");
const withdrawMsg = document.getElementById("withdrawMsg");

let index = 0;

function loadQuestion() {
  answered = false;
  clearInterval(timer);

  const q = questions[index % questions.length];
  currentQuestion = q;

  qEl.innerText = q.q;
  levelEl.innerText = q.level;

  optionBtns.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.className = "option";
    btn.disabled = false;
  });

  startTimer();
}

function startTimer() {
  timeLeft = 10;
  timeEl.innerText = timeLeft + "s";
  bar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft + "s";
    bar.style.width = (timeLeft * 10) + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      showCorrect();
      nextQuestion();
    }
  }, 1000);
}

optionBtns.forEach((btn) => {
  btn.onclick = () => {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    optionBtns.forEach(b => {
      b.disabled = true;
      if (b.innerText === currentQuestion.answer) {
        b.classList.add("correct");
      }
      if (b === btn && b.innerText !== currentQuestion.answer) {
        b.classList.add("wrong");
      }
    });

    if (btn.innerText === currentQuestion.answer) {
      coins += 10;
      coinsEl.innerText = coins;
    }

    nextQuestion();
  };
});

function showCorrect() {
  optionBtns.forEach(b => {
    if (b.innerText === currentQuestion.answer) {
      b.classList.add("correct");
    }
    b.disabled = true;
  });
}

function nextQuestion() {
  setTimeout(() => {
    index++;
    loadQuestion();
  }, 1500);
}

/* 💰 WITHDRAW LOGIC */
document.getElementById("withdrawBtn").onclick = () => {
  if (coins < 100) {
    withdrawMsg.innerText = "❌ Minimum 100 coins required";
    withdrawMsg.style.color = "red";
    return;
  }

  withdrawMsg.innerText = "✅ Withdraw Request Submitted (Demo)";
  withdrawMsg.style.color = "green";

  coins = 0;
  coinsEl.innerText = coins;
};

loadQuestion();
