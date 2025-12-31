/************ CONFIG ************/
const LIMIT = 10;          // 5 या 10 questions के बाद ad
const TIME_PER_Q = 10;     // seconds
const COIN_PER_Q = 10;
const AD_REWARD = 20;

/************ STATE ************/
let questions = [];
let index = 0;
let solvedCount = 0;
let coins = 0;
let timer = null;
let timeLeft = TIME_PER_Q;
let answered = false;

/************ ELEMENTS ************/
const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const coinEl = document.getElementById("coins");
const action = document.getElementById("action");

/************ INIT ************/
loadQuestions();

/************ API ************/
async function loadQuestions() {
  try {
    qEl.innerText = "Loading...";
    optEl.innerHTML = "";
    action.innerHTML = "";

    // 🔥 API (GK questions)
    const res = await fetch(
      "https://opentdb.com/api.php?amount=20&category=9&type=multiple"
    );
    const data = await res.json();

    questions = data.results.map(q => {
      let opts = [...q.incorrect_answers, q.correct_answer];
      opts.sort(() => Math.random() - 0.5);
      return {
        q: decode(q.question),
        o: opts.map(decode),
        a: opts.indexOf(q.correct_answer)
      };
    });

    index = 0;
    solvedCount = 0;
    showQuestion();

  } catch (e) {
    qEl.innerText = "Error loading question";
  }
}

/************ QUESTION ************/
function showQuestion() {

  // ✅ 10 questions complete → AD
  if (solvedCount >= LIMIT) {
    showFinish();
    return;
  }

  if (index >= questions.length) {
    loadQuestions();
    return;
  }

  answered = false;
  resetTimer();

  const q = questions[index];
  qEl.innerText = q.q;
  optEl.innerHTML = "";
  action.innerHTML = "";

  q.o.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.innerText = opt;
    b.onclick = () => checkAnswer(i, b);
    optEl.appendChild(b);
  });

  startTimer();
}

/************ ANSWER ************/
function checkAnswer(i, btn) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].a;
  const buttons = document.querySelectorAll(".option");

  buttons[correct].classList.add("correct");

  if (i === correct) {
    btn.classList.add("correct");
    coins += COIN_PER_Q;
  } else {
    btn.classList.add("wrong");
  }

  coinEl.innerText = coins;

  solvedCount++;
  index++;

  setTimeout(showQuestion, 1200);
}

/************ TIMER ************/
function startTimer() {
  timeLeft = TIME_PER_Q;
  timeEl.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!answered) {
        answered = true;
        solvedCount++;
        index++;
        setTimeout(showQuestion, 800);
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = TIME_PER_Q;
  timeEl.innerText = timeLeft;
}

/************ FINISH + ADS ************/
function showFinish() {
  clearInterval(timer);
  qEl.innerText = "Questions Finished!";
  optEl.innerHTML = "";

  action.innerHTML = `
    <button class="ad-btn" onclick="watchAd()">📺 Watch Ad & Get Coins</button>
    <button class="withdraw-btn" onclick="withdraw()">💰 Withdraw</button>
    <p>Minimum Withdraw: 100 Coins</p>
  `;
}

/************ AD ************/
function watchAd() {
  qEl.innerText = "Watching Ad...";
  optEl.innerHTML = "";
  action.innerHTML = "<p>Ad playing... 5s</p>";

  setTimeout(() => {
    coins += AD_REWARD;
    coinEl.innerText = coins;
    solvedCount = 0;
    index = 0;
    showQuestion();
  }, 5000);
}

/************ WITHDRAW ************/
function withdraw() {
  if (coins < 100) {
    alert("Minimum 100 coins required");
    return;
  }
  alert("Withdraw request submitted (demo)");
  coins = 0;
  coinEl.innerText = coins;
}

/************ UTILS ************/
function decode(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
