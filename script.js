let coins = 0;
let index = 0;
let timer;
let timeLeft = 10;
let answered = false;

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
  },
  {
    q: "Who wrote Ramayana?",
    o: ["Valmiki","Tulsidas","Ved Vyas","Kalidas"],
    a: "Valmiki",
    level: "History"
  }
];

const qEl = document.getElementById("question");
const opts = document.querySelectorAll(".option");
const timeEl = document.getElementById("time");
const bar = document.querySelector(".progress-bar");
const coinsEl = document.getElementById("coins");
const levelEl = document.getElementById("level");

function loadQuestion() {
  answered = false;
  clearInterval(timer);

  const q = questions[index % questions.length];
  qEl.innerText = q.q;
  levelEl.innerText = q.level;

  opts.forEach((b,i)=>{
    b.innerText = q.o[i];
    b.className = "option";
    b.disabled = false;
  });

  startTimer(q.a);
}

function startTimer(correct) {
  timeLeft = 10;
  timeEl.innerText = timeLeft+"s";
  bar.style.width = "100%";

  timer = setInterval(()=>{
    timeLeft--;
    timeEl.innerText = timeLeft+"s";
    bar.style.width = (timeLeft*10)+"%";

    if(timeLeft<=0){
      clearInterval(timer);
      showCorrect(correct);
      next();
    }
  },1000);
}

opts.forEach(btn=>{
  btn.onclick = ()=>{
    if(answered) return;
    answered = true;
    clearInterval(timer);

    const correct = questions[index % questions.length].a;

    opts.forEach(b=>{
      b.disabled = true;
      if(b.innerText===correct) b.classList.add("correct");
    });

    if(btn.innerText!==correct){
      btn.classList.add("wrong");
    } else {
      coins+=10;
      coinsEl.innerText=coins;
    }

    next();
  };
});

function showCorrect(ans){
  opts.forEach(b=>{
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
  if(coins<100){
    alert("Minimum 100 coins needed");
  }else{
    alert("Withdraw request sent!");
    coins=0;
    coinsEl.innerText=coins;
  }
}

loadQuestion();
