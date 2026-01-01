let questions=[],index=0,coins=0,timer,lock=false;

const qEl=document.getElementById("question");
const oEl=document.getElementById("options");
const tEl=document.getElementById("timer");
const pBar=document.getElementById("progressBar");
const cEl=document.getElementById("coins");
const withdrawBox=document.getElementById("withdraw");
const finalCoins=document.getElementById("finalCoins");

function decodeHTML(str){
  const txt=document.createElement("textarea");
  txt.innerHTML=str;
  return txt.value;
}

async function loadAPI(){
  const res=await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
  const data=await res.json();
  questions=data.results.map(q=>{
    const opts=[...q.incorrect_answers,q.correct_answer].sort();
    return{
      q:decodeHTML(q.question),
      a:opts.map(o=>decodeHTML(o)),
      c:opts.indexOf(q.correct_answer)
    };
  });
  loadQuestion();
}

function startTimer(){
  clearInterval(timer);
  let t=15;
  tEl.innerText=t;
  timer=setInterval(()=>{
    t--;
    tEl.innerText=t;
    if(t<=0){
      clearInterval(timer);
      nextQuestion();
    }
  },1000);
}

function loadQuestion(){
  lock=false;
  if(index>=questions.length){
    qEl.style.display="none";
    oEl.style.display="none";
    withdrawBox.style.display="block";
    finalCoins.innerText=coins;
    return;
  }

  const q=questions[index];
  qEl.innerText=q.q;
  oEl.innerHTML="";
  pBar.style.width=((index+1)/questions.length*100)+"%";

  q.a.forEach((opt,i)=>{
    const d=document.createElement("div");
    d.className="option";
    d.innerText=opt;
    d.onclick=()=>{
      if(lock) return;
      lock=true;
      if(i===q.c){
        d.classList.add("correct");
        coins+=10;
        cEl.innerText=coins;
      }else{
        d.classList.add("wrong");
      }
      setTimeout(nextQuestion,800);
    };
    oEl.appendChild(d);
  });

  startTimer();
}

function nextQuestion(){
  index++;
  loadQuestion();
}

loadAPI();
