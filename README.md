## Initialization
Initialize Variables: Set up player balance, shuffled deck, dealer hand, player hand, etc.

Render Initial Card Backs: Display two face-down cards each for dealer and player.

Display Message: Prompt player to place a bet.

## Place Bet
Check Balance: Ensure player has enough balance for the bet amount.

Update Balance and Current Bet: Deduct bet from balance and update current bet amount.

Start Game: If a bet is placed successfully, call startGame().

## Start Game 
Check Bet: Verify a bet has been placed before starting.

Deal Cards: Deal two cards each to player and dealer.

Display Cards: Render player cards and display dealer's face-down card.

Player Action: Show "Hit" or "Stand" buttons.

## Player Hit
Deal a Card to Player: Add one card to player's hand.

Check for Bust: If player's hand value exceeds 21, end game with a message that dealer wins.

Player Stand
Switch Turn to Dealer: Update turn to dealer.

## Dealer's Play
Draw Cards: Dealer continues drawing until hand value reaches at least 17.

Render Cards: Display dealer's cards after each draw.

Check Winner: Determine the winner based on player and dealer hand values.

## End Game
Display Outcome Message: Announce whether player wins, loses, or ties.

Update Balance: Add winnings if player wins, or deduct the bet if player loses.

Reset Current Bet: Set the current bet to zero.

Prompt Restart: Show restart button to begin new round.