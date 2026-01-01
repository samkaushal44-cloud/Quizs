/************** CONFIG **************/
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwaaB5OyovUC8bdQt-tD_fww7UWr7lQ9Gug055swn3p9nmD2driHl5FfrbO9UNjaePS/exec";

/************** QUESTIONS **************/
const questions = [
  { q: "India capital?", o: ["Delhi","Mumbai","Kolkata","Chennai"], a: "Delhi" },
  { q: "2 + 2 = ?", o: ["3","4","5","6"], a: "4" },
  { q: "Sun rises from?", o: ["North","South","East","West"], a: "East" },
  { q: "HTML used for?", o: ["Design","Structure","DB","Server"], a: "Structure" },
  { q: "CSS full form?", o: ["Style","Sheet","Cascading Style Sheets","Code"], a: "Cascading Style Sheets" }
];

/************** STATE **************/
let coins = Number(localStorage.getItem("coins") || 50);
let index = 0;
let timer = null;
let time = 10;

/************** ELEMENTS **************/
const coinBox = document.getElementById("coins");
const timeBox = document.getElementById("time");
const bar = document.querySelector(".bar");
const card = document.getElementById("card");
const catCard = document.getElementById("catCard");
const withdrawBtn = document.querySelector(".withdraw");
const upiInput = document.getElementById("upi");

coinBox.innerText = coins;

/************** QUIZ **************/
function startQuiz(){
  catCard.style.display = "none";
  index = 0;
  loadQuestion();
}

function loadQuestion(){
  clearInterval(timer);
  time = 10;
  timeBox.innerText = time;
  bar.style.width = "100%";

  const q = questions[index];
  card.innerHTML =
    `<h3>${q.q}</h3>` +
    q.o.map(o => `<button class="opt" onclick="answer('${o}')">${o}</button>`).join("");

  timer = setInterval(() => {
    time--;
    timeBox.innerText = time;
    bar.style.width = (time * 10) + "%";
    if (time <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function answer(val){
  clearInterval(timer);
  const q = questions[index];

  document.querySelectorAll(".opt").forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === q.a) btn.style.background = "#22c55e";
    if (btn.innerText === val && val !== q.a) btn.style.background = "#ef4444";
  });

  if (val === q.a) {
    coins += 5;
    saveCoins();
  }

  setTimeout(nextQuestion, 700);
}

function nextQuestion(){
  index++;
  if (index >= questions.length) finishQuiz();
  else loadQuestion();
}

function finishQuiz(){
  card.innerHTML = `
    <h3>Questions Finished!</h3>
    <button class="reward-btn" onclick="watchAd()">Watch Ad & Get +20 Coins</button>
  `;
}

/************** AD (FAKE TIMER SAFE) **************/
function watchAd(){
  card.innerHTML = "<h3>Loading Ad...</h3>";
  setTimeout(() => {
    coins += 20;
    saveCoins();
    catCard.style.display = "block";
    card.innerHTML = "Select category & start quiz";
  }, 3000);
}

/************** COINS **************/
function saveCoins(){
  localStorage.setItem("coins", coins);
  coinBox.innerText = coins;
}

/************** WITHDRAW (FINAL FIX) **************/
withdrawBtn.onclick = () => {
  const upi = upiInput.value.trim();

  if (coins < 100) {
    alert("Minimum 100 coins required");
    return;
  }
  if (!upi) {
    alert("Enter UPI ID");
    return;
  }

  // Fire-and-forget POST (no CORS issues)
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coins: coins, upi: upi })
  });

  alert("Withdraw request submitted ✅");

  coins = 0;
  saveCoins();
  upiInput.value = "";
};
