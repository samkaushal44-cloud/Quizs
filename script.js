let questions = [];
let index = 0;
let coins = 0;
let timer;
let timeLeft = 10;
let answered = false;
let questionCount = 0;

// 👉 कितने questions बाद Ad आए
const AD_AFTER = 5; // 5 या 10 कर सकते हो

const qEl = document.getElementById("question");
const optBox = document.getElementById("options");
const coinEl = document.getElementById("coins");
const timeEl = document.getElementById("time");
const progress = document.getElementById("progress");

loadQuestions();

/* ---------------- LOAD QUESTIONS FROM API ---------------- */
function loadQuestions(){
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
          question: decodeHTML(q.question),
          options: options.map(decodeHTML),
          answer: correctIndex
        };
      });
      index = 0;
      showQuestion();
    })
    .catch(() => {
      qEl.innerText = "Error loading questions";
    });
}

/* ---------------- SHOW QUESTION ---------------- */
function showQuestion(){
  if(index >= questions.length){
    loadQuestions();
    return;
  }

  answered = false;
  resetTimer();

  let q = questions[index];
  qEl.innerText = q.question;
  optBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    let btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(i, btn);
    optBox.appendChild(btn);
  });
}

/* ---------------- ANSWER CLICK ---------------- */
function selectAnswer(i, btn){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  let correct = questions[index].answer;
  let buttons = optBox.children;

  // सही / गलत highlight
  if(i === correct){
    btn.classList.add("correct");
    coins += 10;
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  coinEl.innerText = coins;
  questionCount++;

  setTimeout(() => {
    // 👉 AD condition (सही/गलत कोई फर्क नहीं)
    if(questionCount >= AD_AFTER){
      showAdScreen();
    } else {
      index++;
      showQuestion();
    }
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
      questionCount++;

      setTimeout(() => {
        if(questionCount >= AD_AFTER){
          showAdScreen();
        } else {
          index++;
          showQuestion();
        }
      }, 1500);
    }
  }, 1000);
}

/* ---------------- AD SCREEN ---------------- */
function showAdScreen(){
  clearInterval(timer);

  qEl.innerText = "📺 Watch Ad to Continue";
  optBox.innerHTML = `
    <button class="ad-btn" onclick="watchAd()">Watch Ad & Continue</button>
  `;
}

/* ---------------- WATCH AD ---------------- */
function watchAd(){
  coins += 20;
  coinEl.innerText = coins;

  // reset counter & reload quiz
  questionCount = 0;
  loadQuestions();
}

/* ---------------- WITHDRAW ---------------- */
function withdraw(){
  if(coins < 100){
    alert("Minimum 100 coins required");
  } else {
    alert("Withdraw request sent (Demo)");
  }
}

/* ---------------- HTML DECODE ---------------- */
function decodeHTML(str){
  let txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
