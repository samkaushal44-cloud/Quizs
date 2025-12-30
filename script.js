/******** QUESTIONS ********/
const allQuestions = [
  {q:"Capital of India?",o:["Delhi","Mumbai","Chennai","Kolkata"],a:0},
  {q:"Father of Nation?",o:["Gandhi","Nehru","Patel","Bose"],a:0},
  {q:"National Animal of India?",o:["Lion","Tiger","Elephant","Leopard"],a:1},
  {q:"Who wrote National Anthem?",o:["Tagore","Bankim","Premchand","Nehru"],a:0},
  {q:"Taj Mahal is in?",o:["Agra","Delhi","Jaipur","Bhopal"],a:0}
];

/******** SHUFFLE ********/
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

let questions=[...allQuestions];
shuffle(questions);

let index=0;
let coins=0;
let time=10;
let timer;
let answered=false;

/******** ELEMENTS ********/
const qEl=document.getElementById("question");
const optEl=document.getElementById("options");
const bar=document.getElementById("bar");
const timeText=document.getElementById("timeText");
const coinsEl=document.getElementById("coins");
const watchAdBtn=document.getElementById("watchAdBtn");
const withdrawBtn=document.getElementById("withdrawBtn");

/******** QUIZ ********/
loadQ();

function loadQ(){
  clearInterval(timer);
  answered=false;

  if(index>=questions.length){
    questions=[...allQuestions];
    shuffle(questions);
    index=0;
  }

  const q=questions[index];
  qEl.innerText=q.q;
  optEl.innerHTML="";

  q.o.forEach((text,i)=>{
    const btn=document.createElement("button");
    btn.innerText=text;
    btn.onclick=()=>selectAnswer(i);
    optEl.appendChild(btn);
  });

  startTimer();
}

function startTimer(){
  time=10;
  bar.style.width="100%";
  timeText.innerText="Time: 10s";

  timer=setInterval(()=>{
    time--;
    bar.style.width=(time*10)+"%";
    timeText.innerText="Time: "+time+"s";

    if(time<=0){
      clearInterval(timer);
      showCorrect();
      setTimeout(nextQ,1200);
    }
  },1000);
}

function selectAnswer(i){
  if(answered) return;
  answered=true;
  clearInterval(timer);

  const q=questions[index];
  const btns=optEl.children;

  btns[q.a].classList.add("correct");

  if(i===q.a){
    coins+=10;
    coinsEl.innerText=coins;
  }else{
    btns[i].classList.add("wrong");
  }

  setTimeout(nextQ,1200);
}

function showCorrect(){
  optEl.children[questions[index].a].classList.add("correct");
}

function nextQ(){
  index++;
  loadQ();
}

/******** WATCH AD ********/
watchAdBtn.addEventListener("click",()=>{
  watchAdBtn.disabled=true;
  watchAdBtn.innerText="⏳ Playing Ad...";

  setTimeout(()=>{
    coins+=20;
    coinsEl.innerText=coins;
    alert("🎉 Ad watched! +20 coins");
    watchAdBtn.innerText="📺 Watch Ad & Get Coins";
    watchAdBtn.disabled=false;
  },3000);
});

/******** WITHDRAW ********/
withdrawBtn.addEventListener("click",()=>{
  if(coins<100){
    alert("❌ Minimum 100 coins required");
  }else{
    alert("✅ Withdraw request sent!");
    coins=0;
    coinsEl.innerText=coins;
  }
});
