let coins = 0;
let index = 0;
let time = 10;
let timer;
let answered = false;
let questions = [];

const qEl = document.getElementById("question");
const optBox = document.getElementById("options");
const timeEl = document.getElementById("time");
const progress = document.getElementById("progress");
const coinEl = document.getElementById("coins");

/* =========================
   LOAD QUESTIONS FROM API
========================= */

async function loadFromAPI(){
  qEl.innerText = "Loading questions...";
  try{
    const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
    const data = await res.json();

    questions = data.results.map(q => {
      const options = [...q.incorrect_answers];
      const correctIndex = Math.floor(Math.random()*4);
      options.splice(correctIndex,0,q.correct_answer);

      return {
        q: decodeHTML(q.question),
        o: options.map(decodeHTML),
        a: correctIndex
      };
    });

    index = 0;
    loadQuestion();

  }catch(err){
    qEl.innerText = "Error loading question";
    console.log(err);
  }
}

/* =========================
   LOAD SINGLE QUESTION
========================= */

function loadQuestion(){
  if(index >= questions.length){
    qEl.innerText = "Questions Finished!";
    optBox.innerHTML = "";
    return;
  }

  answered = false;
  time = 10;
  timeEl.innerText = "10s";
  progress.style.width = "100%";

  const q = questions[index];
  qEl.innerText = q.q;
  optBox.innerHTML = "";

  q.o.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = ()=>selectAnswer(btn,i);
    optBox.appendChild(btn);
  });

  startTimer();
}

/* =========================
   TIMER
========================= */

function startTimer(){
  clearInterval(timer);
  timer = setInterval(()=>{
    time--;
    timeEl.innerText = time+"s";
    progress.style.width = (time*10)+"%";

    if(time<=0){
      clearInterval(timer);
      showCorrect();
    }
  },1000);
}

/* =========================
   ANSWER LOGIC
========================= */

function selectAnswer(btn,i){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].a;
  const buttons = document.querySelectorAll("#options button");

  if(i===correct){
    btn.classList.add("correct");
    coins+=10;
    coinEl.innerText = coins;
  }else{
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  setTimeout(()=>{
    index++;
    loadQuestion();
  },2000);
}

function showCorrect(){
  const buttons = document.querySelectorAll("#options button");
  buttons[questions[index].a].classList.add("correct");

  setTimeout(()=>{
    index++;
    loadQuestion();
  },2000);
}

/* =========================
   ADS + WITHDRAW (DEMO)
========================= */

function watchAd(){
  alert("Watching Ad...");
  setTimeout(()=>{
    coins+=20;
    coinEl.innerText = coins;
    alert("20 Coins Added");
  },2000);
}

function withdraw(){
  if(coins < 100){
    alert("Minimum 100 coins required");
    return;
  }
  const upi = prompt("Enter UPI ID");
  if(upi){
    alert("Withdraw request sent (Demo)");
    coins = 0;
    coinEl.innerText = coins;
  }
}

/* =========================
   HTML DECODE FIX
========================= */

function decodeHTML(str){
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

/* =========================
   START APP
========================= */

loadFromAPI();
