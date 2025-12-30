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

/* 🇮🇳 GK + HISTORY (SHORT FILTER) */
function apiURL(){
  return "https://the-trivia-api.com/v2/questions?categories=general_knowledge,history&regions=IN&limit=20&ts=" + Date.now();
}

/* Shuffle */
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
        const text = q.question.text;

        /* ❌ LONG QUESTIONS SKIP */
        if(text.length > 90) return;
        if(seenQuestions.has(text)) return;

        seenQuestions.add(text);

        const options=[q.correctAnswer,...q.incorrectAnswers];
        shuffle(options);

        quiz.push({
          q: text,
          options:{
            A: options[0],
            B: options[1],
            C: options[2],
            D: options[3]
          },
          ans: ["A","B","C","D"][options.indexOf(q.correctAnswer)],
          reward: 10,
          level: "GK / HISTORY"
        });
      });

      if(quiz.length < 5){
        loadFromAPI(); // try again
        return;
      }

      index = 0;
      loadQuestion();
    });
}

/* ⏱️ TIMER */
function startTimer(){
  stopTimer();
  timeLeft = 10;
  timerText.innerText = "Time: 10s";
  timerBar.style.width = "100%";

  timer = setInterval(()=>{
    timeLeft--;
    timerText.innerText = "Time: " + timeLeft + "s";
    timerBar.style.width = (timeLeft/10*100) + "%";

    if(timeLeft <= 0){
      stopTimer();
      showCorrectThenNext();
    }
  },1000);
}

function stopTimer(){
  if(timer){
    clearInterval(timer);
    timer = null;
  }
}

/* LOAD QUESTION */
function loadQuestion(){
  if(index >= quiz.length){
    loadFromAPI();
    return;
  }

  const q = quiz[index];
  questionEl.innerText = q.q;
  A.innerText = q.options.A;
  B.innerText = q.options.B;
  C.innerText = q.options.C;
  D.innerText = q.options.D;
  levelEl.innerText = "Level: " + q.level;

  resetButtons();
  startTimer();
}

/* RESET */
function resetButtons(){
  [A,B,C,D].forEach(b=>{
    b.classList.remove("correct","wrong");
    b.disabled = false;
  });
}

/* SHOW CORRECT */
function showCorrectThenNext(){
  const correctBtn = document.getElementById(quiz[index].ans);
  correctBtn.classList.add("correct");
  [A,B,C,D].forEach(b=>b.disabled=true);

  setTimeout(()=>{
    index++;
    loadQuestion();
  },2000);
}

/* ANSWER */
function checkAnswer(option){
  stopTimer();
  [A,B,C,D].forEach(b=>b.disabled=true);

  const selected = document.getElementById(option);
  const correct = document.getElementById(quiz[index].ans);

  if(option === quiz[index].ans){
    selected.classList.add("correct");
    coins += quiz[index].reward;
    coinsEl.innerText = "Coins: " + coins;

    setTimeout(()=>{
      index++;
      loadQuestion();
    },700);
  } else {
    selected.classList.add("wrong");
    correct.classList.add("correct");

    setTimeout(()=>{
      index++;
      loadQuestion();
    },2000);
  }
}

/* AD */
function watchAd(){
  coins += 20;
  coinsEl.innerText = "Coins: " + coins;
  alert("+20 Coins");
}

/* START */
loadFromAPI();
