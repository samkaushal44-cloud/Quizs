let coins = 0;
let time = 10;
let timer;
let answered = false;
let usedQuestions = [];

const apiURL = "https://opentdb.com/api.php?amount=50&category=9&type=multiple";

async function fetchQuestion() {
  document.getElementById("question").innerText = "Loading...";
  document.getElementById("options").innerHTML = "";

  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    let q = data.results.find(q => !usedQuestions.includes(q.question));

    if (!q) {
      usedQuestions = [];
      q = data.results[0];
    }

    usedQuestions.push(q.question);
    showQuestion(q);

  } catch {
    document.getElementById("question").innerText = "Error loading question";
  }
}

function showQuestion(q) {
  answered = false;
  time = 10;
  startTimer();

  document.getElementById("question").innerHTML = q.question;

  const opts = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
  const box = document.getElementById("options");

  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerHTML = opt;
    btn.onclick = () => selectAnswer(btn, opt === q.correct_answer);
    box.appendChild(btn);
  });
}

function selectAnswer(btn, correct) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  if (correct) {
    btn.classList.add("correct");
    coins += 10;
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll("#options button").forEach(b => {
      if (b.innerHTML === btn.parentNode.querySelector(".correct")?.innerHTML) {
        b.classList.add("correct");
      }
    });
  }

  document.getElementById("coins").innerText = "Coins: " + coins;

  setTimeout(fetchQuestion, 2000);
}

function startTimer() {
  clearInterval(timer);
  document.getElementById("progress").style.width = "100%";

  timer = setInterval(() => {
    time--;
    document.getElementById("progress").style.width = (time * 10) + "%";

    if (time <= 0) {
      clearInterval(timer);
      fetchQuestion();
    }
  }, 1000);
}

// Ads & Withdraw
document.getElementById("watchAd").onclick = () => {
  coins += 5;
  document.getElementById("coins").innerText = "Coins: " + coins;
  alert("Ad watched! +5 coins");
};

document.getElementById("withdrawBtn").onclick = () => {
  if (coins < 100) {
    alert("Minimum 100 coins required");
    return;
  }
  document.getElementById("withdrawModal").style.display = "flex";
};

function closeModal() {
  document.getElementById("withdrawModal").style.display = "none";
}

function confirmWithdraw() {
  const upi = document.getElementById("upi").value;
  if (!upi) return alert("Enter UPI ID");
  alert("Withdraw request sent!");
  coins = 0;
  document.getElementById("coins").innerText = "Coins: 0";
  closeModal();
}

// Start
fetchQuestion();
