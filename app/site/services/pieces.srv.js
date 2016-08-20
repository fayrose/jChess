(function() {
  angular
      .module('chessApp')
      .service("PieceSrv", PieceSrv)

  function PieceSrv() {
    self = this;

    //Define movement types
    self.FORWARD = [1, 0];
    self.BACKWARD = [-1, 0];
    self.LEFT = [0, -1];
    self.RIGHT = [0, 1];
    self.FORWARD_RIGHT = [1, 1];
    self.FORWARD_LEFT = [1, -1];
    self.BACK_RIGHT = [-1, 1];
    self.BACK_LEFT = [-1, -1];

    //Movement types for the knight
    self.LTALL_RIGHT = [2, 1];
    self.LTALL_LEFT = [2, -1];
    self.LTALL_BACK_LEFT = [-2, -1];
    self.LTALL_BACK_RIGHT = [-2, 1];
    self.LSHORT_FORWARD_RIGHT = [1, 2];
    self.LSHORT_BACK_RIGHT = [-1, 2];
    self.LSHORT_BACK_LEFT = [-1, -2];
    self.LSHORT_FORWARD_LEFT = [1, -2];

    self.king = {
      blackImg: "&#9818;",
      whiteImg: '&#9812;',
      movement: [self.FORWARD, self.BACKWARD, self.LEFT, self.RIGHT, self.FORWARD_LEFT, self.FORWARD_RIGHT, self.BACK_LEFT, self.BACK_RIGHT],
      movement_type: "finite",
      pieceName: "king"
    };
    self.queen = {
      blackImg: "&#9819;",
      whiteImg: '&#9813;',
      movement: [self.FORWARD, self.BACKWARD, self.LEFT, self.RIGHT, self.FORWARD_LEFT, self.FORWARD_RIGHT, self.BACK_LEFT, self.BACK_RIGHT],
      movement_type: "infinite",
      pieceName: "queen"
    };
    self.rook = {
      blackImg: "&#9820;",
      whiteImg: '&#9814;',
      movement: [self.FORWARD, self.BACKWARD, self.LEFT, self.RIGHT],
      movement_type: "infinite",
      pieceName: "rook"
    };
    self.bishop = {
      blackImg: "&#9821;",
      whiteImg: '&#9815;',
      movement: [self.FORWARD_LEFT, self.FORWARD_RIGHT, self.BACK_LEFT, self.BACK_RIGHT],
      movement_type: "infinite",
      pieceName: "bishop"
    };
    self.knight = {
      blackImg: "&#9822;",
      whiteImg: '&#9816;',
      movement: [self.LTALL_LEFT, self.LTALL_RIGHT, self.LTALL_BACK_LEFT, self.LTALL_BACK_RIGHT, self.LSHORT_BACK_LEFT, self.LSHORT_BACK_RIGHT, self.LSHORT_FORWARD_LEFT, self.LSHORT_FORWARD_RIGHT],
      movement_type: "finite",
      pieceName: "knight"
    };
    self.pawn = {
      blackImg: "&#9823;",
      whiteImg: '&#9817;',
      movement: [self.FORWARD, self.FORWARD_LEFT, self.FORWARD_RIGHT],
      movement_type: 'finite',
      pieceName: "pawn"

    };

    self.pieces = [self.king, self.queen, self.knight, self.bishop, self.pawn, self.rook];
    self.getPiece = getPiece;


    function getPiece(piece_name) {
      //For each type of piece, if the piece_name string matches the type's name attribute, return the piece type.
      for (var i=0; i < 6; i++) {
        if (piece_name === self.pieces[i].pieceName) {
          return self.pieces[i];
        }
      }
    }



}})();
