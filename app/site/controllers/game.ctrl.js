(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope) {
    this.board = BoardSrv.getBoard();

    $scope.$watch('this.board', function() {
      BoardSrv.displayBoard();
    })
  }
})();
