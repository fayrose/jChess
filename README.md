# jChess
An example of Chess made in Javascript, jQuery and Angular. 


##Installation
Run `npm install` in terminal in order to install dependencies.

##Running
In order to run, navigate to the project folder and enter `node api/server.js` in terminal. This will start the server at `http://localhost:8080`. By navigating to this page in your web browser, you will be able to view the project directly. 

##How to play
While the game of Chess itself is explained in the "How to Play" guide in the navigation drawer, the mechanics of the site are as follows: 

* The current player can be determined by the color of the square in the bottom-left corner (black for the black team, white for the white team). 

* The current player can move a piece by clicking on the piece that he or she would like to move. This will display the possible moves available for that piece to move. One can either click on one of these places to move there, or click outside these places to cancel this piece's movement. In terms of castling, one can achieve this by clicking on the king when the conditions necessary for castling are met, in which case the rook will appear as a viable option. Clicking on the rook will allow one to castle their king.

* In order to save, load, or begin a new game, click on the options in the navigation drawer, which can be accessed through a button in the top-left.

