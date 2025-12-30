let coins = 0;
let index = 0;
let quiz = [];
let timer = null;
let timeLeft = 10;
let seenQuestions = new Set();

/* DOM */
const questionEl = document.getElementById("question");
const A = document.getElementById("A");
const B = document.getElementById("B");
const C = document.getElementById("C");
const D = document.getElementById("D");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const timerText = document.getElementById("timerText");
const timerBar = document.getElementById("timerBar");

/* API */
function apiURL(){
  return "https://opentdb.com/api.php?amount=10&type=multiple&ts="+Date.now();
}

function decodeHTML(t){
  const e=document.createElement("textarea");
  e.innerHTML=t;
  return e.value;
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

/* LOAD */
function loadFromAPI(){
  fetch(apiURL()).then(r=>r.json()).then(d=>{
    quiz=[];
    d.results.forEach(q=>{
      const qt=decodeHTML(q.question);
      if(seenQuestions.has(qt)) return;
      seenQuestions.add(qt);

      const opts=[decodeHTML(q.correct_answer),...q.incorrect_answers.map(decodeHTML)];
      shuffle(opts);

      quiz.push({
        q:qt,
        options:{A:opts[0],B:opts[1],C:opts[2],D:opts[3]},
        ans:["A","B","C","D"][opts.indexOf(decodeHTML(q.correct_answer))],
        reward:10,
        level:"Online"
      });
    });
    index=0;
    loadQuestion();
  });
}

/* ⏱️ TIMER WITH DANGER MODE */
function startTimer(){
  stopTimer();
  timeLeft=10;
  timerText.innerText="Time: 10s";
  timerText.classList.remove("danger");
  timerBar.style.width="100%";

  timer=setInterval(()=>{
    timeLeft--;
    timerText.innerText="Time: "+timeLeft+"s";
    timerBar.style.width=(timeLeft/10*100)+"%";

    /* 🔴 LAST 3 SEC ALERT */
    if(timeLeft<=3){
      timerText.classList.add("danger");
      if(navigator.vibrate){
        navigator.vibrate(200);
      }
    }

    if(timeLeft<=0){
      stopTimer();
      index++;
      loadQuestion();
    }
  },1000);
}

function stopTimer(){
  if(timer){
    clearInterval(timer);
    timer=null;
  }
}

/* LOAD QUESTION */
function loadQuestion(){
  if(index>=quiz.length){
    loadFromAPI();
    return;
  }
  const q=quiz[index];
  questionEl.innerText=q.q;
  A.innerText=q.options.A;
  B.innerText=q.options.B;
  C.innerText=q.options.C;
  D.innerText=q.options.D;
  levelEl.innerText="Level: "+q.level;
  resetButtons();
  startTimer();
}

function resetButtons(){
  [A,B,C,D].forEach(b=>b.classList.remove("correct","wrong"));
}

/* ANSWER */
function checkAnswer(o){
  stopTimer();
  resetButtons();
  const btn=document.getElementById(o);

  if(o===quiz[index].ans){
    btn.classList.add("correct");
    coins+=quiz[index].reward;
    coinsEl.innerText="Coins: "+coins;
  }else{
    btn.classList.add("wrong");
  }

  setTimeout(()=>{
    index++;
    loadQuestion();
  },700);
}

/* AD */
function watchAd(){
  coins+=20;
  coinsEl.innerText="Coins: "+coins;
  alert("+20 Coins");
}

loadFromAPI();
