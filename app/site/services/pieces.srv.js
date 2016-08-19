(function() {
  angular
      .module('chessApp')
      .service("PieceSrv", PieceSrv)

  function PieceSrv() {
    this.getPiece = getPiece

    this.king = {
      blackImg: "&#9819;",
      whiteImg: '&#9813;',
      pieceName: "king"
    };
    this.queen = {
      blackImg: "&#9818;",
      whiteImg: '&#9812;',
      pieceName: "queen"
    };
    this.rook = {
      blackImg: "&#9820;",
      whiteImg: '&#9814;',
      pieceName: "rook"
    };
    this.bishop = {
      blackImg: "&#9821;",
      whiteImg: '&#9815;',
      pieceName: "bishop"
    };
    this.knight = {
      blackImg: "&#9822;",
      whiteImg: '&#9816;',
      pieceName: "knight"
    };
    this.pawn = {
      blackImg: "&#9823;",
      whiteImg: '&#9817;',
      pieceName: "pawn"
    };

    this.pieces = [this.king, this.queen, this.knight, this.bishop, this.pawn, this.rook]
    function getPiece(piece_name) {
      for (var i=0; i < 6; i++) {
        if (piece_name === this.pieces[i].pieceName) {

          return this.pieces[i];
        }
      }
    }


  }
})();
