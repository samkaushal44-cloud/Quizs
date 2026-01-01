// ===== QUESTIONS =====
const questions = [
  {q:"India capital?", o:["Delhi","Mumbai","Kolkata","Chennai"], a:0},
  {q:"2 + 2 = ?", o:["3","4","5","6"], a:1},
  {q:"Sun rises from?", o:["North","South","East","West"], a:2},
  {q:"HTML used for?", o:["Design","Structure","DB","Server"], a:1},
  {q:"CSS full form?", o:["Style","Sheet","Cascading Style Sheets","Code"], a:2},
  {q:"JS is?", o:["Language","Library","DB","OS"], a:0},
  {q:"5 × 5 = ?", o:["10","20","25","30"], a:2},
  {q:"RAM is?", o:["CPU","GPU","Memory","Disk"], a:2},
  {q:"HTTP is?", o:["Protocol","Language","Server","OS"], a:0},
  {q:"India PM?", o:["Modi","Rahul","Kejriwal","Amit"], a:0}
];

let index = 0;
let coins = Number(localStorage.getItem("coins") || 50);
let timer, time = 10;

// ===== ELEMENTS =====
const card = document.getElementById("card");
const coinBox = document.getElementById("coins");
const timeBox = document.getElementById("time");
const bar = document.querySelector(".bar");

// ===== INIT =====
coinBox.innerText = coins;
loadQuestion();

// ===== QUIZ =====
function loadQuestion(){
  clearInterval(timer);
  time = 10;
  timeBox.innerText = time;
  bar.style.width = "100%";

  const q = questions[index];
  card.innerHTML = `
    <h2>${q.q}</h2>
    ${q.o.map((t,i)=>`<button class="opt" onclick="answer(${i})">${t}</button>`).join("")}
  `;

  timer = setInterval(()=>{
    time--;
    timeBox.innerText = time;
    bar.style.width = (time*10) + "%";
    if(time<=0){
      clearInterval(timer);
      next();
    }
  },1000);
}

function answer(i){
  clearInterval(timer);
  const q = questions[index];
  const opts = document.querySelectorAll(".opt");

  opts.forEach((b,bi)=>{
    b.disabled = true;
    if(bi === q.a) b.style.background="#22c55e";
    if(bi === i && bi !== q.a) b.style.background="#ef4444";
  });

  if(i === q.a){
    coins += 5;
    saveCoins();
  }

  setTimeout(next, 800);
}

function next(){
  index++;
  if(index >= questions.length){
    finish();
  }else{
    loadQuestion();
  }
}

function finish(){
  card.innerHTML = `
    <h2>Questions Finished!</h2>
    <button class="reward-btn" onclick="watchAd()">🎥 Watch Ad & Get +20 Coins</button>
  `;
}

// ===== ADS / COINS =====
function watchAd(){
  alert("Ad Playing...");
  coins += 20;
  saveCoins();
}

function saveCoins(){
  localStorage.setItem("coins", coins);
  coinBox.innerText = coins;
}

// ===== WITHDRAW =====
document.querySelector(".withdraw").onclick = ()=>{
  if(coins < 100){
    alert("Minimum 100 coins required");
  }else{
    alert("Withdraw request submitted");
  }
};
