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

    //Create variables
    self.pieces = PieceSrv.pieces;
    self.getPiece = PieceSrv.getPiece;
    self.round =  {
      round_number: 1,
      current_player: "white"
    };

    //Bind functions
    self.isEmpty = isEmpty;
    self.displayBoard = displayBoard;
    self.getBoard = getBoard;
    self.addPiece = addPiece;
    self.addPieces = addPieces;
    self.removePiece = removePiece;
    self.initializeBoard = initializeBoard;
    self.inInitialPosition = inInitialPosition;
    self.optionValid = optionValid;
    self.pawnValid = pawnValid;
    self.getPossibilities = getPossibilities;

    function isEmpty(coordinates) {
      return (self.board[coordinates[0]][coordinates[1]] == null || self.board[coordinates[0]][coordinates[1]] == undefined);
    }

    function displayBoard() {
      //For each row
      for (var i = 0; i < 8; i++) {
        //For each square
        for (var j = 0; j < 8; j++) {

          //If the space is not empty, get the color and piece, and display it in that position.
          if (!self.isEmpty([i, j])) {

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
          } else {
            $("#brd"+i+"\\,"+j).html("");
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

    function removePiece(location) {
      self.board[location[0]][location[1]] = null;
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
      black_queen = {locations: [[0,4]],
                    name: "black-queen"};
      black_king = {locations: [[0,3]],
                    name: 'black-king'};

      white_pawn = {locations: [[6,0], [6,1], [6,2], [6,3], [6,4], [6,5], [6,6], [6,7]],
                    name: "white-pawn"};
      white_rook = {locations: [[7,0], [7,7]],
                    name: "white-rook"};
      white_knight = {locations: [[7,1], [7,6]],
                    name: "white-knight"};
      white_bishop = {locations: [[7,2], [7,5]],
                    name: "white-bishop"};
      white_queen = {locations: [[7,4]],
                    name: "white-queen"};
      white_king = {locations: [[7,3]],
                    name: 'white-king'};
      self.initial_locations = [black_pawn, black_rook, black_knight, black_bishop, black_queen, black_king, white_pawn, white_rook, white_knight, white_bishop, white_queen, white_king];

      for (item in self.initial_locations) {
        self.addPieces(self.initial_locations[item]);
      }
    }

    function inInitialPosition(coordinates) {
      //Get the piece name
      var piece_name = self.board[coordinates[0]][coordinates[1]];
      //For each type of piece
      for (piece in self.initial_locations) {
        if (piece_name === self.initial_locations[piece].name) {

          //If the location matches
          for (i in self.initial_locations[piece].locations) {

            if (self.initial_locations[piece].locations[i].toString() == coordinates.toString()) {
              return true;
            }
          }
        }
      }
      return false;
    }

    function optionValid(possibility, color) {
      self.within_bounds = possibility[0] >= 0 && possibility[0] < 8 && possibility[1] >= 0 && possibility[1] < 8;
      if (self.within_bounds) {
        //Checks that either the space is unoccupied, or occupied by a member of the opposite team
        self.opposite_color = self.board[possibility[0]][possibility[1]] && self.board[possibility[0]][possibility[1]].substring(0,5) !== color;
        return (self.isEmpty(possibility) || self.opposite_color);
      } else {
        return false;
      }
    }

    function pawnValid(possibility, direction) {
      //Allows pawn to move forward if the space ahead is not occupied
      if (direction == PieceSrv.FORWARD) {
        return self.isEmpty(possibility);

      //Allows pawn to move diagonally if the space it would like to move to has the opposite color
      } else if (direction == PieceSrv.FORWARD_LEFT || direction == PieceSrv.FORWARD_RIGHT) {
        return self.opposite_color;
      }
    }

    function getPossibilities(coordinates) {
      //If the space selected is not empty
      if (!this.isEmpty([coordinates[0], [coordinates[1]]])) {

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
          var operators = {
            "+": function(a, b) {return a + b},
            "-": function(a, b) {return a - b}
          }
          if (color == "black") {
            var op = "+"
          } else {
            var op = "-"
          }

          var possibility = [operators[op](coordinates[0], movement[item][0]), operators[op](coordinates[1], movement[item][1])];

          if (self.optionValid(possibility, color)) {
            //Adds passing possibilities to the array
            if (piece_name != "pawn" || (piece_name == "pawn" && self.pawnValid(possibility, movement[item]))) {
              possibilities.push(possibility);

              //Allows pawns to move forward two spaces in the first round.
              if (piece_name == "pawn" && self.round.round_number == 1) {
                var possibility = [operators[op](coordinates[0], 2), operators[op](coordinates[1], 0)];
                possibilities.push(possibility);
              }

              //PIECES THAT CAN MOVE MORE THAN ONE SPOT AT A TIME
              if (movement_type == "infinite") {
                var possibility = [operators[op](possibility[0], movement[item][0]), operators[op](possibility[1], movement[item][1])];
                while (self.within_bounds && self.isEmpty(possibility)) {
                  if (self.optionValid(possibility, color)) {
                  //Adds passing possibilities to the array
                    possibilities.push(possibility);
                  }
                  var possibility = [operators[op](possibility[0], movement[item][0]), operators[op](possibility[1], movement[item][1])];
                }
              }
            }
          }


        }
        //CASTLING
        //If the selected piece is a king in the initial position
        if (piece_name == "king" && self.inInitialPosition(coordinates)) {
          console.log(self.board)
          //If the left rook is in still in the initial position and the in between spots are empty, add the rook to the possibilities
          if ((self.inInitialPosition([coordinates[0], 0])) && (self.isEmpty([coordinates[0], 1])) && (self.isEmpty([coordinates[0], 2]))) {
            console.log("left side empty")
            var possibility = [coordinates[0], coordinates[1]-3];
            possibilities.push(possibility);
          }
          //If the right rook is still in the initial position and the in between spots are empty, add the rook to the possibilities
          else if (self.inInitialPosition([coordinates[0], coordinates[1]+4]) && (self.isEmpty([coordinates[0], 4])) && (self.isEmpty([coordinates[0], 5])) && (self.isEmpty([coordinates[0], 6]))) {
            console.log("right side empty")
            var possibility = [coordinates[0], coordinates[1]+4];
            possibilities.push(possibility);
          }
        }

        //RETURNS ALL POSSIBLE MOVES
        return possibilities;
    }
  }
}})();
