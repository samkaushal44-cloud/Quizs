let index = 0;
let quiz = [
  {
    q: "India ka capital kya hai?",
    options: { A: "Delhi", B: "Mumbai", C: "Jaipur", D: "Chennai" },
    ans: "A"
  }
];

function loadQuestion() {
  let q = quiz[index];
  document.getElementById("question").innerText = q.q;
  document.getElementById("A").innerText = q.options.A;
  document.getElementById("B").innerText = q.options.B;
  document.getElementById("C").innerText = q.options.C;
  document.getElementById("D").innerText = q.options.D;
}

function checkAnswer(option) {
  let btn = document.getElementById(option);
  let correct = quiz[index].ans;

  // 🔥 RESET classes (VERY IMPORTANT)
  btn.classList.remove("correct", "wrong");
  void btn.offsetWidth; // 🔥 FORCE REFLOW

  if (option === correct) {
    btn.classList.add("correct");

    setTimeout(() => {
      btn.classList.remove("correct");
      index = 0;
      loadQuestion();
    }, 600);

  } else {
    btn.classList.add("wrong");

    setTimeout(() => {
      btn.classList.remove("wrong");
    }, 500);
  }
}

loadQuestion();
