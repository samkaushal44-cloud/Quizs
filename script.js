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

/* 🇮🇳 INDIAN GK + HISTORY API */
function apiURL(){
  return "https://the-trivia-api.com/v2/questions?categories=general_knowledge,history&regions=IN&limit=10&ts=" + Date.now();
}

/* Helpers */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

/* LOAD QUESTIONS */
function loadFromAPI(){
  fetch(apiURL())
    .then(res=>res.json())
    .then(data=>{
      quiz=[];

      data.forEach(q=>{
        if(seenQuestions.has(q.question.text)) return;
        seenQuestions.add(q.question.text);

        const options=[q.correctAnswer,...q.incorrectAnswers];
        shuffle(options);

        quiz.push({
          q: q.question.text,
          options:{
            A: options[0],
            B: options[1],
            C: options[2],
            D: options[3]
          },
          ans: ["A","B","C","D"][options.indexOf(q.correctAnswer)],
          reward: 10,
          level: q.category.replace("_"," ").toUpperCase()
        });
      });

      index = 0;
      loadQuestion();
    });
}

/* ⏱️ TIMER */
function startTimer(){
  stopTimer();
  timeLeft=10;
  timerText.innerText="Time: 10s";
  timerBar.style.width="100%";

  timer=setInterval(()=>{
    timeLeft--;
    timerText.innerText="Time: "+timeLeft+"s";
    timerBar.style.width=(timeLeft/10*100)+"%";

    if(timeLeft<=0){
      stopTimer();
      showCorrectThenNext();
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

/* RESET */
function resetButtons(){
  [A,B,C,D].forEach(b=>{
    b.classList.remove("correct","wrong");
    b.disabled=false;
  });
}

/* ❗ SHOW CORRECT ANSWER */
function showCorrectThenNext(){
  stopTimer();

  const correctBtn = document.getElementById(quiz[index].ans);
  correctBtn.classList.add("correct");

  // disable all
  [A,B,C,D].forEach(b=>b.disabled=true);

  setTimeout(()=>{
    index++;
    loadQuestion();
  },2000);
}

/* ANSWER */
function checkAnswer(option){
  stopTimer();

  // disable all buttons
  [A,B,C,D].forEach(b=>b.disabled=true);

  const selectedBtn=document.getElementById(option);
  const correctKey=quiz[index].ans;
  const correctBtn=document.getElementById(correctKey);

  if(option===correctKey){
    selectedBtn.classList.add("correct");
    coins+=quiz[index].reward;
    coinsEl.innerText="Coins: "+coins;

    setTimeout(()=>{
      index++;
      loadQuestion();
    },700);

  } else {
    selectedBtn.classList.add("wrong");
    correctBtn.classList.add("correct");

    // ❗ 2 sec ruk ke next
    setTimeout(()=>{
      index++;
      loadQuestion();
    },2000);
  }
}

/* AD */
function watchAd(){
  coins+=20;
  coinsEl.innerText="Coins: "+coins;
  alert("+20 Coins");
}

/* START */
loadFromAPI();
