(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope, PieceSrv) {
    var self = this;

    //Function bindings
    self.board = BoardSrv.getBoard();
    self.removePiece = BoardSrv.removePiece;
    self.addPiece = BoardSrv.addPiece;
    self.castle = castle;
    self.initializeBoard = BoardSrv.initializeBoard;
    self.startMove = startMove;
    self.getCoords = getCoords;

    //Initialize variables
    self.moving = false;
    self.possibilities = [];
    self.round = BoardSrv.round;

    //Creates the initial board.
    self.initializeBoard();

    //Watches the board array for updates
    $scope.$watch("BoardSrv.board", function() {
      BoardSrv.displayBoard();
    })

    function getCoords(id) {
      /*
      Takes in the ID and returns the coordinates of the square on the board.
      @param id: String
      returns Array

      >> getCoords('brd0,0') -- > [0, 0]
      */
      var coord1 = parseInt(id.substring(3,4), 10);
      var coord2 = parseInt(id.substring(5), 10);
      return [coord1, coord2];

    }

    function displayPossibilities(possibilities, coordinates) {
      /*
      Adds the 'possibility' class to the possible moves of a selected piece, as well
      as the 'selected' class to the selected piece itself. The possibility class gives a
      red overlay to a square, and the selected, a gray overlay.

      @param possibilities: Array, all of the potential spaces a piece could moves
      @param coordinates: Array (length == 2), the coordinates of the piece selected to move
      */
      $("#brd"+coordinates[0]+"\\,"+coordinates[1]).addClass("selected");
      for (i in possibilities) {
        $("#brd"+possibilities[i][0]+"\\,"+possibilities[i][1]).addClass("possibility");

      }


    }

    function castle(coordinates, selected_coords) {
      /*
      Checks to see the direction of the castle, and moves the king and rook accordingly.

      @param coordinates: Array (length == 2), The location of the rook.
      @param selected_coords: Array (length == 2), The location of the king.
      */
      //Gets the rook's name
      var rook_name = self.board[coordinates[0]][coordinates[1]];
      //If castling to the left
      if (coordinates[1] == 0) {
        //Moves the pieces
        BoardSrv.movePiece(selected_coords, [selected_coords[0], selected_coords[1]-2]);
        BoardSrv.movePiece(coordinates, [coordinates[0], coordinates[1]+2]);
      }
      //If castling to the right
      else if (coordinates[1] == 7)
      {
        //Moves the pieces
        BoardSrv.movePiece(selected_coords, [selected_coords[0], selected_coords[1]+2]);
        BoardSrv.movePiece(coordinates, [coordinates[0], coordinates[1]-3]);
      }

      //Updates the board
      BoardSrv.displayBoard();
    }

    function startMove(event) {
      /*
      Allows the user to move a piece. Takes in a click event, and if the piece is not currently moving, initializes a move.
      If the player is currently moving and clicks on a potential spot, moves the previously selected piece to the clicked possibility.

      @param event: Click event.
      */

      //Gets coordinates of clicked square
      var coordinates = self.getCoords(event.target.id);

      //If not in the middle of a move, get the possible move of moving the piece at the clicked square.
      if (self.moving == false) {

        //If the player selects a piece of the current player's color
        if (BoardSrv.round.current_player === BoardSrv.board[coordinates[0]][coordinates[1]].substring(0,5)) {
          self.possibilities = BoardSrv.getPossibilities(coordinates);
          displayPossibilities(self.possibilities, coordinates);
          BoardSrv.possibilityInCheck(self.possibilities, coordinates);
          self.moving = true;
        }

      //If in the middle of a move, and one clicks on a possibility, move the piece to the new spot.
      } else {
        for (item in self.possibilities) {
          if (self.possibilities[item].toString() === coordinates.toString()) {

            //Gets the old piece's information
            var selected_coords = self.getCoords($(".selected").attr("id"));
            var piece_name = self.board[selected_coords[0]][selected_coords[1]];

            //If the colors of the old piece and the selected possibility are the same, castle.
            if (!BoardSrv.isEmpty(coordinates)) {

              if (self.board[selected_coords[0]][selected_coords[1]].substring(0,5) == self.board[coordinates[0]][coordinates[1]].substring(0,5)) {
                self.castle(coordinates, selected_coords);
              }
              else {
                //Moves the piece
                BoardSrv.movePiece(selected_coords, coordinates);
              }

            }

            else {
              //Moves the piece
              BoardSrv.movePiece(selected_coords, coordinates);
            }

            //Updates the current player and round number
            if (BoardSrv.round.current_player === "black") {
              BoardSrv.round.current_player = "white";
              BoardSrv.round.round_number += 1;
            } else {
              BoardSrv.round.current_player = "black";
            }
        }}
          //Exits the moving process
          $(".possibility").removeClass("possibility");
          $(".selected").removeClass("selected");
          self.moving = false;
          BoardSrv.inCheck();
      }

    }

  }
})();
