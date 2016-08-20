(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope, PieceSrv) {
    var self = this;

    //Function bindings
    self.board = BoardSrv.getBoard();
    self.removePiece = BoardSrv.removePiece;
    console.log(typeof self.removePiece)
    self.addPiece = BoardSrv.addPiece;
    self.initializeBoard = BoardSrv.initializeBoard;
    self.startMove = startMove;
    self.getCoords = getCoords;
    self.moving = false;
    self.possibilities = []

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
      */
      $("#brd"+coordinates[0]+"\\,"+coordinates[1]).addClass("selected");
      for (i in possibilities) {
        $("#brd"+possibilities[i][0]+"\\,"+possibilities[i][1]).addClass("possibility");
      }
    }

    function startMove(event) {
      //Gets coordinates of clicked square
      var coordinates = self.getCoords(event.target.id);
      console.log(coordinates);
      console.log(self.possibilities)

      //If not in the middle of a move, get the possible move of moving the piece at the clicked square.
      if (self.moving == false) {
        self.possibilities = BoardSrv.getPossibilities(coordinates);
        displayPossibilities(self.possibilities, coordinates);
        self.moving = true;

      //If in the middle of a move, and one clicks on a possibility, move the piece to the new spot.
      } else {
        for (item in self.possibilities) {
          if (self.possibilities[item].toString() === coordinates.toString()) {
            //Gets the selected piece's information
            selected_coords = self.getCoords($(".selected").attr("id"));
            var piece_name = self.board[selected_coords[0]][selected_coords[1]];
            console.log("Selected Coords: " + selected_coords + "\nPiece name: " + piece_name + "\nCoordinates: " + coordinates)

            //Removes the old piece
            BoardSrv.removePiece(selected_coords);

            //Adds the new piece
            BoardSrv.addPiece(coordinates, piece_name);

            //Updates the board
            BoardSrv.displayBoard();
        }}
          //Exits the moving process
          $(".possibility").removeClass("possibility");
          $(".selected").removeClass("selected");
          self.moving = false;
      }

    }

  }
})();
