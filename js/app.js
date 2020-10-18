/**
*
* Game object to store game data
*
*/

function Game() {
  this.turn = 0;
  this.symbols = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb",
  "diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
  this.allCards = [];
  let $this = this;
  document.getElementsByClassName("restart")[0].addEventListener("click", function() {
    $this.reset();
  });
  document.getElementsByClassName("play-again")[0].addEventListener("click", function() {
    $this.reset();
    document.getElementById("gameOver").style.display = "none";
  });
  document.getElementsByClassName("quit")[0].addEventListener("click", function() {
    document.getElementById("gameOver").style.display = "none";
    $this.stopTimer();
  });
  this.time = 0;
  this.clickCount = 0;
  this.stars = 3;
  this.matchedCards = [];
  this.openCards = [];
  this.shuffle(this.symbols);
  this.setup();
}

/**
*
* Shuffle method, adapted from function at http://stackoverflow.com/a/2450976
*
*/

Game.prototype.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
*
* Game setup method to generate card objects
*
*/

Game.prototype.setup = function() {
  for (let x = 0; x < this.symbols.length; x++) {
    let card = new Card(this.symbols[x], x);
    this.allCards.push(card);
  }
};

/**
*
* Method to increase turn count
*
*/

Game.prototype.upTurn = function() {
  this.calcStars();
  this.turn++;
  document.getElementsByClassName("moves")[0].innerHTML = this.turn;
};

/**
*
* Method to reset turn count
*
*/

Game.prototype.resetTurns = function() {
  this.turn = 0;
  document.getElementsByClassName("moves")[0].innerHTML = 0;
};

/**
*
* Method to start and end timer
*
*/

Game.prototype.setTimer = function(time) {
  document.getElementsByClassName("timer")[0].innerHTML = time + "s";
};

/**
*
* Method to calculate star level based upon user performance
*
*/

Game.prototype.calcStars = function() {
  let turns = this.turn,
  time = this.time;

  if (turns <= 12 && time < 60) {
    this.stars = 3;
  } else if (turns >= 13 && turns <= 16 && time < 60) {
    this.stars = 2.5;
  } else if (turns >= 17 && turns <=20 && time < 60) {
    this.stars = 2;
  } else if (turns >= 21 && turns <=24 && time < 60) {
    this.stars = 1.5;
  }

  if (turns >= 24) {
    this.stars = 1;
  }

  if (turns > 60) {
    this.stars = 1;
  }

  this.setStars();
};

/**
*
* Method to set star level based upon calculated value
*
*/

Game.prototype.setStars = function() {
  let stars = this.stars;
  document.getElementsByClassName("stars")[0].innerHTML = "";

  for (let x = 0; x < 3; x++) {
    let star = document.createElement("i");
    star.classList.add("fa");
    if (x === 0) {
      star.classList.add("fa-star");
    } else if (x === 1) {
      if (this.stars === 1) {
        star.classList.add("fa-star-o");
      } else if (this.stars === 1.5) {
        star.classList.add("fa-star-half-o");
      } else {
        star.classList.add("fa-star");
      }
    } else if (x === 2) {
      if (this.stars === 3) {
        star.classList.add("fa-star");
      } else if (this.stars === 2.5) {
        star.classList.add("fa-star-half-o");
      } else {
        star.classList.add("fa-star-o");
      }
    }
    document.getElementsByClassName("stars")[0].appendChild(star);
  }
  document.getElementsByClassName("rating")[0].innerHTML = "Rating: " + document.getElementsByClassName("stars")[0].innerHTML;
};

/**
*
* Method to reset game
*
*/

Game.prototype.reset = function() {
  document.getElementsByClassName("deck")[0].innerHTML = "";
  this.resetTurns();
  this.symbols = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb",
  "diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
  this.allCards = [];
  this.openCards = [];
  this.matchedCards = [];
  this.stopTimer();
  this.time = 0;
  this.setTimer(this.time);
  this.clickCount = 0;
  this.stars = 3;
  this.calcStars();
  this.shuffle(this.symbols);
  this.setup();
};

/**
*
*
* Method to clear intervals
*
*/

Game.prototype.stopTimer = function() {
  for (let i = 0; i < 999; i++) {
    clearInterval(i);
  }
};

/**
*
* Method to check whether the game is over
*
*/

Game.prototype.checkStatus = function() {
  if (game.matchedCards.length === 16) {
    document.getElementById("gameOver").style.display = "inline";
    document.getElementsByClassName("turnNum")[0].innerHTML = this.turn;
    document.getElementsByClassName("time-seconds")[0].innerHTML = this.time;
  }
};

/**
*
* Instantiate new game object
*
*/

const game = new Game();

/**
*
* Card object to store individual card data
*
*/

function Card(symbol, id) {
  this.symbol = symbol;
  this.id = id;
  let $this = this;

  let card = document.createElement("li"),
  icon = document.createElement("i");

  card.classList.add("card");
  card.id = this.id;
  document.getElementsByClassName("deck")[0].appendChild(card);
  icon.classList.add("fa");
  icon.classList.add("fa-" + this.symbol);
  card.appendChild(icon);

  card.addEventListener("click", function() {
    $this.registerClick($this);
  });

}

/**
*
* Register clicks on cards
*
*/

Card.prototype.registerClick = function($this) {
  const count = game.openCards.length;
  const showTime = 500;

  if (count === 2) {
    return;
  }

  if (game.openCards[0] === $this) {
    return;
  }

  game.clickCount++;

  if (game.clickCount === 1) {
    setInterval(function() {
      game.time++;
      game.setTimer(game.time);
    }, 1000);
  }
  document.getElementById($this.id).classList.add("open");
  document.getElementById($this.id).classList.add("show");
  if (count === 0) {
    game.openCards.push($this);
  } else if (count === 1) {
    game.openCards.push($this);
    if (game.openCards[0] === $this) {
      return;
    } else if ($this.symbol === game.openCards[0].symbol) {
      game.upTurn();
      setTimeout(function() {
        document.getElementById($this.id).classList.add("match");
        document.getElementById(game.openCards[0].id).classList.add("match");
        game.openCards = [];
        game.matchedCards.push($this, game.openCards[0]);
        game.checkStatus();
      }, showTime);
    } else if ($this.symbol !== game.openCards[0].symbol) {
      game.upTurn();
      setTimeout(function() {
        document.getElementById($this.id).classList.remove("open");
        document.getElementById($this.id).classList.remove("show");
        document.getElementById(game.openCards[0].id).classList.remove("open");
        document.getElementById(game.openCards[0].id).classList.remove("show");
        game.openCards = [];
      }, showTime);
    }
  }
}
