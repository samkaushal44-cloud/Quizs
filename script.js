const questions = [
  {
    q: "In ancient Greece, what was considered a source of wise counsel?",
    options: ["Weasel", "Titan", "Oracle", "Archon"],
    answer: 2
  },
  {
    q: "Who was the first Prime Minister of India?",
    options: ["Gandhi", "Jawaharlal Nehru", "Patel", "Rajendra Prasad"],
    answer: 1
  },
  {
    q: "India got independence in which year?",
    options: ["1942", "1945", "1947", "1950"],
    answer: 2
  }
];

let index = 0;
let coins = 0;
let time = 10;
let timer;

const questionEl = document.getElementById("question");
const options = document.querySelectorAll(".option");
const coinsEl = document.getElementById("coins");
const timeEl = document.getElementById("time");
const progressEl = document.getElementById("progress");

function loadQuestion() {
  clearInterval(timer);
  time = 10;
  timeEl.innerText = time;
  progressEl.style.width = "100%";

  const q = questions[index];
  questionEl.innerText = q.q;

  options.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.className = "option";
    btn.disabled = false;
  });

  timer = setInterval(() => {
    time--;
    timeEl.innerText = time;
    progressEl.style.width = (time * 10) + "%";

    if (time === 0) {
      showCorrect();
      clearInterval(timer);
    }
  }, 1000);
}

function showCorrect() {
  const correct = questions[index].answer;
  options[correct].classList.add("correct");
  options.forEach(b => b.disabled = true);
}

options.forEach((btn, i) => {
  btn.onclick = () => {
    clearInterval(timer);
    const correct = questions[index].answer;

    options.forEach(b => b.disabled = true);

    if (i === correct) {
      btn.classList.add("correct");
      coins += 10;
      coinsEl.innerText = "Coins: " + coins;
      setTimeout(nextQuestion, 800);
    } else {
      btn.classList.add("wrong");
      options[correct].classList.add("correct");
    }
  };
});

function nextQuestion() {
  index++;
  if (index >= questions.length) index = 0;
  loadQuestion();
}

loadQuestion();
