/************* QUESTIONS (INDIA GK – SHORT) *************/
const questions = [
  {
    q: "Capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    answer: 0
  },
  {
    q: "First Prime Minister of India?",
    options: ["Gandhi", "Jawaharlal Nehru", "Patel", "Rajendra Prasad"],
    answer: 1
  },
  {
    q: "National Animal of India?",
    options: ["Lion", "Tiger", "Elephant", "Leopard"],
    answer: 1
  },
  {
    q: "Who wrote the National Anthem?",
    options: ["Tagore", "Premchand", "Bankim", "Nehru"],
    answer: 0
  },
  {
    q: "National Bird of India?",
    options: ["Peacock", "Eagle", "Sparrow", "Crow"],
    answer: 0
  }
];

/************* STATE *************/
let index = 0;
let time = 10;
let timer = null;
let coins = 0;
let answered = false;

/************* ELEMENTS *************/
const qEl = document.getElementById("question");
const optBtns = document.querySelectorAll(".option");
const timeEl = document.getElementById("time");
const bar = document.getElementById("progress-bar");
const coinEl = document.getElementById("coins");

/************* SHUFFLE QUESTIONS *************/
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
shuffle(questions);

/************* LOAD QUESTION *************/
function loadQuestion() {
  clearInterval(timer);
  answered = false;
  time = 10;
  timeEl.innerText = time;
  bar.style.width = "100%";

  optBtns.forEach(btn => {
    btn.className = "option";
    btn.disabled = false;
  });

  if (index >= questions.length) {
    shuffle(questions);
    index = 0;
  }

  const q = questions[index];
  qEl.innerText = q.q;

  optBtns.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.onclick = () => selectAnswer(i);
  });

  startTimer();
}

/************* TIMER *************/
function startTimer() {
  timer = setInterval(() => {
    time--;
    timeEl.innerText = time;
    bar.style.width = time * 10 + "%";

    if (time <= 0) {
      clearInterval(timer);
      showCorrect();
      setTimeout(nextQuestion, 1200);
    }
  }, 1000);
}

/************* ANSWER CLICK *************/
function selectAnswer(i) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].answer;

  optBtns.forEach(btn => btn.disabled = true);

  if (i === correct) {
    optBtns[i].classList.add("correct");
    coins += 10;
    coinEl.innerText = "Coins: " + coins;
  } else {
    optBtns[i].classList.add("wrong");
    optBtns[correct].classList.add("correct");
  }

  setTimeout(nextQuestion, 1200);
}

/************* SHOW CORRECT WHEN TIME UP *************/
function showCorrect() {
  const correct = questions[index].answer;
  optBtns[correct].classList.add("correct");
}

/************* NEXT *************/
function nextQuestion() {
  index++;
  loadQuestion();
}

/************* START *************/
loadQuestion();
