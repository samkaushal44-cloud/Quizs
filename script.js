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

// ===== STATE =====
let index = 0;
let coins = Number(localStorage.getItem("coins") || 50);
let timer, time = 10;

// DAILY AD LIMIT
const MAX_ADS = 5;
const today = new Date().toDateString();
let lastDay = localStorage.getItem("lastDay");
let dailyAds = Number(localStorage.getItem("dailyAds") || 0);

// Reset daily limit
if(lastDay !== today){
  dailyAds = 0;
  localStorage.setItem("dailyAds", 0);
  localStorage.setItem("lastDay", today);
}

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

// ===== FINISH =====
function finish(){
  let disabled = dailyAds >= MAX_ADS ? "disabled" : "";
  card.innerHTML = `
    <h2>Questions Finished!</h2>
    <p>🎥 Ads Today: ${dailyAds}/${MAX_ADS}</p>
    <button class="reward-btn" ${disabled} onclick="watchAd()">
      Watch Ad & Get +20 Coins
    </button>
  `;
}

// ===== AD FLOW =====
function watchAd(){
  if(dailyAds >= MAX_ADS){
    alert("Daily ad limit reached. Try tomorrow.");
    return;
  }

  dailyAds++;
  localStorage.setItem("dailyAds", dailyAds);

  let sec = 5;
  card.innerHTML = `<h2>Ad Playing...</h2><p>Please wait ${sec}s</p>`;

  const fakeAd = setInterval(()=>{
    sec--;
    card.innerHTML = `<h2>Ad Playing...</h2><p>Please wait ${sec}s</p>`;
    if(sec<=0){
      clearInterval(fakeAd);
      coins += 20;
      saveCoins();
      finish();
    }
  },1000);
}

// ===== COINS =====
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
