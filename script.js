let questions = [];
let index = 0;
let coins = 0;
let timer;
let timeLeft = 10;
let answered = false;

const qEl = document.getElementById("question");
const optBox = document.getElementById("options");
const coinEl = document.getElementById("coins");
const timeEl = document.getElementById("time");
const progress = document.getElementById("progress");

loadFromAPI();

/* ---------------- API LOAD ---------------- */
function loadFromAPI(){
  qEl.innerText = "Loading...";
  optBox.innerHTML = "";

  fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => {
        let options = [...q.incorrect_answers];
        let correctIndex = Math.floor(Math.random() * 4);
        options.splice(correctIndex, 0, q.correct_answer);
        return {
          question: decode(q.question),
          options: options.map(decode),
          answer: correctIndex
        };
      });
      index = 0;
      showQuestion();
    })
    .catch(() => {
      qEl.innerText = "Error loading question";
    });
}

/* ---------------- SHOW QUESTION ---------------- */
function showQuestion(){
  if(index >= questions.length){
    quizFinished();
    return;
  }

  answered = false;
  resetTimer();

  let q = questions[index];
  qEl.innerText = q.question;
  optBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(i, btn);
    optBox.appendChild(btn);
  });
}

/* ---------------- ANSWER ---------------- */
function selectAnswer(i, btn){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  let correct = questions[index].answer;
  let buttons = optBox.children;

  if(i === correct){
    btn.classList.add("correct");
    coins += 10;
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  coinEl.innerText = coins;

  setTimeout(() => {
    index++;
    showQuestion();
  }, 1500);
}

/* ---------------- TIMER ---------------- */
function resetTimer(){
  clearInterval(timer);
  timeLeft = 10;
  timeEl.innerText = timeLeft;
  progress.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;
    progress.style.width = (timeLeft * 10) + "%";

    if(timeLeft <= 0){
      clearInterval(timer);
      answered = true;
      let correct = questions[index].answer;
      optBox.children[correct].classList.add("correct");

      setTimeout(() => {
        index++;
        showQuestion();
      }, 1500);
    }
  }, 1000);
}

/* ---------------- QUIZ FINISHED ---------------- */
function quizFinished(){
  clearInterval(timer);
  qEl.innerText = "Questions Finished!";
  optBox.innerHTML = `
    <button class="ad-btn" onclick="watchAd()">📺 Watch Ad & Get Coins</button>
    <button class="withdraw-btn" onclick="withdraw()">💰 Withdraw</button>
  `;
}

/* ---------------- WATCH AD ---------------- */
function watchAd(){
  coins += 20;
  coinEl.innerText = coins;

  // Ad ke baad NEW QUESTIONS
  loadFromAPI();
}

/* ---------------- WITHDRAW ---------------- */
function withdraw(){
  if(coins < 100){
    alert("Minimum 100 coins required");
  } else {
    alert("Withdraw request submitted (Demo)");
  }
}

/* ---------------- HTML DECODE ---------------- */
function decode(str){
  let txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
