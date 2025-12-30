let coins = 0;
let time = 10;
let timer = null;
let answered = false;
let currentCorrect = "";

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const progress = document.getElementById("progress");
const coinsEl = document.getElementById("coins");

async function loadQuestion() {
  // RESET
  answered = false;
  clearInterval(timer);
  optionsEl.innerHTML = "";
  questionEl.innerText = "Loading...";
  time = 10;
  timeEl.innerText = time;
  progress.style.width = "100%";

  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple"
    );
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      questionEl.innerText = "No question found, retrying...";
      setTimeout(loadQuestion, 1000);
      return;
    }

    const q = data.results[0];
    currentCorrect = q.correct_answer;

    questionEl.innerHTML = q.question;

    let answers = [...q.incorrect_answers, q.correct_answer];
    answers = shuffle(answers);

    answers.forEach(ans => {
      const btn = document.createElement("button");
      btn.innerHTML = ans;
      btn.onclick = () => selectAnswer(btn, ans);
      optionsEl.appendChild(btn);
    });

    startTimer();
  } catch (e) {
    questionEl.innerText = "Network error, retrying...";
    setTimeout(loadQuestion, 1500);
  }
}

function selectAnswer(btn, selected) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if (selected === currentCorrect) {
    btn.classList.add("correct");
    coins += 10;
    coinsEl.innerText = "Coins: " + coins;
  } else {
    btn.classList.add("wrong");
    buttons.forEach(b => {
      if (b.innerHTML === currentCorrect) {
        b.classList.add("correct");
      }
    });
  }

  setTimeout(loadQuestion, 2000);
}

function startTimer() {
  timer = setInterval(() => {
    time--;
    timeEl.innerText = time;
    progress.style.width = (time * 10) + "%";

    if (time <= 0) {
      clearInterval(timer);
      answered = true;

      // show correct answer
      const buttons = optionsEl.querySelectorAll("button");
      buttons.forEach(b => {
        b.disabled = true;
        if (b.innerHTML === currentCorrect) {
          b.classList.add("correct");
        }
      });

      setTimeout(loadQuestion, 2000);
    }
  }, 1000);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// START
loadQuestion();
