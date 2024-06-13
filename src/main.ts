import "./style.css";
import {
  canvasHeight,
  canvasWidth,
  platformHeight,
  platformWidth,
  random,
} from "./util";
import { Player } from "./player";
import { playerHeight, playerWidth } from "./util";
import { Platform } from "./platform";
export let playerX = canvasWidth / 2;
export let playerY = canvasHeight / 4;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

canvas.style.background = "url('/images/bg1.png')";
document.body.appendChild(canvas);

// Audio
import jump from "/audio/jump.wav";
const jumpSound = new Audio(jump) as HTMLAudioElement;

import gameOverAudio from "/audio/gameOver.mp3";
import { Monster } from "./monster";
const gameOversound = new Audio(gameOverAudio) as HTMLAudioElement;

//physics

let initialVelocityY = -10; //starting velocity Y
export let gravity = 0.4;

let score = 0;
let maxScore = 0;
let gameOver = false;

// highest score
export let highestScore: number = 0;
const storedHighestScore = localStorage.getItem("highestDoodle");
if (storedHighestScore) {
  highestScore = parseInt(storedHighestScore, 10);
}

let animationId: number;
const doodleLeft = new Image();
doodleLeft.src = "./images/doodLeft.png";

const doodleRight = new Image();
doodleRight.src = "/images/doodRight.png";

let doodle = new Player(
  doodleLeft,
  playerX,
  playerY,
  playerWidth,
  playerHeight,
  initialVelocityY,
  ctx
);

let left: boolean,
  right: boolean = false;

document.addEventListener("keydown", press);
document.addEventListener("keyup", release);

function press(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") {
    left = true;
  }
  if (e.key === "ArrowRight") {
    right = true;
  }
  if (gameOver) {
    if (e.key === " ") {
      location.reload();
    }
  }
}

function release(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") {
    left = false;
  }
  if (e.key === "ArrowRight") {
    right = false;
  }
}
export function gameLoop() {
  if (left) {
    playerX = playerX - 5;
    doodle.img = doodleLeft;
  }
  if (left && doodle.x < 0) {
    playerX = canvasWidth - 10;
  }
  if (right) {
    playerX = playerX + 5;
    doodle.img = doodleRight;
  }
  if (right && doodle.x > canvasWidth) {
    playerX = 0;
  }

  doodle.x = playerX;

  if (doodle.y > canvas.height) {
    gameOver = true;
  }
  if (doodle.y < 0) {
    doodle.y = 0;
  }
}

let platformArray: Platform[] = [];

let platformImage = new Image();
platformImage.src = "/images/platform.png";

let brokenImage = new Image();
brokenImage.src = "/images/borken.png";
let brokenImage2 = new Image();
brokenImage2.src = "/images/broken2.png";

function placePlatform() {
  platformArray = [];

  let platform = new Platform(
    platformImage,
    canvasWidth / 2,
    canvasHeight - 50,
    platformWidth,
    platformHeight,
    ctx
  );

  platformArray.push(platform);
  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor((Math.random() * canvasWidth * 3) / 4);
    let platform = new Platform(
      platformImage,
      randomX,
      canvasHeight - 75 * i - 150,
      platformWidth,
      platformHeight,
      ctx
    );
    platformArray.push(platform);
  }
  // let brokenPlatform = new Platform(
  //   brokenImage,
  //   100,
  //   -500,
  //   platformWidth,
  //   platformHeight,
  //   ctx
  // );

  // platformArray.push(brokenPlatform);
}
placePlatform();

let points: number = 0;

function showPlatform() {
  for (let i = 0; i < platformArray.length; i++) {
    let singlePlatform = platformArray[i];
    if (doodle.vy < 0 && doodle.y < canvasHeight / 4) {
      singlePlatform.y -= initialVelocityY;
    }

    if (detectCollision(doodle, singlePlatform) && doodle.vy >= 0) {
      jumpSound.play();
      if (doodle.y > 0) {
        doodle.vy = initialVelocityY;
      }
    }

    singlePlatform.drawPlatform();

    while (platformArray.length > 0 && platformArray[0].y >= canvasHeight) {
      platformArray.shift();
      newPlatform();
      points = 1;
    }
  }
}

function newPlatform() {
  let randomX = Math.floor((Math.random() * canvasWidth * 3) / 4);
  let platform = new Platform(
    platformImage,
    randomX,
    100,
    platformWidth,
    platformHeight,
    ctx
  );
  platformArray.push(platform);
}
const ignoreValue: number = 15;
function detectCollision(a: Player, b: Platform) {
  return (
    a.x + ignoreValue < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function updateGame() {
  animationId = requestAnimationFrame(updateGame);

  if (gameOver) {
    return;
  }
  ctx?.clearRect(0, 0, canvasWidth, canvasHeight);

  canvas.style.background = "url('/images/bg1.png')";
  doodle.drawPlayer();
  gameLoop();
  showPlatform();
  doodle.updatePlayer();
  updateScore();
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.fillText(`${score}`, 5, 20);

  if (gameOver) {
    gameOversound.play();
    ctx.fillStyle = "red";
    ctx.font = "22px sans-serif";

    ctx.fillText(`Your Score  ${score}`, canvasWidth / 4, 500);
    ctx.fillText(`HighestScore:  ${highestScore}`, canvasWidth / 4, 600);
    ctx.fillText(
      "Game Over: Press 'Space' to Restart",
      canvasWidth / 4,
      (canvasHeight * 7) / 9
    );
  }
}

// updateGame();

function firstShow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.background = "url('/images/bg.png')";
  ctx.fillStyle = "Red";
  ctx.font = "50px 'Indie Flower', cursive";

  ctx.fillText("Press Enter to Start", 90, 400);
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      updateGame();
    }
  });
}

firstShow();

function updateScore() {
  if (doodle.vy < 0) {
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    }
  } else if (doodle.vy >= 0) {
    maxScore -= points;
  }

  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestDoodle", highestScore.toString());
  }
}

// for add monster not done yet
let MonsterArray: Monster[] = [];

let monster = new Image();
monster.src = "/images/enemySheet.png";

function monsterPlace() {
  MonsterArray = [];
  for (let i = 0; i < 10; i++) {
    let monsterAppear = new Monster(
      monster,
      0,
      719,
      166,
      116,
      canvasWidth / 2,
      100,
      100,
      100,
      ctx
    );
    MonsterArray.push(monsterAppear);
  }
}

monsterPlace();

function monsterFunction() {
  for (let i = 0; i < MonsterArray.length; i++) {
    let newMonster = MonsterArray[i];
    newMonster.drawMonster();
  }
}
