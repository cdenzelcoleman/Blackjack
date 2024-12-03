/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const MSG_LOOKUP = {
  null: 'Good Luck!',
  'T': "It's a Push",
  'P': 'Player Wins!',
  'D': 'Dealer Wins',
  'PBJ': 'Player Has Blackjack 😃',
  'DBJ': 'Dealer Has Blackjack 😔',
};

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();

/*----- app's state (variables) -----*/
let shuffledDeck;
let playerHand;
let dealerHand;
let balance;
let currentBet;
let handOutcome;
let playerTotal;
let dealerTotal;

/*----- cached element references -----*/
const dealerHandContainer = document.getElementById('dealer-hand');
const playerHandContainer = document.getElementById('player-hand');
const messageEl = document.getElementById('message');
const balanceEl = document.getElementById('balance');
const currentBetEl = document.getElementById('current-bet');

/*----- event listeners -----*/
document.getElementById('hit-btn').addEventListener('click', playerHit);
document.getElementById('stand-btn').addEventListener('click', playerStand);
document.getElementById('deal-btn').addEventListener('click', handleDeal);
document.querySelectorAll('.bet-btn').forEach(button => {
  button.addEventListener('click', placeBet);
});

/*----- functions -----*/
initGame();



function placeBet(evt) {
  const betAmount = parseInt(evt.target.dataset.amount);
  currentBet += betAmount;
  balance -= betAmount;
  render();
}

function handleDeal() {
  handOutcome = null;
  shuffledDeck = getNewShuffledDeck();
  playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  dealerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  playerTotal = getHandValue(playerHand);
  dealerTotal = getHandValue(dealerHand);
  if (playerTotal === 21 && dealerTotal === 21) {
    handOutcome = 'PUSH';
  } else if (playerTotal === 21) {
    handOutcome = 'PBJ';
    balance += currentBet * 1.5 + currentBet;
    currentBet = 0;
  } else if (dealerTotal === 21) {
    handOutcome = 'DBJ';
    currentBet = 0;
  }
  render();
}

function initGame() {

  shuffledDeck = getNewShuffledDeck();
  playerHand = [];
  dealerHand = [];
  currentBet = 0;
  balance = 5000;
  render();
}

function render() {
  renderHands();
  renderBetDisplay();
  renderMessage();
}

function renderMessage() {
  messageEl.textContent = "Your turn! Hit or Stand?";
 //messageEl.textContent = "Please place a bet to start the game."; 
}

function renderHands() {
  renderHand(playerHand, playerHandContainer);
  renderHand(dealerHand, dealerHandContainer, true);
}

function renderHand(hand, container, isDealerHand) {
  container.innerHTML = '';
  let cardsHtml = '';
  hand.forEach(function (card, idx) {
    if (isDealerHand && !handOutcome && idx === 0) {
      cardsHtml += `<div class="card back"></div>`;
    } else {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    }
  });
  container.innerHTML = cardsHtml;
}

function renderBetDisplay() {
  balanceEl.textContent = balance;
  currentBetEl.textContent = currentBet;
}

function playerHit() {
 
  playerHand.push(shuffledDeck.pop());
  renderHands();
  if (getHandValue(playerHand) > 21) {
    endGame('Bust! Dealer wins.');
  }
}

//hidden card feature not working

function playerStand() {
  messageEl.textContent = "Dealer's turn...";
  dealerTurn();
}

function dealerTurn() {
  dealerHand.forEach(card => card.isFaceDown = false);
  renderHands();

  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(shuffledDeck.pop());
    renderHands();
  }
  checkWinner();
}
//hidden card feature not working.


function getHandValue(hand) {
  let value = 0;
  let aceCount = 0;
  hand.forEach(function (card) {
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

}



function buildOriginalDeck() {
  const deck = [];
  suits.forEach(function (suit) {
  ranks.forEach(function (rank) {
  deck.push({
  face: `${suit}${rank}`,
  value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

function getNewShuffledDeck() {
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}