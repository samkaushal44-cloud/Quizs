const questions = [
  {
    q: "Capital of India?",
    o: ["Delhi","Mumbai","Chennai","Kolkata"],
    a: 0
  },
  {
    q: "Who wrote the National Anthem?",
    o: ["Tagore","Premchand","Bankim","Nehru"],
    a: 0
  },
  {
    q: "Taj Mahal is in which city?",
    o: ["Delhi","Agra","Jaipur","Bhopal"],
    a: 1
  }
];

let index = 0;
let coins = 0;
let time = 10;
let timer;
let answered = false;

const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const bar = document.getElementById("bar");
const timeText = document.getElementById("timeText");
const coinsEl = document.getElementById("coins");

loadQ();

function loadQ(){
  clearInterval(timer);
  answered = false;

  if(index >= questions.length){
    index = 0;
  }

  let q = questions[index];
  qEl.innerText = q.q;
  optEl.innerHTML = "";

  q.o.forEach((text,i)=>{
    let btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = ()=>selectAnswer(i);
    optEl.appendChild(btn);
  });

  time = 10;
  bar.style.width = "100%";
  timeText.innerText = "Time: 10s";

  timer = setInterval(()=>{
    time--;
    bar.style.width = (time*10)+"%";
    timeText.innerText = "Time: "+time+"s";

    if(time<=0){
      clearInterval(timer);
      showCorrect();
      setTimeout(nextQ,1200);
    }
  },1000);
}

function selectAnswer(i){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  let q = questions[index];
  let btns = optEl.children;

  btns[q.a].classList.add("correct");

  if(i === q.a){
    coins += 10;
    coinsEl.innerText = coins;
  }else{
    btns[i].classList.add("wrong");
  }

  setTimeout(nextQ,1200);
}

function showCorrect(){
  let q = questions[index];
  optEl.children[q.a].classList.add("correct");
}

function nextQ(){
  index++;
  loadQ();
}

function watchAd(){
  coins += 20;
  coinsEl.innerText = coins;
  alert("Ad watched! +20 coins");
}

function withdraw(){
  if(coins < 100){
    alert("Minimum 100 coins required");
  }else{
    alert("Withdraw request sent");
    coins = 0;
    coinsEl.innerText = coins;
  }
}
