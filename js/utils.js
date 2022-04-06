function rectangularCollision(player, enemy) {
  return (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height &&
    player.isAttacking
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector(".result").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector(".result").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector(".result").innerHTML = "Player 1 Wins";
  } else {
    document.querySelector(".result").innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
