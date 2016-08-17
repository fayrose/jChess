(function() {
  angular
    .module('chessApp')
    .service('BoardSrv', BoardSrv)

  function BoardSrv() {
    self = this;

    //Bind functions
    self.displayBoard = displayBoard;
    self.getBoard = getBoard;
    self.initializeBoard = initializeBoard;

    //Creates the board itself.
    self.board = [];
    for (i=0; i < 8; i++) {
      self.board.push(new Array(8));
    }

    self.initializeBoard();


    function displayBoard() {
      //For each row
      for (i=0; i < 8; i++) {
        //For each square
        for (j=0; j < 8; j++) {

          if (self.board[i][j] !== undefined) {
            $("#brd"+i+"\\,"+j).html("<a href='#' class='rook black'>&#9820;</a>");
          }
        }
      }
    }

    function getBoard() {
      return self.board;
    }

    function initializeBoard() {
      for (i=0; i<8; i++) {
        self.board[1][i] = "black-pawn"
      }
      for (i=0; i<8; i++) {
        self.board[6][i] = "white-pawn"
      }
    }

  }
})();
