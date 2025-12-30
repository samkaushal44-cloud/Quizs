let coins = 0;
let index = 0;

const quiz = [

  {
    level: "Easy",
    q: "India ka capital kya hai?",
    options: { A: "Delhi", B: "Mumbai", C: "Jaipur", D: "Chennai" },
    ans: "A",
    reward: 5
  },

  {
    level: "Medium",
    q: "Taj Mahal kis nadi ke kinare hai?",
    options: { A: "Ganga", B: "Yamuna", C: "Narmada", D: "Godavari" },
    ans: "B",
    reward: 10
  },

  {
    level: "Hard",
    q: "Human body ki sabse badi gland kaun si hai?",
    options: { A: "Thyroid", B: "Pituitary", C: "Liver", D: "Pancreas" },
    ans: "C",
    reward: 20
  },

  {
    level: "Hard",
    q: "Article 32 kis adhikar se sambandhit hai?",
    options: {
      A: "Right to Equality",
      B: "Right to Freedom",
      C: "Right to Constitutional Remedies",
      D: "Right to Education"
    },
    ans: "C",
    reward: 25
  },

  {
    level: "Extreme",
    q: "DNA ka full form kya hai?",
    options: {
      A: "Deoxyribo Nucleic Acid",
      B: "Deoxyribo Nuclear Acid",
      C: "Deoxyribo Natural Acid",
      D: "None"
    },
    ans: "A",
    reward: 30
  }
];

function loadQuestion() {
  document.getElementById("question").innerText = quiz[index].q;
  document.getElementById("A").innerText = quiz[index].options.A;
  document.getElementById("B").innerText = quiz[index].options.B;
  document.getElementById("C").innerText = quiz[index].options.C;
  document.getElementById("D").innerText = quiz[index].options.D;
  document.getElementById("level").innerText = "Level: " + quiz[index].level;
}

function checkAnswer(option) {
  if (option === quiz[index].ans) {
    coins += quiz[index].reward;
    document.getElementById("coins").innerText = "Coins: " + coins;

    // ✅ Correct answer → auto next (0.7 sec)
    setTimeout(() => {
      nextQuestion();
    }, 700);

  } else {
    alert("❌ Wrong Answer");
  }
}

function nextQuestion() {
  index++;
  if (index >= quiz.length) {
    alert("🎉 Quiz Finished!");
    index = 0;
  }
  loadQuestion();
}

function watchAd() {
  coins += 20;
  alert("📺 Ad Watched! +20 Coins");
  document.getElementById("coins").innerText = "Coins: " + coins;
}

loadQuestion();