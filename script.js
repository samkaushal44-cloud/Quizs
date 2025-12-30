let coins = 0;
let time = 10;
let timer;
let currentQuestion = null;
let answered = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const coinsEl = document.getElementById("coins");
const timeText = document.getElementById("timeText");
const progress = document.getElementById("progress");

document.getElementById("watchAd").onclick = () => {
  coins += 20;
  updateCoins();
  alert("🎉 You earned 20 coins!");
};

document.getElementById("withdraw").onclick = () => {
  if(coins < 100){
    alert("❌ Minimum 100 coins required");
  }else{
    alert("✅ Withdraw request sent!");
    coins = 0;
    updateCoins();
  }
};

function updateCoins(){
  coinsEl.innerText = "Coins: " + coins;
}

async function loadQuestion(){
  answered = false;
  optionsEl.innerHTML = "";
  questionEl.innerText = "Loading...";

  try{
    const res = await fetch(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );
    const data = await res.json();
    currentQuestion = data.results[0];

    const answers = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer
    ].sort(() => Math.random() - 0.5);

    questionEl.innerHTML = currentQuestion.question;

    answers.forEach(ans=>{
      const btn = document.createElement("button");
      btn.innerHTML = ans;
      btn.onclick = ()=>selectAnswer(ans,btn);
      optionsEl.appendChild(btn);
    });

    startTimer();

  }catch(e){
    questionEl.innerText = "Error loading question";
  }
}

function selectAnswer(ans,btn){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(b=>b.disabled=true);

  if(ans === currentQuestion.correct_answer){
    btn.classList.add("correct");
    coins += 10;
    updateCoins();
  }else{
    btn.classList.add("wrong");
    buttons.forEach(b=>{
      if(b.innerHTML === currentQuestion.correct_answer){
        b.classList.add("correct");
      }
    });
  }

  setTimeout(loadQuestion,2000);
}

function startTimer(){
  time = 10;
  progress.style.width = "100%";
  timeText.innerText = "Time: 10s";

  timer = setInterval(()=>{
    time--;
    timeText.innerText = "Time: " + time + "s";
    progress.style.width = (time*10)+"%";

    if(time<=0){
      clearInterval(timer);
      answered = true;
      loadQuestion();
    }
  },1000);
}

updateCoins();
loadQuestion();
