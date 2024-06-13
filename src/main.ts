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

let monstervelocity = 3;

//   Represents the main game canvas.
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

window.addEventListener("load", () => {
  canvas.style.background = "url('/images/bg.png')";
  document.body.appendChild(canvas);
});

// Audio
import jump from "/audio/jump.wav";
const jumpSound = new Audio(jump) as HTMLAudioElement;

import gameOverAudio from "/audio/gameOver.mp3";
import { Monster } from "./monster";
const gameOversound = new Audio(gameOverAudio) as HTMLAudioElement;

//physics

let initialVelocityY = -10;
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
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    left = true;
  }
  if (e.key === "ArrowRight" || e.key === "D" || e.key === "d") {
    right = true;
  }
  if (gameOver) {
    // click space
    if (e.key === " ") {
      location.reload();
    }
  }
}

function release(e: KeyboardEvent) {
  if (e.key === "ArrowLeft" || e.key === "A" || e.key === "a") {
    left = false;
  }
  if (e.key === "ArrowRight" || e.key === "D" || e.key === "d") {
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

/**
 *  It represents the make platform using for loop and append in platform array
 */

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
}
placePlatform();

let points: number = 0;

/**
 * it represents show platform in the canvas
 */
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

/**
 * It represents make new platforms if previous platform is off the screen
 */

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

/**
 *  It represents to check collision between player, platform and monster
 * @param a Player
 * @param b Platform | Monster
 * @returns boolean
 */

function detectCollision(a: Player, b: Platform | Monster) {
  return (
    a.x + ignoreValue < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
/**
 * It represents to update score
 */

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

let MonsterArray: Monster[] = [];

let monster = new Image();
monster.src = "/images/enemySheet.png";

/**
 * It represents the make monster and append in array
 */
function monsterPlace() {
  MonsterArray = [];
  let monsterAppear = new Monster(
    monster,
    0,
    719,
    166,
    116,
    random({ min: 0, max: canvasWidth - 80 }),
    -100,
    80,
    80,
    ctx
  );
  MonsterArray.push(monsterAppear);
}

/**
 * It represents the call monster according to probability
 */
function callmonsterFunction() {
  let probability = 0.001;
  let incrementRate = 0.001;
  let currentProbability = probability + incrementRate * score;
  currentProbability = Math.min(currentProbability, 1.0);

  let num = Math.random();
  if (num < probability) {
    monsterPlace();
  } else {
  }
}

/**
 * It represents the  show monster in screen and moving
 */
function monsterFunction() {
  for (let i = 0; i < MonsterArray.length; i++) {
    let newMonster = MonsterArray[i];
    newMonster.x += monstervelocity;
    if (newMonster.x + newMonster.width > canvasWidth) {
      monstervelocity *= -1;
    } else if (newMonster.x < 0) {
      newMonster.x *= -1;
    }
    newMonster.y += 4;
    if (detectCollision(doodle, newMonster)) {
      gameOver = true;
    }
    newMonster.drawMonster();
  }
}

/**
 * It is the main update function using request animation frame
 * It has calling function which needed to be call every frame
 * @returns if game over return
 */
function updateGame() {
  requestAnimationFrame(updateGame);
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
  monsterFunction();
  callmonsterFunction();
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.fillText(`${score}`, 5, 20);

  if (gameOver) {
    gameOversound.play();
    ctx.fillStyle = "red";
    ctx.font = "22px sans-serif";

    ctx.fillText(`Your Score  ${score}`, canvasWidth / 4, 500);
    ctx.fillText(`Highest Score:  ${highestScore}`, canvasWidth / 4, 600);
    ctx.fillText(
      "Game Over: Press 'Space' to Restart",
      canvasWidth / 4,
      (canvasHeight * 7) / 9
    );
  }
}

/**
 * It represents the first image  before start  game
 */
function firstShow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.background = "url('/images/bg.png')";
  ctx.fillStyle = "Red";
  ctx.font = "50px 'Indie Flower', cursive";

  ctx.fillText("Press Enter to Start", 90, 400);
  ctx.font = "40px 'Indie Flower', cursive";
  ctx.fillText("Navigate  a || d or arrowkey", 60, 210);
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      updateGame();
    }
  });
}

firstShow();
