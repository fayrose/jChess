(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope, PieceSrv) {
    this.board = BoardSrv.getBoard();
    this.initializeBoard = BoardSrv.initializeBoard;
    this.startMove = startMove;
    this.getCoords = getCoords;
    this.moving = false;

    //Creates the initial board.
    this.initializeBoard();

    //Watches the board array for updates
    $scope.$watch("this.board", function() {
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
      var coordinates = this.getCoords(event.target.id);
      if (this.moving == false) {
        var possibilities = BoardSrv.getPossibilities(coordinates);
        displayPossibilities(possibilities, coordinates);
        this.moving = true;
      } else {
        this.moving = false;
        $(".possibility").removeClass("possibility");
        $(".selected").removeClass("selected");
      }

    }

  }
})();
