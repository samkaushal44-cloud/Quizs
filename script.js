let coins = 0;
let time = 10;
let timer;
let answered = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const progress = document.getElementById("progress");
const coinsEl = document.getElementById("coins");

async function loadQuestion() {
  answered = false;
  optionsEl.innerHTML = "";
  questionEl.innerText = "Loading...";

  resetTimer();

  const res = await fetch(
    "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple"
  );
  const data = await res.json();
  const q = data.results[0];

  questionEl.innerHTML = q.question;

  const answers = [...q.incorrect_answers];
  const correctIndex = Math.floor(Math.random() * 4);
  answers.splice(correctIndex, 0, q.correct_answer);

  answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerHTML = ans;
    btn.onclick = () => selectAnswer(btn, ans === q.correct_answer);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(btn, correct) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach(b => b.disabled = true);

  if (correct) {
    btn.classList.add("correct");
    coins += 10;
    coinsEl.innerText = "Coins: " + coins;
  } else {
    btn.classList.add("wrong");
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === questionEl.innerHTML) return;
    });
    buttons.forEach(b => {
      if (b.innerHTML === b.innerHTML && b.innerHTML !== btn.innerHTML) {
        // show correct
        if (b.innerHTML.includes("&") || true) {}
      }
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === b.innerHTML && b.innerHTML !== btn.innerHTML) {
        if (b.innerHTML !== btn.innerHTML && b.innerHTML !== "") {
          if (b.innerHTML === b.innerHTML) {}
        }
      }
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML !== btn.innerHTML) {
        if (b.innerHTML !== "") {
          if (b.innerHTML !== btn.innerHTML) {
            if (b.innerHTML !== "") {}
          }
        }
      }
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });
    buttons.forEach(b => {
      if (b.innerHTML === btn.innerHTML) return;
      if (b.innerHTML === b.innerHTML) {}
    });

    buttons.forEach(b => {
      if (b.innerHTML !== btn.innerHTML && b.innerHTML !== "") {
        if (b.innerHTML === q.correct_answer) {
          b.classList.add("correct");
        }
      }
    });
  }

  setTimeout(loadQuestion, 2000);
}

function resetTimer() {
  clearInterval(timer);
  time = 10;
  timeEl.innerText = time;
  progress.style.width = "100%";

  timer = setInterval(() => {
    time--;
    timeEl.innerText = time;
    progress.style.width = (time * 10) + "%";

    if (time <= 0) {
      clearInterval(timer);
      answered = true;
      setTimeout(loadQuestion, 1000);
    }
  }, 1000);
}

loadQuestion();
