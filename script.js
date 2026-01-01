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
const categoryPill = document.getElementById("category");
const withdrawBtn = document.querySelector(".withdraw");

coinBox.innerText = coins;

/************** START QUIZ **************/
function startQuiz(){
  catCard.style.display = "none";
  index = 0;
  loadQuestion();
}

/************** LOAD QUESTION **************/
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

/************** ANSWER **************/
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

  setTimeout(nextQuestion, 800);
}

/************** NEXT **************/
function nextQuestion(){
  index++;
  if (index >= questions.length) finishQuiz();
  else loadQuestion();
}

/************** FINISH **************/
function finishQuiz(){
  card.innerHTML = `
    <h3>Questions Finished!</h3>
    <button class="reward-btn" onclick="watchAd()">Watch Ad & Get +20 Coins</button>
  `;
}

/************** WATCH AD (SAFE) **************/
function watchAd(){
  card.innerHTML = "<h3>Loading Ad...</h3>";
  setTimeout(() => {
    coins += 20;
    saveCoins();
    catCard.style.display = "block";
    card.innerHTML = "Select category & start quiz";
  }, 3000);
}

/************** SAVE COINS **************/
function saveCoins(){
  localStorage.setItem("coins", coins);
  coinBox.innerText = coins;
}

/************** WITHDRAW (FINAL FIX – NO CORS) **************/
withdrawBtn.onclick = () => {
  const upi = document.getElementById("upi").value;

  if (coins < 100) {
    alert("Minimum 100 coins required");
    return;
  }
  if (!upi) {
    alert("Enter UPI ID");
    return;
  }

  // FIRE & FORGET (NO NETWORK ERROR)
  fetch("https://script.google.com/macros/s/AKfycby-GuITgMyVWXad-5N56VN3DKJLrhkwain4wBlI6o_IaGFn-2usHhV0HPqFR_0b2RBjyg/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coins: coins, upi: upi })
  });

  alert("Withdraw request submitted ✅");

  coins = 0;
  saveCoins();
  document.getElementById("upi").value = "";
};
