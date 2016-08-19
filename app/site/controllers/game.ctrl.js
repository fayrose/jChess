(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope, PieceSrv) {
    this.board = BoardSrv.getBoard();
    this.initializeBoard = BoardSrv.initializeBoard;
    this.startMove = startMove;
    this.getCoords = getCoords;

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

    function startMove(event) {
      var coordinates = this.getCoords(event.target.id);
      BoardSrv.startMove(coordinates);

    }

  }
})();
