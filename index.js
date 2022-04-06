var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const spaceship = new Sprite({
  position: {
    x: 150,
    y: 200,
  },
  imageSrc: "./img/spaceship.png",
  scale: 1.6,
  framesMax: 8,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 130,
  },
  imageSrc: "./img/martialArtistSprite/Idle.png",
  scale: 2.8,
  framesMax: 10,
  sprites: {
    idle: {
      imageSrc: "./img/martialArtistSprite/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "./img/martialArtistSprite/Run.png",
      framesMax: 8,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 500,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: 50,
    y: 0,
  },
  color: "blue",
});

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  spaceship.update();

  player.update();
  //enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detect for collision for player
  if (rectangularCollision(player, enemy)) {
    player.isAttacking = false;
    enemy.health -= 10;
    document.querySelector(".health-div-enemy").style.width =
      enemy.health + "%";
  }

  if (rectangularCollision(enemy, player)) {
    enemy.isAttacking = false;
    player.health -= 10;
    document.querySelector(".health-div-player").style.width =
      player.health + "%";
  }

  //end game based on health
  if (enemy.health === 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (!player.hasJumped) player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (!enemy.hasJumped) enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    default:
      break;
  }
});
