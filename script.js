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

function loadFromAPI(){
  fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
    .then(res=>res.json())
    .then(data=>{
      if(!data.results || data.results.length===0){
        qEl.innerText="Retrying...";
        setTimeout(loadFromAPI,1500);
        return;
      }
      questions = data.results.map(q=>{
        let options=[...q.incorrect_answers];
        let correctIndex=Math.floor(Math.random()*4);
        options.splice(correctIndex,0,q.correct_answer);
        return {
          question:decode(q.question),
          options:options.map(decode),
          answer:correctIndex
        };
      });
      index=0;
      showQuestion();
    })
    .catch(()=>{
      qEl.innerText="Error loading question";
      setTimeout(loadFromAPI,1500);
    });
}

function showQuestion(){
  if(index>=questions.length){
    loadFromAPI();
    return;
  }

  answered=false;
  resetTimer();

  let q=questions[index];
  qEl.innerText=q.question;
  optBox.innerHTML="";

  q.options.forEach((opt,i)=>{
    let btn=document.createElement("button");
    btn.innerText=opt;
    btn.onclick=()=>selectAnswer(i,btn);
    optBox.appendChild(btn);
  });
}

function selectAnswer(i,btn){
  if(answered) return;
  answered=true;
  clearInterval(timer);

  let correct=questions[index].answer;
  let buttons=optBox.children;

  if(i===correct){
    btn.classList.add("correct");
    coins+=10;
  }else{
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  coinEl.innerText=coins;

  setTimeout(()=>{
    index++;
    showQuestion();
  },2000);
}

function resetTimer(){
  clearInterval(timer);
  timeLeft=10;
  timeEl.innerText=timeLeft;
  progress.style.width="100%";

  timer=setInterval(()=>{
    timeLeft--;
    timeEl.innerText=timeLeft;
    progress.style.width=(timeLeft*10)+"%";

    if(timeLeft<=0){
      clearInterval(timer);
      answered=true;
      let correct=questions[index].answer;
      optBox.children[correct].classList.add("correct");
      setTimeout(()=>{
        index++;
        showQuestion();
      },1500);
    }
  },1000);
}

function watchAd(){
  coins+=20;
  coinEl.innerText=coins;
  alert("Ad watched! +20 coins");
}

function withdraw(){
  if(coins<100){
    alert("Minimum 100 coins required");
  }else{
    alert("Withdraw request sent (Demo)");
  }
}

function decode(str){
  let txt=document.createElement("textarea");
  txt.innerHTML=str;
  return txt.value;
}
