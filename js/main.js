/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();

/*----- app's state (variables) -----*/
let shuffledDeck ;
let playerHand = [];
let dealerHand = [];
// let isPlayerTurn = true;
let balance = 5000
let currentBet = 0;

/*----- cached element references -----*/
const dealerHandContainer = document.getElementById('dealer-hand');
const playerHandContainer = document.getElementById('player-hand');
const messageEl = document.getElementById('message');
const balanceEl = document.getElementById('balance');
const currentBetEl = document.getElementById('current-bet');

/*----- event listeners -----*/
document.getElementById('hit-btn').addEventListener('click', playerHit);
document.getElementById('stand-btn').addEventListener('click', playerStand);
document.getElementById('restart-btn').addEventListener('click', startGame);
document.querySelectorAll('.bet-btn').forEach(button => {
  button.addEventListener('click', placeBet);
});

/*----- functions -----*/


function getNewShuffledDeck() {
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function buildOriginalDeck() {
  const deck = [];
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

function placeBet(evt) {
  const betAmount = parseInt(evt.target.dataset.amount);
  if (betAmount > balance) {
    messageEl.textContent = "Place Bet First!";
    return;
  }
  currentBet += betAmount;
  balance -= betAmount;
  updateBetDisplay(); 
  }

function startGame() {
  if (currentBet === 0) {
    messageEl.textContent = "Place your bets!";
    return;
  }
  shuffledDeck = getNewShuffledDeck();
  playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  dealerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  isPlayerTurn = true;
  renderHands();
  messageEl.textContent = "Your turn! Hit or Stand?";
}

function initGame() {
  
  shuffledDeck = getNewShuffledDeck();
  playerHand = [];
  dealerHand = [];
  currentBet = 0;
  balance = 5000;  
  isPlayerTurn = true;
  messageEl.textContent = "Please place a bet to start the game.";
  updateBetDisplay();
  renderInitialDeckBacks();
}

function renderInitialDeckBacks() {
  const initialCardCount = 2; 
  let cardsHtml = '';
  
  
  for (let i = 0; i < initialCardCount; i++) {
    cardsHtml += `<div class="card back"></div>`;
  }

 
  playerHandContainer.innerHTML = cardsHtml;
  dealerHandContainer.innerHTML = cardsHtml;
}

initGame();

function renderHands() {
  renderDeckInContainer(playerHand, playerHandContainer);
  renderDeckInContainer(dealerHand, dealerHandContainer, !isPlayerTurn);
}

function renderDeckInContainer(deck, container, hideFirstCard = false) {
  container.innerHTML = '';
  let cardsHtml = '';
  deck.forEach(function(card, idx) {
    if (hideFirstCard && idx === 0) {
      cardsHtml += `<div class="card back"></div>`;
    } else {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    }
  });
  container.innerHTML = cardsHtml;
}

  function updateBetDisplay() {
    balanceEl.textContent = balance;
    currentBetEl.textContent = currentBet;
}

function playerHit() {
  if (!isPlayerTurn) return;
  playerHand.push(shuffledDeck.pop());
  renderHands();
  if (getHandValue(playerHand) > 21) {
    endGame('Bust! Dealer wins.');
  }
}

function playerStand() {
  if (!isPlayerTurn) return;
  isPlayerTurn = false;
  messageEl.textContent = "Dealer's turn...";
  dealerTurn();
}

function dealerTurn() {
  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(shuffledDeck.pop());
    renderHands();
  }
  checkWinner();
}

function getHandValue(hand) {
  let value = 0;
  let aceCount = 0;
  hand.forEach(function(card) {
    value += card.value;
    if (card.value === 11) aceCount++;
  });
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

function checkWinner() {
  const playerValue = getHandValue(playerHand);
  const dealerValue = getHandValue(dealerHand);
  if (dealerValue > 21) {
    endGame('Dealer busts! You win!');
  } else if (playerValue > dealerValue) {
    endGame('You win!');
  } else if (playerValue < dealerValue) {
    endGame('Dealer wins.');
  } else {
    endGame("It's a tie!");
  }
}

function endGame(message) {
  messageEl.textContent = message;
  if (message.includes('You win')) {
    balance += currentBet * 2;
  } else if (message.includes("It's a tie")) {
    balance += currentBet;
  }
  if (balance === 0) {
    messageEl.textContent = "Ya Broke!";
  }
    currentBet = 0
    updateBetDisplay();
    isPlayerTurn = false;
}




    startGame();

