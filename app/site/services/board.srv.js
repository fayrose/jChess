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
    self.within_bounds = function(possibility) {return possibility[0] >= 0 && possibility[0] < 8 && possibility[1] >= 0 && possibility[1] < 8};
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
    self.movePiece = movePiece;
    self.initializeBoard = initializeBoard;
    self.inInitialPosition = inInitialPosition;
    self.possibilityInCheck = possibilityInCheck;
    self.inCheck = inCheck;
    self.inCheckmate = inCheckmate;
    self.optionValid = optionValid;
    self.pawnValid = pawnValid;
    self.getPossibilities = getPossibilities;

    function isEmpty(coordinates) {
      /*
      Returns true if the space at the given coordinates is empty.

      @param coordinates: Array (length == 2), location of the piece to test
      @returns: Boolean, whether the space is empty.
      */
      if (coordinates[0] < 8 && coordinates[1] < 8 && coordinates[0] >= 0 && coordinates[1] >= 0) {
        return (self.board[coordinates[0]][coordinates[1]] == null || self.board[coordinates[0]][coordinates[1]] == undefined);
      }
      else {
        return 0
      }
    }

    function displayBoard() {
      /*
      Converts the self.board array to display the present board in the partial.

      @params: none.
      @returns: none.

      */

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

      addPiece([0, 0], "black-pawn") --> self.board[0][0] = "black-pawn"
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
      /*
      Removes a piece from the board

      @param location: Array (length == 2), coordinates of the piece to remove
      */

      self.board[location[0]][location[1]] = null;
    }

    function movePiece(old_location, new_location) {
      /*
      Moves a piece from one spot to another, and updates the location of the piece in self.current_locations.

      @param old_location: Array (length == 2), coordinates of the piece's initial location
      @param new_location: Array (length == 2), coordinates of the location the piece will be moved to
      */

      var piece = self.board[old_location[0]][old_location[1]];


      //Get the correct piece type
      for (var type in self.current_locations) {
        if (self.current_locations[type].name == piece) {
          //Find current location of said piece
          for (var location in self.current_locations[type].locations) {
            if (self.current_locations[type].locations[location].toString() == old_location.toString()) {

              //update location tracker
              self.current_locations[type].locations[location] = new_location;
            }
          }

        }
      }

      removePiece(old_location);
      addPiece(new_location, piece);
      displayBoard();
    }

    function takePiece(piece_location) {
      /*
      When a piece takes a piece from the opposite team by moving to the second piece's location,
      removes the taken piece from the list of current locations, as it no longer exists.

      @param piece_location: Array (length == 2), location of piece to remove
      */

      //Get the correct piece type
      var piece = self.board[piece_location[0]][piece_location[1]]

      //Iterate through the array to find the correct piece type.
      for (type in self.current_locations) {
        if (self.current_locations[type].name == piece) {

          //Find current location of said piece
          for (i = self.current_locations[type].locations.length; i >= 0; i--) {
            if (self.current_locations[type].locations[i].toString() == piece_location.toString()) {

              //Removes the location of the piece from the list of piece locations
              self.current_locations[type].locations.splice(i, 1);
            }
          }

        }
      }

    }

    function initializeBoard() {
      /*
      Creates the initial board by adding the pieces in the initial locations, as well as creating the location tracker.

      No params.
      */

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
      self.current_locations = JSON.parse(JSON.stringify(self.initial_locations));

      for (item in self.initial_locations) {
        self.addPieces(self.initial_locations[item]);
      }
    }

    function inInitialPosition(coordinates) {
      /*
      Returns true if the piece at the coordinates given is a piece in the same position as at the start of the game.

      @param coordinates: Array (length == 2), location of the piece to test
      */

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

    function possibilityInCheck(possibilities, selected_coords) {
      /*
      Displays whether a potential move would result in a piece being in check by adding
      a red overlay to the potential move that would do so.

      @param possibilities: Array, list of potential moves a piece could make.
      @param selected_coords: Array (length == 2), the piece that is currently being moved.
      */
      puts_black_in_check = [];
      puts_white_in_check = [];
      var hold_piece = false;

      for (var possibility in possibilities) {
        if (!self.isEmpty([possibilities[possibility], possibilities[possibility]])
            || self.board[possibilities[possibility][0]][possibilities[possibility][1]] !== undefined
        ) {
          var hold_piece = self.board[possibilities[possibility][0]][possibilities[possibility][1]];
        }
        //Move piece in each direction that it can.
        movePiece(selected_coords, possibilities[possibility]);

        var in_check = inCheck()
        //If either king is in check for the given position, put the appropriate class on it.
        if (in_check[0] || in_check[1]) {
          if (in_check[0]) {
            movePiece(possibilities[possibility], selected_coords);
            if (hold_piece) {
              self.board[possibilities[possibility][0]][possibilities[possibility][1]] = hold_piece;
            }
            $(".blackcheck").removeClass("blackcheck")
            $("#brd" + possibilities[possibility][0] + "\\," + possibilities[possibility][1]).addClass('blackcheck');
            puts_black_in_check.push(possibilities[possibility]);
            self.displayBoard()
          }
          else {
            movePiece(possibilities[possibility], selected_coords);
            if (hold_piece) {
              self.board[possibilities[possibility][0]][possibilities[possibility][1]] = hold_piece;
            }
            $(".blackcheck").removeClass("whitecheck")
            $("#brd" + possibilities[possibility][0] + "\\," + possibilities[possibility][1]).addClass('whitecheck');
            puts_white_in_check.push(possibilities[possibility]);
            self.displayBoard()
          }

        } else {
          movePiece(possibilities[possibility], selected_coords);
          if (hold_piece) {
            self.board[possibilities[possibility][0]][possibilities[possibility][1]] = hold_piece;
            self.displayBoard()
          }
        }

      }
      return [puts_black_in_check, puts_white_in_check];
    }

    function inCheck() {
      /*
      Tests to see if either of the kings are currently in check.

      @params: none.
      @returns: none.
      */

      var black_locations = [];
      var white_locations = [];
      var black_inCheck = false;
      var white_inCheck = false;

      //Get pieces' locations.
      for (var type in self.current_locations) {
        if (self.current_locations[type].name == "white-king") {
          var white_king_location = self.current_locations[type].locations[0]
        }
        else if (self.current_locations[type].name == "black-king") {
          var black_king_location = self.current_locations[type].locations[0]
        }
        else if (self.current_locations[type].name.substring(0,5) == "black") {
          for (location in self.current_locations[type].locations) {
            black_locations.push( self.current_locations[type].locations[location])
          }
        }
        else if (self.current_locations[type].name.substring(0,5) == "white") {
          for (location in self.current_locations[type].locations) {
            white_locations.push(self.current_locations[type].locations[location])
          }
        }
      }


      //Test the opposite player's pieces to see if the king is in any of their possibilities.
      for (var location in black_locations) {
        var possibilities = self.getPossibilities(black_locations[location]);
        for (var index in possibilities) {
          if (possibilities[index].toString() == white_king_location.toString()) {
            console.log('white king check')
            //Add check class to black_locations[location] and white_king_location
            $("#brd"+black_locations[location][0]+"\\,"+black_locations[location][1]).addClass("whitecheck");
            $("#brd"+white_king_location[0]+"\\,"+white_king_location[1]).addClass("whitecheck");
            white_inCheck = true;
          }
        }
      }
      for (var location in white_locations) {
        var possibilities = self.getPossibilities(white_locations[location]);
        for (var index in possibilities) {
          if (possibilities[index].toString() == black_king_location.toString()) {
            //Add check class to white_locations[location] and black_king_location
            $("#brd"+white_locations[location][0]+"\\,"+white_locations[location][1]).addClass("blackcheck");
            $("#brd"+black_king_location[0]+"\\,"+black_king_location[1]).addClass("blackcheck");
            black_inCheck = true;
          }
        }
      }

      //If the king not in check, remove the check class from them.
      if (!white_inCheck) {
        $(".whitecheck").removeClass("whitecheck");
      }
      if (!black_inCheck) {
        $(".blackcheck").removeClass("blackcheck");
      }

      return [black_inCheck, white_inCheck]
    }

    function inCheckmate() {
      /*
      Tests to see if the king is in checkmate by testing if both the location he is in
      as well as all locations he could move are in check.
      */
      for (var type in self.current_locations) {
        if (self.current_locations[type].name == "white-king") {
          var white_king_location = self.current_locations[type].locations[0]
        }
        else if (self.current_locations[type].name == "black-king") {
          var black_king_location = self.current_locations[type].locations[0]
        }
      }
      puts_white_in_check = possibilityInCheck(getPossibilities(white_king_location), white_king_location)[1];
      puts_black_in_check = possibilityInCheck(getPossibilities(black_king_location), black_king_location)[0];

      if (inCheck()[1] && getPossibilities(white_king_location) == puts_white_in_check && getPossibilities(white_king_location).length > 0) {
        return "white";
      } else if (inCheck()[0] && getPossibilities(black_king_location) == puts_black_in_check && getPossibilities(black_king_location).length > 0) {
        return "black";
      } else {
        return false;
      }
    }

    function optionValid(possibility, color) {
      /*
      Returns true if the possibility being tested is within the bounds of the board,
      as well as either being an empty space or a piece from the opposite player.

      @param possibility: Array (length == 2), the space a piece could potentially move
      @param color: String, the color of the current team
      */

      if (self.within_bounds(possibility)) {
        //Checks that either the space is unoccupied, or occupied by a member of the opposite team
        self.opposite_color = self.board[possibility[0]][possibility[1]] && self.board[possibility[0]][possibility[1]].substring(0,5) !== color;
        return (self.isEmpty(possibility) || self.opposite_color);
      } else {
        return false;
      }
    }

    function pawnValid(possibility, direction) {
      /*
      Allows the pawn to move Forward if the space in front of it is not empty,
      and allows the pawn to move diagonally if it could potentially take a piece.

      @param possibility: Array (length == 2), the space a piece could potentially move
      @direction: Array (length == 2), the direction that the possibility is in relation to the initial piece
      */

      //Allows pawn to move forward if the space ahead is not occupied
      if (direction == PieceSrv.FORWARD) {
        return self.isEmpty(possibility);

      //Allows pawn to move diagonally if the space it would like to move to has the opposite color
      } else if (direction == PieceSrv.FORWARD_LEFT || direction == PieceSrv.FORWARD_RIGHT) {
        return self.opposite_color;
      }
    }

    function getPossibilities(coordinates) {
      /*
      Returns the potential locations that a piece could move.

      @param coordinates: Array (length == 2), location of the piece to test
      @returns possibilities: Array, list of coordinates the piece could move
      */

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

        for (item in movement) {
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
                console.log(possibility);

                function checkIfOpponent(square, color) {
                  console.log(square, color);
                  if (typeof square !== 'string') return false;
                  return square.substring(0,5) !== color;
                }

                while (self.within_bounds(possibility) && (self.isEmpty(possibility))) {

                  if (self.optionValid(possibility, color)) {
                  //Adds passing possibilities to the array
                    possibilities.push(possibility);
                  }
                  var possibility = [operators[op](possibility[0], movement[item][0]), operators[op](possibility[1], movement[item][1])];
                }
                if (self.within_bounds(possibility)) {
                  if (checkIfOpponent(self.board[possibility[0]][possibility[1]], color)) {
                    if (self.optionValid(possibility, color)) {
                    //Adds passing possibilities to the array
                      possibilities.push(possibility);
                    }
                  }
                }
              }
            }
          }


        }
        //CASTLING
        //If the selected piece is a king in the initial position
        if (piece_name == "king" && self.inInitialPosition(coordinates)) {
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
