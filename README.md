# Tic Tac Toe

A two player game that can be played by two players against each other on separate devices.

## Deployment URL

### URL of the Deployed version of this App

<https://zen-goldberg-b98cb8.netlify.app/>

## SETUP

**I recommend using the _deployed version of the app_ for testing the mobile version of this tic-tac-toe game. It seems like the onClick event for react app doesn't work well by connecting iphone to the local ip address running on macbook.**

You will have to go through the following steps in order to test this app on your local environment.

#### In your terminal, run the following commands

##### 1. Run `yarn` in your terminal.

If you don't have yarn, install it from [here](https://classic.yarnpkg.com/en/docs/install/#mac-stable))

##### 2. Comment out the following line in MainPage.jsx

`client.current = new WebSocket('wss://tic-tac-toe-app-2.herokuapp.com/');`

and put the following line back
`// client.current = new WebSocket('ws://localhost:8000')`

##### 3. Run `yarn run-all` in your terminal

##### 4. Runs the app in the development mode.<br />

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Instruction for Testing the App

### (I) Create and Join Game

With **Device A / Tab A on browser**, access to the deployed url above or to [http://localhost:3000](http://localhost:3000).

Press the Create Game button to create game. The button will re-render to become Join Game button. Click it again to navigate to the game page.

With **Device B / Tab B on browser**, access to the same url. You should see Join Game button instead of Create Game button, since the game is already created by another player. Click the button to join game.

### (II) Play Game

With two players in the game, you can start your match.
Click on the symbol you want to use in order to start your game. If the symbol is already selected by your opponent, you shouldn't be able to select them.

Once the symbols are selected by both sides, the game begins.

At the end of each match, you should be able to see the result above the game board. The message should be the following three patterns:

#### You are the winner :) Reset to Try Again

#### You lost :( Try Again By Pressing Reset Button

#### Draw! Try Again By Pressing Reset Button

### (III) Another Match

Whenever you want to go for another round, you can always press the reset button. It should refresh the game board. Both sides needs to press the reset button before starting the next game.

### (IV) Leave Room

If you are satisfied with the game, you can always leave the room by pressing the **EXIT** button on the top-left hand side.
