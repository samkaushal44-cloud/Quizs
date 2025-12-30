let questions = [];
let index = 0;
let coins = 0;
let time = 10;
let timer;
let answered = false;

/* ELEMENTS */
const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const bar = document.getElementById("bar");
const timeText = document.getElementById("timeText");
const coinsEl = document.getElementById("coins");

/* FETCH QUESTIONS */
async function loadFromAPI(){
  try{
    const res = await fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple");
    const data = await res.json();

    questions = data.results.map(q => {
      const options = [...q.incorrect_answers];
      const correctIndex = Math.floor(Math.random() * 4);
      options.splice(correctIndex, 0, q.correct_answer);

      return {
        q: q.question.replace(/&quot;/g,'"'),
        o: options,
        a: correctIndex
      };
    });

    index = 0;
    loadQ();

  }catch(e){
    qEl.innerText = "Question load failed";
  }
}

/* LOAD QUESTION */
function loadQ(){
  clearInterval(timer);
  answered = false;

  if(index >= questions.length){
    loadFromAPI();
    return;
  }

  const q = questions[index];
  qEl.innerHTML = q.q;
  optEl.innerHTML = "";

  q.o.forEach((text,i)=>{
    const btn = document.createElement("button");
    btn.innerHTML = text;
    btn.onclick = ()=>selectAnswer(i);
    optEl.appendChild(btn);
  });

  startTimer();
}

/* TIMER */
function startTimer(){
  time = 10;
  bar.style.width = "100%";
  timeText.innerText = "Time: 10s";

  timer = setInterval(()=>{
    time--;
    bar.style.width = time*10 + "%";
    timeText.innerText = "Time: " + time + "s";

    if(time <= 0){
      clearInterval(timer);
      showCorrect();
      setTimeout(nextQ,1200);
    }
  },1000);
}

/* ANSWER */
function selectAnswer(i){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  const q = questions[index];
  const btns = optEl.children;

  btns[q.a].classList.add("correct");

  if(i === q.a){
    coins += 10;
    coinsEl.innerText = coins;
  }else{
    btns[i].classList.add("wrong");
  }

  setTimeout(nextQ,1200);
}

/* SHOW CORRECT */
function showCorrect(){
  optEl.children[questions[index].a].classList.add("correct");
}

/* NEXT */
function nextQ(){
  index++;
  loadQ();
}

/* START */
loadFromAPI();
