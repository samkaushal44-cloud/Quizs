/************** DATA ****************/

const offlineQuestions = [
  {q:"India capital?", o:["Delhi","Mumbai","Kolkata","Chennai"], a:"Delhi"},
  {q:"2 + 2 = ?", o:["3","4","5","6"], a:"4"},
  {q:"Sun rises from?", o:["North","South","East","West"], a:"East"},
  {q:"HTML is used for?", o:["Design","Structure","DB","Server"], a:"Structure"},
  {q:"CSS full form?", o:["Style","Sheet","Cascading Style Sheets","Code"], a:"Cascading Style Sheets"},
  {q:"5 × 5 = ?", o:["10","20","25","30"], a:"25"},
  {q:"RAM is?", o:["CPU","GPU","Memory","Disk"], a:"Memory"},
  {q:"HTTP is?", o:["Protocol","Language","Server","OS"], a:"Protocol"},
  {q:"India PM?", o:["Modi","Rahul","Kejriwal","Amit"], a:"Modi"},
  {q:"Taj Mahal in?", o:["Delhi","Agra","Jaipur","Bhopal"], a:"Agra"}
];

/************** STATE ****************/

let coins = Number(localStorage.getItem("coins") || 50);
let questions = [];
let index = 0;
let timer, time = 10;

/************** ELEMENTS ****************/

const coinBox = document.getElementById("coins");
const timeBox = document.getElementById("time");
const bar = document.querySelector(".bar");
const card = document.getElementById("card");
const catCard = document.querySelector("select").parentElement;

/************** INIT ****************/

coinBox.innerText = coins;

/************** START QUIZ ****************/

function startQuiz(){
  catCard.style.display = "none";   // hide category
  index = 0;
  fetchQuestions();
}

/************** FETCH QUESTIONS ****************/

function fetchQuestions(){
  const cat = document.getElementById("catSelect").value;

  fetch(`https://opentdb.com/api.php?amount=10&category=${cat}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      if(!data.results || data.results.length === 0) throw "API error";

      questions = data.results.map(q => {
        const opts = [...q.incorrect_answers, q.correct_answer].sort();
        return { q: q.question, o: opts, a: q.correct_answer };
      });

      loadQuestion();
    })
    .catch(() => {
      questions = offlineQuestions;
      loadQuestion();
    });
}

/************** LOAD QUESTION ****************/

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

    if(time <= 0){
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

/************** ANSWER ****************/

function answer(val){
  clearInterval(timer);
  const q = questions[index];
  const opts = document.querySelectorAll(".opt");

  opts.forEach(btn => {
    btn.disabled = true;
    if(btn.innerText === q.a) btn.style.background = "#22c55e";
    if(btn.innerText === val && val !== q.a) btn.style.background = "#ef4444";
  });

  if(val === q.a){
    coins += 5;
    saveCoins();
  }

  setTimeout(nextQuestion, 800);
}

/************** NEXT ****************/

function nextQuestion(){
  index++;
  if(index >= questions.length){
    finishQuiz();
  } else {
    loadQuestion();
  }
}

/************** FINISH ****************/

function finishQuiz(){
  card.innerHTML = `
    <h2>Questions Finished!</h2>
    <button class="reward-btn" onclick="watchAd()">🎥 Watch Ad & Get +20 Coins</button>
  `;
}

/************** AD + RESTART QUIZ ****************/

function watchAd(){
  // simulate ad
  card.innerHTML = `<h3>Ad Playing...</h3><p>Please wait</p>`;

  setTimeout(() => {
    coins += 20;
    saveCoins();

    // RESET QUIZ
    index = 0;
    catCard.style.display = "block";   // show category again
    card.innerHTML = `<h3>Select category & start new quiz</h3>`;
  }, 3000);
}

/************** SAVE ****************/

function saveCoins(){
  localStorage.setItem("coins", coins);
  coinBox.innerText = coins;
}

/************** WITHDRAW ****************/

document.querySelector(".withdraw").onclick = () => {
  const upi = document.getElementById("upi").value;
  if(coins < 100) alert("Minimum 100 coins required");
  else if(!upi) alert("Enter UPI ID");
  else alert("Withdraw request sent");
};
