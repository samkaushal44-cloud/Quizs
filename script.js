let coins = 0;
let index = 0;
let time = 10;
let timer;
let answered = false;

const questions = [
  {q:"Capital of India?", o:["Delhi","Mumbai","Chennai","Kolkata"], a:0},
  {q:"Who wrote National Anthem?", o:["Tagore","Premchand","Bankim","Nehru"], a:0},
  {q:"Taj Mahal is in?", o:["Agra","Delhi","Jaipur","Bhopal"], a:0},
  {q:"Father of Nation?", o:["Gandhi","Nehru","Patel","Bose"], a:0},
  {q:"Largest state of India?", o:["Rajasthan","UP","MP","Bihar"], a:0}
];

questions.sort(()=>Math.random()-0.5);

function loadQuestion(){
  if(index >= questions.length){
    document.getElementById("question").innerText = "Quiz Completed!";
    document.getElementById("options").innerHTML = "";
    return;
  }

  answered = false;
  time = 10;
  document.getElementById("time").innerText = "10s";
  document.getElementById("progress").style.width = "100%";

  const q = questions[index];
  document.getElementById("question").innerText = q.q;

  const optBox = document.getElementById("options");
  optBox.innerHTML = "";

  q.o.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = ()=>selectAnswer(btn,i);
    optBox.appendChild(btn);
  });

  startTimer();
}

function startTimer(){
  clearInterval(timer);
  timer = setInterval(()=>{
    time--;
    document.getElementById("time").innerText = time+"s";
    document.getElementById("progress").style.width = (time*10)+"%";
    if(time<=0){
      clearInterval(timer);
      showCorrect();
    }
  },1000);
}

function selectAnswer(btn,i){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].a;
  const buttons = document.querySelectorAll("#options button");

  if(i===correct){
    btn.classList.add("correct");
    coins+=10;
    document.getElementById("coins").innerText = coins;
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  setTimeout(()=>{
    index++;
    loadQuestion();
  },2000);
}

function showCorrect(){
  const buttons = document.querySelectorAll("#options button");
  buttons[questions[index].a].classList.add("correct");
  setTimeout(()=>{
    index++;
    loadQuestion();
  },2000);
}

function watchAd(){
  alert("Watching Ad...");
  setTimeout(()=>{
    coins+=20;
    document.getElementById("coins").innerText = coins;
    alert("You earned 20 coins!");
  },2000);
}

function withdraw(){
  if(coins<100){
    alert("Minimum 100 coins required");
    return;
  }
  const upi = prompt("Enter UPI ID:");
  if(upi){
    alert("Withdrawal request sent!\n( Demo only )");
    coins = 0;
    document.getElementById("coins").innerText = coins;
  }
}

loadQuestion();
