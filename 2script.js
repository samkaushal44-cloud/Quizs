const API_URL =
"https://script.google.com/macros/s/AKfycbwsNywylD9u2U0-37n7waUCpG4xXygSEs7tQ-UtYxM8k8LzQBEYN6cQcSCXcjga1iyl/exec";

let coins = Number(localStorage.getItem("coins") || 50);
document.getElementById("coins").innerText = coins;

function startQuiz(){
  coins += 10;
  saveCoins();
  document.getElementById("card").innerText = "Correct Answer! +10 coins";
}

function saveCoins(){
  localStorage.setItem("coins", coins);
  document.getElementById("coins").innerText = coins;
}

function withdraw(){
  const upi = document.getElementById("upi").value.trim();

  if(coins < 100){
    alert("Minimum 100 coins required");
    return;
  }
  if(!upi){
    alert("Enter UPI ID");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      coins: coins,
      upi: upi
    })
  });

  alert("Withdraw request sent ✅");
  coins = 0;
  saveCoins();
  document.getElementById("upi").value = "";
}

