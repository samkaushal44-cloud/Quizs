<script>
/* ================== CONFIG ================== */
const API_BASE = "https://opentdb.com/api.php";
const TOKEN_URL = "https://opentdb.com/api_token.php?command=request";
const BATCH_SIZE = 10; // ek batch me kitne questions
const CATEGORY = 9;    // General Knowledge
const TYPE = "multiple";
const TIME_LIMIT = 10;

/* ================== STATE ================== */
let token = "";
let questions = [];
let usedSet = new Set(); // safety net
let currentIndex = 0;
let coins = 0;
let timer = null;
let timeLeft = TIME_LIMIT;

/* ================== DOM ================== */
const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const bar = document.getElementById("bar");
const coinEl = document.getElementById("coins");

/* ================== HELPERS ================== */
function decode(t){ const x=document.createElement("textarea"); x.innerHTML=t; return x.value; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ================== TOKEN ================== */
async function getToken(){
  const r = await fetch(TOKEN_URL);
  const d = await r.json();
  token = d.token;
}

/* ================== LOAD BATCH ================== */
async function loadBatch(){
  if(!token) await getToken();

  const url = `${API_BASE}?amount=${BATCH_SIZE}&category=${CATEGORY}&type=${TYPE}&token=${token}`;
  const r = await fetch(url);
  const d = await r.json();

  // token exhausted → reset
  if(d.response_code === 4){
    await getToken();
    return loadBatch();
  }

  // map + de-dup (extra safety)
  const mapped = d.results.map(q=>{
    const opts = shuffle([...q.incorrect_answers, q.correct_answer].map(decode));
    return {
      q: decode(q.question),
      o: opts,
      a: decode(q.correct_answer),
      key: decode(q.question) // unique key
    };
  }).filter(q => !usedSet.has(q.key));

  // mark used
  mapped.forEach(q => usedSet.add(q.key));

  questions = mapped;
  currentIndex = 0;

  // agar batch me kuch nahi bacha → next batch
  if(questions.length === 0){
    return loadBatch();
  }

  showQuestion();
}

/* ================== SHOW QUESTION ================== */
function showQuestion(){
  clearInterval(timer);
  timeLeft = TIME_LIMIT;
  bar.style.width = "100%";

  const q = questions[currentIndex];
  qEl.innerText = q.q;
  optEl.innerHTML = "";

  q.o.forEach(txt=>{
    const d = document.createElement("div");
    d.className = "option";
    d.innerText = txt;
    d.onclick = ()=>selectAnswer(txt, d);
    optEl.appendChild(d);
  });

  timer = setInterval(()=>{
    timeLeft--;
    bar.style.width = (timeLeft * 10) + "%";
    if(timeLeft <= 0){
      clearInterval(timer);
      revealCorrect();
    }
  },1000);
}

/* ================== ANSWER ================== */
function selectAnswer(ans, el){
  clearInterval(timer);
  document.querySelectorAll(".option").forEach(o=>o.classList.add("disabled"));
  const correct = questions[currentIndex].a;

  if(ans === correct){
    el.classList.add("correct");
    coins += 10;
    coinEl.innerText = coins;
  }else{
    el.classList.add("wrong");
    document.querySelectorAll(".option").forEach(o=>{
      if(o.innerText === correct) o.classList.add("correct");
    });
  }
  setTimeout(nextQuestion, 2000);
}

function revealCorrect(){
  document.querySelectorAll(".option").forEach(o=>{
    if(o.innerText === questions[currentIndex].a) o.classList.add("correct");
  });
  setTimeout(nextQuestion, 2000);
}

/* ================== NEXT ================== */
function nextQuestion(){
  currentIndex++;
  if(currentIndex >= questions.length){
    // batch khatam → next batch (still no repeat)
    loadBatch();
  }else{
    showQuestion();
  }
}

/* ================== ADS & WITHDRAW (same as before) ================== */
function watchAd(){
  coins += 20;
  coinEl.innerText = coins;
  alert("Ad watched! +20 coins");
}
function openWithdraw(){
  if(coins < 100){ alert("Minimum 100 coins required"); return; }
  document.getElementById("withdrawModal").style.display="flex";
}
function closeWithdraw(){
  document.getElementById("withdrawModal").style.display="none";
}
function submitWithdraw(){
  const upi = document.getElementById("upi").value.trim();
  if(!upi.includes("@")){ document.getElementById("msg").innerText="Invalid UPI"; return; }
  document.getElementById("msg").innerText="Request submitted!";
  coins = 0; coinEl.innerText = 0;
  setTimeout(closeWithdraw,1500);
}

/* ================== START ================== */
loadBatch();
</script>
