document.addEventListener("DOMContentLoaded", () => {

  const questions = [
    {
      q: "In ancient Greece, what was considered a source of wise counsel?",
      o: ["Weasel", "Titan", "Oracle", "Archon"],
      a: 2
    },
    {
      q: "Who was the first Prime Minister of India?",
      o: ["Gandhi", "Jawaharlal Nehru", "Patel", "Rajendra Prasad"],
      a: 1
    },
    {
      q: "India got independence in which year?",
      o: ["1942", "1945", "1947", "1950"],
      a: 2
    }
  ];

  let index = 0;
  let coins = 0;
  let time = 10;
  let timer;

  const question = document.getElementById("question");
  const options = document.querySelectorAll(".option");
  const coinsEl = document.getElementById("coins");
  const timeEl = document.getElementById("time");
  const progress = document.getElementById("progress");

  function loadQuestion() {
    clearInterval(timer);
    time = 10;
    timeEl.innerText = time;
    progress.style.width = "100%";

    const q = questions[index];
    question.innerText = q.q;

    options.forEach((btn, i) => {
      btn.innerText = q.o[i];
      btn.className = "option";
      btn.disabled = false;
    });

    timer = setInterval(() => {
      time--;
      timeEl.innerText = time;
      progress.style.width = (time * 10) + "%";

      if (time === 0) {
        showCorrect();
        clearInterval(timer);
      }
    }, 1000);
  }

  function showCorrect() {
    const correct = questions[index].a;
    options[correct].classList.add("correct");
    options.forEach(b => b.disabled = true);
  }

  options.forEach((btn, i) => {
    btn.onclick = () => {
      clearInterval(timer);
      const correct = questions[index].a;

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
});
