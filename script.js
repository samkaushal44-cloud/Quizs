let coins = 50;
const coinBox = document.getElementById("coins");

coinBox.innerText = coins;

function watchAd(){
  alert("Ad Playing...");
  coins += 20;
  coinBox.innerText = coins;
}
