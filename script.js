const questions = [
  {q:"India capital?", o:["Delhi","Mumbai","Kolkata","Chennai"], a:0},
  {q:"2 + 2 = ?", o:["3","4","5","6"], a:1},
  {q:"Sun rises from?", o:["North","South","East","West"], a:2},
  {q:"HTML use for?", o:["Design","Structure","DB","Server"], a:1},
  {q:"CSS full form?", o:["Style","Sheet","Cascading Style Sheets","Code"], a:2}
];

let index = 0;
let coins = 0;

const qBox = document.getElementById("question");
const optBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const coinBox = document.getElementById("coins");

function loadQuestion(){
  const q = questions[index];
  qBox.innerText = q.q;
  optBox.innerHTML = "";
  nextBtn.style.display = "none";

  q.o.forEach((text,i)=>{
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = text;
    div.onclick = ()=>checkAnswer(div,i);
    optBox.appendChild(div);
  });
}

function checkAnswer(el,i){
  const q = questions[index];
  const options = document.querySelectorAll(".option");
  options.forEach(o=>o.onclick=null);

  if(i === q.a){
    el.classList.add("correct");
    coins += 10;
  }else{
    el.classList.add("wrong");
    options[q.a].classList.add("correct");
  }

  coinBox.innerText = coins;
  nextBtn.style.display = "block";
}

nextBtn.onclick = ()=>{
  index++;
  if(index >= questions.length){
    alert("Quiz Finished! Coins: " + coins);
    index = 0;
    coins = 0;
    coinBox.innerText = coins;
  }
  loadQuestion();
};

loadQuestion();
