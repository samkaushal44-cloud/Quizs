let coins = 0;
let index = 0;
let quiz = [];
let seenQuestions = new Set(); // 🧠 history

/* 🌐 ONLINE API (UNLIMITED) */
function getAPI() {
  return (
    "https://opentdb.com/api.php?amount=10&type=multiple&ts=" +
    Date.now() // 🔥 cache bust
  );
}

/* 🔤 HTML decode */
function decodeHTML(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

/* 🔀 shuffle helper */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* 📥 LOAD QUESTIONS */
function loadFromAPI() {
  fetch(getAPI())
    .then(res => res.json())
    .then(data => {
      const fresh = [];

      data.results.forEach(q => {
        const questionText = decodeHTML(q.question);

        // ❌ skip if already seen
        if (seenQuestions.has(questionText)) return;

        seenQuestions.add(questionText);

        const optionsArr = [
          q.correct_answer,
          ...q.incorrect_answers
        ].map(decodeHTML);

        shuffle(optionsArr);

        const correctIndex =
          optionsArr.indexOf(decodeHTML(q.correct_answer));

        fresh.push({
          q: questionText,
          options: {
            A: optionsArr[0],
            B: optionsArr[1],
            C: optionsArr[2],
            D: optionsArr[3]
          },
          ans: ["A","B","C","D"][correctIndex],
          level: "Online",
          reward: 10
        });
      });

      // agar is batch me bhi sab repeat ho gaye
      if (fresh.length === 0) {
        loadFromAPI(); // 🔁 try again
        return;
      }

      quiz = fresh;
      index = 0;
      loadQuestion();
    });
}

/* ❓ LOAD QUESTION */
function loadQuestion() {
  if (index >= quiz.length) {
    loadFromAPI(); // 🔁 new batch
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

    // 🎉 flash
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
