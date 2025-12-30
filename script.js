const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const coinsEl = document.getElementById("coins");
const progressEl = document.getElementById("progress");

let questions = [];
let index = 0;
let coins = 0;
let timer;
let timeLeft = 10;
let answered = false;

// 🔥 LOAD QUESTIONS FROM JSON (API STYLE)
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = shuffle(data);
    loadQuestion();
  })
  .catch(() => {
    questionEl.innerText = "No question found";
  });

function loadQuestion() {
  if (!questions.length) return;

  clearInterval(timer);
  answered = false;
  timeLeft = 10;
  progressEl.style.width = "100%";

  const q = questions[index];
  questionEl.innerText = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(i, btn);
    optionsEl.appendChild(btn);
  });

  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  progressEl.style.width = (timeLeft * 10) + "%";

  if (timeLeft <= 0) {
    clearInterval(timer);
    showCorrect();
    nextQuestion();
  }
}

function selectAnswer(i, btn) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].answer;
  const buttons = optionsEl.querySelectorAll("button");

  if (i === correct) {
    btn.classList.add("correct");
    coins += 10;
    coinsEl.innerText = "Coins: " + coins;
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  setTimeout(nextQuestion, 1500);
}

function showCorrect() {
  const buttons = optionsEl.querySelectorAll("button");
  buttons[questions[index].answer].classList.add("correct");
}

function nextQuestion() {
  index++;
  if (index >= questions.length) {
    index = 0;
    questions = shuffle(questions);
  }
  loadQuestion();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
