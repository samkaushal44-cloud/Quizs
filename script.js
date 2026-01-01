let coins = Number(localStorage.getItem("coins") || 50);
let bonusDay = localStorage.getItem("bonusDay");
let today = new Date().toDateString();

if(bonusDay !== today){
  coins += 10;
  localStorage.setItem("bonusDay", today);
}

document.getElementById("coins").innerText = coins;

let questions=[], index=0, timer, time=10, cat=9;

// START QUIZ
function startQuiz(){
  cat = document.getElementById("catSelect").value;
  document.getElementById("category").innerText =
    document.getElementById("catSelect").selectedOptions[0].text;
  fetchQuestions();
}

// FETCH API
function fetchQuestions(){
  fetch(`https://opentdb.com/api.php?amount=10&category=${cat}&type=multiple`)
  .then(r=>r.json())
  .then(d=>{
    questions = d.results.map(q=>({
      q:q.question,
      o:[...q.incorrect_answers,q.correct_answer].sort(),
      a:q.correct_answer
    }));
    index=0;
    loadQ();
  })
  .catch(()=>{
    alert("API failed, retry");
  });
}

function loadQ(){
  clearInterval(timer);
  time=10;
  document.getElementById("time").innerText=time;
  document.querySelector(".bar").style.width="100%";

  let q=questions[index];
  let card=document.getElementById("card");
  card.innerHTML=`<h3>${q.q}</h3>`+
    q.o.map(o=>`<button class="opt" onclick="ans('${o}')">${o}</button>`).join("");

  timer=setInterval(()=>{
    time--;
    document.getElementById("time").innerText=time;
    document.querySelector(".bar").style.width=(time*10)+"%";
    if(time<=0){clearInterval(timer);next();}
  },1000);
}

function ans(v){
  clearInterval(timer);
  let q=questions[index];
  if(v===q.a){coins+=5;save();}
  setTimeout(next,500);
}

function next(){
  index++;
  if(index>=questions.length){finish();}
  else loadQ();
}

function finish(){
  document.getElementById("card").innerHTML=
  `<h3>Quiz Finished</h3>
   <button class="reward-btn" onclick="watchAd()">Watch Ad +20</button>`;
}

// REWARDED AD (REAL FEEL)
function watchAd(){
  localStorage.setItem("rewardReturn","1");
  location.href="https://www.topcreativeformat.com/28277074";
}

if(localStorage.getItem("rewardReturn")){
  coins+=20;
  save();
  localStorage.removeItem("rewardReturn");
}

// SAVE
function save(){
  localStorage.setItem("coins",coins);
  document.getElementById("coins").innerText=coins;
}

// WITHDRAW
document.querySelector(".withdraw").onclick=()=>{
  let upi=document.getElementById("upi").value;
  if(coins<100) alert("Min 100 coins");
  else if(!upi) alert("Enter UPI");
  else alert("Withdraw Requested");
};
