(function() {
  angular
    .module('chessApp')
    .service('BoardSrv', BoardSrv)

  function BoardSrv(PieceSrv) {
    self = this;

    //Creates the board
    self.board = [];
    for (var i=0; i < 8; i++) {
      self.board.push(new Array(8));
    }

    //Bind functions
    self.pieces = PieceSrv.pieces;
    self.getPiece = PieceSrv.getPiece;
    self.displayBoard = displayBoard;
    self.getBoard = getBoard;
    self.initializeBoard = initializeBoard;
    self.addPiece = addPiece;
    self.addPieces = addPieces;
    self.getPossibilities = getPossibilities;

    function displayBoard() {
      //For each row
      for (var i = 0; i < 8; i++) {
        //For each square
        for (var j = 0; j < 8; j++) {

          //If the space is not empty, get the color and piece, and display it in that position.
          if (self.board[i][j] !== undefined && self.board[i][j] !== null) {

            //Get piece from color and piece names
            var color = self.board[i][j].substring(0, 5);
            var piece_name = self.board[i][j].substring(6);
            var piece = PieceSrv.getPiece(piece_name);

            //Display either black or white image
            if (color == "black") {
              var image =  piece.blackImg;
            } else {
             var image = piece.whiteImg;
            }
            $("#brd"+i+"\\,"+j).html(image);
          }
        }
      }
    }

    function getBoard() {
      //Returns self.board
      return self.board;
    }

    function addPiece(location, name) {
      /*
      Add a singular piece to the board.

      @param location: Array with length of 2,
      @param name: String

      addPiece([0, 0], "black-pawn") --> board[0][0] = "black-pawn"
      */
      self.board[location[0]][location[1]] = name;
    }

    function addPieces(pieces) {
      /*
      Adds multiple pieces of the same type to the board.

      @param pieces: Object. Has attributes 'locations' (Array of arrays), and 'name' (String)
      */
      num_of_locations = pieces.locations;
      if (num_of_locations) {
        num_of_locations = pieces.locations.length;
      }
      for (var i=0; i<num_of_locations; i++) {
        self.addPiece(pieces.locations[i], pieces.name);
      }
    }

    function initializeBoard() {
      //Defines locations of initial pieces
      black_pawn = {locations: [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7]],
                    name: "black-pawn"};
      black_rook = {locations: [[0,0], [0,7]],
                    name: "black-rook"};
      black_knight = {locations: [[0,1], [0,6]],
                    name: "black-knight"};
      black_bishop = {locations: [[0,2], [0,5]],
                    name: "black-bishop"};
      black_queen = {locations: [[0,3]],
                    name: "black-queen"};
      black_king = {locations: [[0,4]],
                    name: 'black-king'};
      black_set = [black_pawn, black_rook, black_knight, black_bishop, black_queen, black_king];

      for (item in black_set) {
        self.addPieces(black_set[item]);
      }

      white_pawn = {locations: [[6,0], [6,1], [6,2], [6,3], [6,4], [6,5], [6,6], [6,7]],
                    name: "white-pawn"};
      white_rook = {locations: [[7,0], [7,7]],
                    name: "white-rook"};
      white_knight = {locations: [[7,1], [7,6]],
                    name: "white-knight"};
      white_bishop = {locations: [[7,2], [7,5]],
                    name: "white-bishop"};
      white_queen = {locations: [[7,3]],
                    name: "white-queen"};
      white_king = {locations: [[7,4]],
                    name: 'white-king'};
      white_set = [white_pawn, white_rook, white_knight, white_bishop, white_queen, white_king];

      for (item in white_set) {
        self.addPieces(white_set[item]);
      }
    }

    function getPossibilities(coordinates) {

      if (this.board[coordinates[0]][coordinates[1]] !== undefined && this.board[coordinates[0]][coordinates[1]] !== null) {
        //Get piece type and color
        var color = this.board[coordinates[0]][coordinates[1]].substring(0,5);
        var piece_name = this.board[coordinates[0]][coordinates[1]].substring(6);
        var piece_type = self.getPiece(piece_name);

        //Get piece movement
        var movement = piece_type.movement;
        var movement_type =  piece_type.movement_type;

        //Initialize possibilities array
        var possibilities = [];

        for (item in movement) {
          //Define potential movement, oriented by player color
          //Forward for white pieces is 'up', forward for black is 'down'
          if (color == "black") {
            var possibility = [coordinates[0] + movement[item][0], coordinates[1] + movement[item][1]];
          } else {
            var possibility =  [coordinates[0] - movement[item][0], coordinates[1] - movement[item][1]];
          }

          //Ensures that the possibility is within bounds
          var within_bounds = possibility[0] >= 0 && possibility[0] < 8 && possibility[1] >= 0 && possibility[1] < 8;
          if (within_bounds) {

          //Checks that either the space is unoccupied, or occupied by a member of the opposite team
          var not_occupied = self.board[possibility[0]][possibility[1]] == undefined || self.board[possibility[0]][possibility[1]] == null;
          var opposite_color = self.board[possibility[0]][possibility[1]] && self.board[possibility[0]][possibility[1]].substring(0,5) !== color;
          if (not_occupied || opposite_color) {

          //Adds passing possibilities to the array
          possibilities.push(possibility);
            }
          }
        }
        return possibilities;
    }
  }

}})();
