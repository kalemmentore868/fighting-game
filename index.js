var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

audio = document.querySelector("#audio");
audio.volume = 0.6;

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
    jump: {
      imageSrc: "./img/martialArtistSprite/Going Up.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/martialArtistSprite/Going Down.png",
      framesMax: 3,
    },
    attack2: {
      imageSrc: "./img/martialArtistSprite/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/martialArtistSprite/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/martialArtistSprite/Death.png",
      framesMax: 11,
    },
  },
  attackBox: {
    width: 150,
    height: 50,
    offset: {
      x: 230,
      y: 20,
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
    x: 170,
    y: 160,
  },
  imageSrc: "./img/KnightSprite/Idle.png",
  scale: 3,
  framesMax: 10,
  sprites: {
    idle: {
      imageSrc: "./img/KnightSprite/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "./img/KnightSprite/Run.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./img/KnightSprite/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/KnightSprite/Fall.png",
      framesMax: 2,
    },
    attack2: {
      imageSrc: "./img/KnightSprite/Attack3.png",
      framesMax: 5,
    },
    takeHit: {
      imageSrc: "./img/KnightSprite/Get Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/KnightSprite/Death.png",
      framesMax: 9,
    },
  },
  attackBox: {
    width: 150,
    height: 50,
    offset: {
      x: -150,
      y: 20,
    },
  },
  isEnemy: true,
});

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();

  spaceship.update();
  c.fillStyle = "rgba(255, 255, 255, 0.09)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  enemy.update();

  if (enemy.isBleeding) {
    enemy.blood.update();
  }

  if (player.isBleeding) {
    player.blood.update();
  }

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect for collision for player & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();

    player.isAttacking = false;

    gsap.to(".health-div-enemy", {
      width: enemy.health + "%",
    });
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 3
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to(".health-div-player", {
      width: player.health + "%",
    });
  }

  if (enemy.isAttacking && enemy.framesCurrent === 3) {
    enemy.isAttacking = false;
  }

  //end game based on health
  if (enemy.health === 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  audio.play();
  if (!player.dead) {
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
    }
  }

  if (!enemy.dead) {
    //enemy keys
    switch (event.key) {
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
