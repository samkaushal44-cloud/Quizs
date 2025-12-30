let coins = 0;
let time = 10;
let timer;
let currentQuestion = null;
let answered = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const coinsEl = document.getElementById("coins");
const timeText = document.getElementById("timeText");
const progress = document.getElementById("progress");

/* ---------- UTIL ---------- */
function decodeHTML(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

/* ---------- BUTTONS ---------- */
document.getElementById("watchAd").onclick = () => {
  coins += 20;
  updateCoins();
  alert("🎉 You earned 20 coins!");
};

document.getElementById("withdraw").onclick = () => {
  if (coins < 100) {
    alert("❌ Minimum 100 coins required");
  } else {
    alert("✅ Withdraw request sent!");
    coins = 0;
    updateCoins();
  }
};

function updateCoins() {
  coinsEl.innerText = "Coins: " + coins;
}

/* ---------- QUESTION LOADER ---------- */
async function loadQuestion() {
  answered = false;
  optionsEl.innerHTML = "";
  questionEl.innerText = "Loading...";

  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=1&category=9&type=multiple"
    );
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      throw "Empty API";
    }

    const q = data.results[0];

    currentQuestion = {
      question: decodeHTML(q.question),
      correct: decodeHTML(q.correct_answer),
      options: shuffle([
        ...q.incorrect_answers.map(decodeHTML),
        decodeHTML(q.correct_answer)
      ])
    };

    renderQuestion();
  } catch (e) {
    console.warn("API failed, using fallback");

    // 🔁 FALLBACK QUESTION
    currentQuestion = {
      question: "Capital of India?",
      correct: "New Delhi",
      options: shuffle(["New Delhi", "Mumbai", "Chennai", "Kolkata"])
    };

    renderQuestion();
  }
}

/* ---------- RENDER ---------- */
function renderQuestion() {
  questionEl.innerText = currentQuestion.question;
  optionsEl.innerHTML = "";

  currentQuestion.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(opt, btn);
    optionsEl.appendChild(btn);
  });

  startTimer();
}

/* ---------- ANSWER ---------- */
function selectAnswer(ans, btn) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(b => b.disabled = true);

  if (ans === currentQuestion.correct) {
    btn.classList.add("correct");
    coins += 10;
    updateCoins();
  } else {
    btn.classList.add("wrong");
    buttons.forEach(b => {
      if (b.innerText === currentQuestion.correct) {
        b.classList.add("correct");
      }
    });
  }

  setTimeout(loadQuestion, 2000);
}

/* ---------- TIMER ---------- */
function startTimer() {
  time = 10;
  progress.style.width = "100%";
  timeText.innerText = "Time: 10s";

  timer = setInterval(() => {
    time--;
    timeText.innerText = "Time: " + time + "s";
    progress.style.width = time * 10 + "%";

    if (time <= 0) {
      clearInterval(timer);
      answered = true;
      loadQuestion();
    }
  }, 1000);
}

/* ---------- HELPERS ---------- */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ---------- START ---------- */
updateCoins();
loadQuestion();
