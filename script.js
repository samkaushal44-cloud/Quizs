let coins = 0;
let index = 0;
let quiz = [];
let timer = null;
let timeLeft = 10;
let seenQuestions = new Set();

/* API */
function apiURL(){
  return "https://opentdb.com/api.php?amount=10&type=multiple&ts=" + Date.now();
}

/* Helpers */
function decodeHTML(t){
  const e = document.createElement("textarea");
  e.innerHTML = t;
  return e.value;
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

/* Load Questions */
function loadFromAPI(){
  fetch(apiURL()).then(r=>r.json()).then(d=>{
    const fresh=[];
    d.results.forEach(q=>{
      const text=decodeHTML(q.question);
      if(seenQuestions.has(text)) return;
      seenQuestions.add(text);

      const opts=[q.correct_answer,...q.incorrect_answers].map(decodeHTML);
      shuffle(opts);
      const correctKey=["A","B","C","D"][opts.indexOf(decodeHTML(q.correct_answer))];

      fresh.push({
        q:text,
        options:{A:opts[0],B:opts[1],C:opts[2],D:opts[3]},
        ans:correctKey,
        level:"Online",
        reward:10
      });
    });
    if(!fresh.length){ loadFromAPI(); return; }
    quiz=fresh; index=0; loadQuestion();
  });
}

/* Timer */
function startTimer(){
  stopTimer();
  timeLeft = 10;
  timerText.innerText = "Time: 10s";
  timerBar.style.width = "100%";

  timer = setInterval(()=>{
    timeLeft--;
    timerText.innerText = "Time: " + timeLeft + "s";
    timerBar.style.width = (timeLeft/10*100) + "%";

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

/* Load Question */
function loadQuestion(){
  if(index>=quiz.length){ loadFromAPI(); return; }
  const q=quiz[index];
  question.innerText=q.q;
  A.innerText=q.options.A;
  B.innerText=q.options.B;
  C.innerText=q.options.C;
  D.innerText=q.options.D;
  level.innerText="Level: "+q.level;
  resetButtons();
  startTimer();
}

function resetButtons(){
  ["A","B","C","D"].forEach(id=>{
    document.getElementById(id).classList.remove("correct","wrong");
  });
}

/* Answer */
function checkAnswer(option){
  stopTimer();
  const btn=document.getElementById(option);
  resetButtons();

  if(option===quiz[index].ans){
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

/* Ad */
function watchAd(){
  coins+=20;
  coinsEl.innerText="Coins: "+coins;
  alert("+20 Coins");
}

const coinsEl=document.getElementById("coins");
loadFromAPI();
