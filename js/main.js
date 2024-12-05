/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const MSG_LOOKUP = {
  null: 'Hit or Stand!',
  'PUSH': "It's a Push",
  'P': 'WINNER! WINNER!',
  'D': 'YOU LOSE',
  'PBJ': 'YOU GOT BLACKJACK!!! 😃',
  'DBJ': 'Dealer Has Blackjack 😔',
  'YB': 'Ya Broke!'
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
const handActiveControlsEl = document.getElementById('hand-active-controls');
const bettingControlsEl = document.getElementById('betting-controls');
const dealBtn = document.getElementById('deal-btn');
const dblBtn = document.getElementById('dbl-btn');
const dealerTotalEl = document.getElementById('dealer-total');
const playerTotalEl = document.getElementById('player-total');

/*----- event listeners -----*/
document.getElementById('hit-btn').addEventListener('click', playerHit);
document.getElementById('dbl-btn').addEventListener('click', doubleDown);
document.getElementById('stand-btn').addEventListener('click', playerStand);
document.getElementById('deal-btn').addEventListener('click', handleDeal);
document.querySelectorAll('.bet-btn').forEach(button => {
  button.addEventListener('click', placeBet);
});

/*----- functions -----*/
initGame();

function placeBet(evt) {
  const betAmount = parseInt(evt.target.dataset.amount);
  currentBet += betAmount; {
    balance -= betAmount;
    render();
  }
  checkBetAmnt();
}

function checkBetAmnt() {
  document.querySelectorAll('.bet-btn').forEach(button => {
    const betAmount = parseInt(button.dataset.amount);
    if (balance < betAmount) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  });
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
  renderControls();
  renderTotals();
  checkBetAmnt();
  checkEndGame();
}

function renderControls() {
  const handInPlay = handOutcome === null;
  dealBtn.style.display = !handInPlay && currentBet >= 10 ? 'initial' : 'none';
  dblBtn.disabled = playerHand.length > 2;
  bettingControlsEl.style.display = handInPlay ? 'none' : 'initial';
  handActiveControlsEl.style.display = handInPlay ? 'flex' : 'none';
}

function renderTotals() {
  playerTotalEl.textContent = getHandValue(playerHand)
  if (!handOutcome) {
    dealerTotalEl.textContent = getHandValue([dealerHand[0]]);
  } else {
    dealerTotalEl.textContent = getHandValue(dealerHand);
  }

}

function renderMessage() {
  if (handOutcome === undefined) {
    messageEl.textContent = "Place bet and click deal.";
  } else {
    messageEl.textContent = MSG_LOOKUP[handOutcome];
  }
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
      cardsHtml += `<div class="card ${card.face}"></div>`;
    } else if (isDealerHand && !handOutcome && idx === 1) {
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
  playerTotal = getHandValue(playerHand);
  if (playerTotal > 21) {
    checkWinner();
  } else {
    render();
  }
}

function doubleDown() {
  if (balance >= currentBet) {
    balance -= currentBet;
    currentBet *= 2;
    playerHand.push(shuffledDeck.pop());
    playerTotal = getHandValue(playerHand);
    if (playerTotal > 21) {
      checkWinner();
    } else {
      playerStand();

    }
  } else {
    handOutcome = 'YB';
  }
  render();
}

function playerStand() {
  dealerTurn();
}

function dealerTurn() {
  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(shuffledDeck.pop());
  }
  checkWinner();
}

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
  if (dealerValue === playerValue) {
    handOutcome = 'PUSH';
    balance += currentBet;
    currentBet = 0;
  } else if (dealerValue > 21) {
    handOutcome = 'P';
    balance += currentBet * 2;
    currentBet = 0;
  } else if (playerValue > 21 || playerValue < dealerValue) {
    handOutcome = 'D';
    currentBet = 0;
  } else {
    handOutcome = 'P';
    balance += currentBet * 2;
    currentBet = 0;
  }
  render();
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

function checkEndGame() {
  if (balance <= 0 && currentBet <= 0) {
    messageEl.textContent = "Ya Broke!";
    document.getElementById('deal-btn').disabled = true;
    document.querySelectorAll('.bet-btn').forEach(button => button.disabled = true);
    handActiveControlsEl.style.display = 'none';
    document.getElementById('restart-btn').style.display = 'block';
  }
}
initGame();