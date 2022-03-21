/* -------------------------------------------------------------------------- */
/*                              GLOBAL VARIABLES                              */
/* -------------------------------------------------------------------------- */
let isRolled = false;
let activePlayer = "one";
let currentScore = 0;
let playersTotalScore = { one: 0, two: 0 };
let endGame = false;
let comRollDice = null;
/* -------------------------------------------------------------------------- */
/*                           FOR RANDOM DICE NUMBER                           */
/* -------------------------------------------------------------------------- */
let rollButton = document.querySelector(".roll__button");
let diceImage = document.images[0];
let optionsButton = document.querySelectorAll(
  ".game__options button:not(:first-of-type)",
);

rollButton.addEventListener("click", rollDice);

function rollDice() {
  isRolled = true;
  let randomDice = Math.trunc(Math.random() * 6) + 1;
  diceImage.classList.remove("hidden");
  diceImage.src = `./images/dice-${randomDice}.png`;
  increaseCurrentScore(randomDice);
}

function increaseCurrentScore(randomDice) {
  let currentPlayerScore = document.querySelector(
    `.player__${activePlayer}CurrentScore h5`,
  );
  if (randomDice !== 1) {
    currentPlayerScore.textContent = currentScore += randomDice;
  } else {
    switchPlayer(currentPlayerScore);
  }
}

function switchPlayer(currentPlayerScore) {
  isRolled = false;
  currentPlayerScore.textContent = currentScore = 0;
  document.querySelector(`.player__${activePlayer}`).classList.toggle("active");
  if (activePlayer === "one") {
    activePlayer = "two";
    optionsButton.forEach((button) => button.setAttribute("disabled", true));
    comRollTurn();
  } else {
    activePlayer = "one";
    optionsButton.forEach((button) => button.removeAttribute("disabled"));
    clearInterval(comRollDice);
  }
  document.querySelector(`.player__${activePlayer}`).classList.toggle("active");
}
/* -------------------------------------------------------------------------- */
/*                               FOR HOLD SCORE                               */
/* -------------------------------------------------------------------------- */
let holdButton = document.querySelector(".hold__button");
let winningMessage = document.querySelector(".winnig__message");

holdButton.addEventListener("click", holdScore);

function holdScore() {
  if (isRolled) {
    let currentPlayerScore = document.querySelector(
      `.player__${activePlayer}CurrentScore h5`,
    );
    let totalScore = document.querySelector(
      `.player__${activePlayer}TotalScore h3`,
    );
    let playerProgress = document.querySelector(
      `.player__${activePlayer}TotalScore progress`,
    );
    totalScore.textContent =
      playerProgress.value =
      playersTotalScore[activePlayer] +=
        currentScore;
    checkWinner(totalScore);
    if (endGame) {
      disabledButtons();
      clearInterval(comRollDice);
    } else {
      switchPlayer(currentPlayerScore);
    }
  }
}

function checkWinner(totalScore) {
  let scoreNumber = totalScore.textContent;
  if (scoreNumber >= 100) {
    let message = document.querySelector(".winnig__message h2");
    message.textContent = `congratulations ${
      activePlayer === "one" ? "PLAYER 1" : "COM"
    } 🥳🎇`;
    winningMessage.classList.remove("hidden");
    endGame = true;
  }
}
/* -------------------------------------------------------------------------- */
/*                            DISABLED ALL BUTTONS                            */
/* -------------------------------------------------------------------------- */
let allOptionsButton = document.querySelectorAll(".game__options button");
function disabledButtons() {
  allOptionsButton.forEach((button) => button.setAttribute("disabled", true));
}
/* -------------------------------------------------------------------------- */
/*                                FOR NEW GAME                                */
/* -------------------------------------------------------------------------- */
let newGameButton = document.querySelector(".new__gameButton");
let allPlayerProgress = document.querySelectorAll(`progress`);
newGameButton.addEventListener("click", function () {
  currentScore = 0;
  activePlayer = "one";
  endGame = false;
  for (let key in playersTotalScore) {
    playersTotalScore[key] = 0;
    document.querySelector(`.player__${key}TotalScore h3`).textContent = 0;
    document.querySelector(`.player__${key}CurrentScore h5`).textContent = 0;
  }
  diceImage.classList.add("hidden");
  allOptionsButton.forEach((button) => button.removeAttribute("disabled"));
  allPlayerProgress.forEach((progress) => (progress.value = 0));
});
/* -------------------------------------------------------------------------- */
/*                                FOR COM TURN                                */
/* -------------------------------------------------------------------------- */
function comRollTurn() {
  let randomRollTimes = Math.trunc(Math.random() * 6) + 1;
  comRollDice = setInterval(function () {
    rollDice();
    randomRollTimes--;
    if (randomRollTimes === 0) {
      holdScore();
    }
  }, 1000);
}
/* -------------------------------------------------------------------------- */
/*                         FOR CLOSING WINNING MESSAGE                        */
/* -------------------------------------------------------------------------- */
let closeButton = document.querySelector(".close__winningMessage");

closeButton.addEventListener("click", function () {
  winningMessage.classList.add("hidden");
  newGameButton.removeAttribute("disabled");
});

/* -------------------------------------------------------------------------- */
/*                                FOR APP SCALE                               */
/* -------------------------------------------------------------------------- */
let appContainer = document.querySelector(".app__container");
let pageWidth, pageHeight;
let basePage = {
  width: 1280,
  height: 960,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
};

function scaleApp() {
  getPageSize();
  scalePages(appContainer, pageWidth, pageHeight);
}
scaleApp();

function getPageSize() {
  pageWidth = window.innerWidth;
  pageHeight = window.innerHeight;
}

function scalePages(page, maxWidth, maxHeight) {
  let scaleX = 1,
    scaleY = 1;
  scaleX = maxWidth / basePage.width;
  scaleY = maxHeight / basePage.height;
  basePage.scaleX = scaleX;
  basePage.scaleY = scaleY;
  basePage.scale = scaleX > scaleY ? scaleY : scaleX;
  let newLeftPos = Math.abs(
    Math.floor((basePage.width * basePage.scale - maxWidth) / 2),
  );
  page.style.transform = `scale(${basePage.scale})`;
  page.style.left = `${newLeftPos}px`;
}

window.addEventListener("resize", scaleApp);
