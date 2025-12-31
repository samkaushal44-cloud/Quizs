let questions = [];
let index = 0;
let coins = 0;
let answered = false;
let timer;
let timeLeft = 10;
let solvedCount = 0;

const LIMIT = 5; // 5 questions per round

const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const coinEl = document.getElementById("coins");
const timeEl = document.getElementById("time");
const progress = document.getElementById("progress");
const action = document.getElementById("actionArea");

loadQuestions();

/* ---------------- LOAD QUESTIONS ---------------- */
function loadQuestions(){
  qEl.innerText = "Loading...";
  optEl.innerHTML = "";
  action.innerHTML = "";

  fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => {
        let opts = [...q.incorrect_answers];
        let ans = Math.floor(Math.random() * 4);
        opts.splice(ans, 0, q.correct_answer);
        return {
          q: decode(q.question),
          o: opts.map(decode),
          a: ans
        };
      });
      index = 0;
      solvedCount = 0;
      showQuestion();
    })
    .catch(() => {
      qEl.innerText = "Error loading questions";
    });
}

/* ---------------- SHOW QUESTION ---------------- */
function showQuestion(){
  if(solvedCount >= LIMIT){
    showFinish();
    return;
  }

  answered = false;
  resetTimer();

  let q = questions[index];
  qEl.innerText = q.q;
  optEl.innerHTML = "";
  action.innerHTML = "";

  q.o.forEach((opt,i)=>{
    let b = document.createElement("button");
    b.className = "option";
    b.innerText = opt;
    b.onclick = ()=>checkAnswer(i,b);
    optEl.appendChild(b);
  });
}

/* ---------------- CHECK ANSWER ---------------- */
function checkAnswer(i,btn){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  let correct = questions[index].a;
  let btns = optEl.children;

  if(i === correct){
    btn.classList.add("correct");
    coins += 10;
  } else {
    btn.classList.add("wrong");
    btns[correct].classList.add("correct");
  }

  coinEl.innerText = coins;
  solvedCount++;
  index++;

  setTimeout(showQuestion, 1200);
}

/* ---------------- TIMER ---------------- */
function resetTimer(){
  clearInterval(timer);
  timeLeft = 10;
  timeEl.innerText = timeLeft;
  progress.style.width = "100%";

  timer = setInterval(()=>{
    timeLeft--;
    timeEl.innerText = timeLeft;
    progress.style.width = (timeLeft*10)+"%";

    if(timeLeft<=0){
      clearInterval(timer);
      answered = true;
      solvedCount++;
      index++;
      setTimeout(showQuestion,800);
    }
  },1000);
}

/* ---------------- FINISH + ADS ---------------- */
function showFinish(){
  qEl.innerText = "Questions Finished!";
  optEl.innerHTML = "";

  action.innerHTML = `
    <button class="ad" onclick="watchAd()">📺 Watch Ad & Get Coins</button>
    <button class="withdraw" onclick="withdraw()">💰 Withdraw</button>
  `;
}

/* ---------------- WATCH AD ---------------- */
function watchAd(){
  coins += 20;
  coinEl.innerText = coins;
  loadQuestions(); // 👈 next questions start
}

/* ---------------- WITHDRAW ---------------- */
function withdraw(){
  if(coins < 100){
    alert("Minimum 100 coins required");
  } else {
    alert("Withdraw request sent (Demo)");
  }
}

function decode(t){
  let x=document.createElement("textarea");
  x.innerHTML=t;
  return x.value;
}
