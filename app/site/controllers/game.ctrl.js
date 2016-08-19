(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope, PieceSrv) {
    this.board = BoardSrv.getBoard();
    this.initializeBoard = BoardSrv.initializeBoard;

    this.initializeBoard();
    $scope.$watch("this.board", function() {
      BoardSrv.displayBoard();
    })


  }
})();
