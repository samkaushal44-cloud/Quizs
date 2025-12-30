let coins = 0;
let index = 0;
let time = 10;
let timer;

const questions = [
  {
    q: "Capital of India?",
    o: ["Delhi","Mumbai","Chennai","Kolkata"],
    a: "Delhi",
    level: "GK"
  },
  {
    q: "First PM of India?",
    o: ["Gandhi","Nehru","Patel","Bose"],
    a: "Nehru",
    level: "History"
  }
];

const qEl = document.getElementById("question");
const optEls = document.querySelectorAll(".option");
const timeEl = document.getElementById("time");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");
const progress = document.getElementById("progress");

function loadQuestion() {
  clearInterval(timer);
  time = 10;
  timeEl.innerText = time;
  progress.style.width = "100%";

  const q = questions[index % questions.length];
  qEl.innerText = q.q;
  levelEl.innerText = q.level;

  optEls.forEach((btn,i)=>{
    btn.innerText = q.o[i];
    btn.className = "option";
    btn.disabled = false;
    btn.onclick = () => checkAnswer(btn.innerText);
  });

  timer = setInterval(()=>{
    time--;
    timeEl.innerText = time;
    progress.style.width = (time*10)+"%";

    if(time<=0){
      clearInterval(timer);
      showCorrect(q.a);
      next();
    }
  },1000);
}

function checkAnswer(ans){
  clearInterval(timer);
  const correct = questions[index % questions.length].a;

  optEls.forEach(b=>{
    b.disabled = true;
    if(b.innerText===correct) b.classList.add("correct");
  });

  if(ans===correct){
    coins += 10;
    coinsEl.innerText = coins;
  } else {
    optEls.forEach(b=>{
      if(b.innerText===ans) b.classList.add("wrong");
    });
  }

  next();
}

function showCorrect(ans){
  optEls.forEach(b=>{
    if(b.innerText===ans) b.classList.add("correct");
  });
}

function next(){
  setTimeout(()=>{
    index++;
    loadQuestion();
  },1500);
}

function withdraw(){
  if(coins < 100) alert("Minimum 100 coins required");
  else alert("Withdraw request sent!");
}

loadQuestion();
