let coins = 0;
let index = 0;
let quiz = [];

/* 🌐 ONLINE QUESTIONS API (UNLIMITED) */
const API_URL =
"https://opentdb.com/api.php?amount=10&type=multiple";

/* 🔄 SHUFFLE OPTIONS */
function shuffleOptions(options) {
  const keys = Object.keys(options);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  const shuffled = {};
  keys.forEach(k => shuffled[k] = options[k]);
  return shuffled;
}

/* 📥 LOAD QUESTIONS FROM API */
function loadFromAPI() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      quiz = data.results.map(q => {
        let options = {
          A: q.correct_answer,
          B: q.incorrect_answers[0],
          C: q.incorrect_answers[1],
          D: q.incorrect_answers[2]
        };

        options = shuffleOptions(options);

        let correctKey = Object.keys(options)
          .find(k => options[k] === q.correct_answer);

        return {
          q: decodeHTML(q.question),
          options: {
            A: decodeHTML(options.A),
            B: decodeHTML(options.B),
            C: decodeHTML(options.C),
            D: decodeHTML(options.D)
          },
          ans: correctKey,
          level: "Online",
          reward: 10
        };
      });

      index = 0;
      loadQuestion();
    });
}

/* 🔤 HTML DECODE (API text clean) */
function decodeHTML(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

/* ❓ LOAD QUESTION */
function loadQuestion() {
  if (index >= quiz.length) {
    loadFromAPI(); // 🔁 NEW QUESTIONS
    return;
  }

  const q = quiz[index];
  question.innerText = q.q;
  A.innerText = q.options.A;
  B.innerText = q.options.B;
  C.innerText = q.options.C;
  D.innerText = q.options.D;
  level.innerText = "Level: " + q.level;
}

/* 🔄 RESET BUTTONS */
function resetButtons() {
  ["A","B","C","D"].forEach(id => {
    document.getElementById(id).classList.remove("correct","wrong");
  });
}

/* ✅ CHECK ANSWER */
function checkAnswer(option) {
  const btn = document.getElementById(option);
  const app = document.querySelector(".app");

  resetButtons();
  void btn.offsetWidth;

  if (option === quiz[index].ans) {
    btn.classList.add("correct");

    coins += quiz[index].reward;
    coinsEl.innerText = "Coins: " + coins;

    // 🎉 celebration flash
    app.classList.add("celebrate");
    setTimeout(() => app.classList.remove("celebrate"), 500);

    setTimeout(() => {
      resetButtons();
      index++;
      loadQuestion();
    }, 700);

  } else {
    btn.classList.add("wrong");
  }
}

/* 📺 AD */
function watchAd() {
  coins += 20;
  coinsEl.innerText = "Coins: " + coins;
  alert("+20 Coins");
}

const coinsEl = document.getElementById("coins");

/* 🚀 START */
loadFromAPI();
