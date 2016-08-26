(function() {
  angular
      .module("chessApp")
      .controller("GameCtrl", GameCtrl)

  function GameCtrl(BoardSrv, $scope, PieceSrv , ngDialog, $state) {
    var self = this;

    //Import functions from service
    self.board = BoardSrv.getBoard();
    self.removePiece = BoardSrv.removePiece;
    self.addPiece = BoardSrv.addPiece;
    self.saveGame = saveGame;
    self.loadGame = loadGame;
    self.getInstructions = getInstructions;
    self.initializeBoard = BoardSrv.initializeBoard;

    //Function bindings
    self.castle = castle;
    self.endGame = endGame;
    self.startMove = startMove;
    self.getCoords = getCoords;
    self.newGame = newGame;
    self.changePage = changePage;


    //Initialize variables
    self.moving = false;
    self.possibilities = [];
    self.round = BoardSrv.round;
    self.winner = "";

    //Configure Navigation drawer
    angular.element(document).ready(function () {
       $('.drawer').drawer();
    })
    $('.drawer').drawer({
      class: {
        nav: 'drawer-nav',
        toggle: 'drawer-toggle',
        overlay: 'drawer-overlay',
        open: 'drawer-open',
        close: 'drawer-close',
        dropdown: 'drawer-dropdown'
      },
      iscroll: {
        // Configuring the iScroll
        // https://github.com/cubiq/iscroll#configuring-the-iscroll
        mouseWheel: true,
        preventDefault: false
      },
      showOverlay: true
    });
    //Creates the initial board.
    self.initializeBoard();

    //Initializes pop-up on application start
    $scope.openStartPage = function() {
		ngDialog.open({template: '/site/partials/start.html',
		  scope: $scope,
      className: 'ngdialog-theme-default'
		})
	   };

    $scope.openStartPage();

    //Watches the board array for updates
    $scope.$watch("BoardSrv.board", function() {
      BoardSrv.displayBoard();
    })

    function changePage(amount) {
      if (self.instructionsPage + amount > 0 && self.instructionsPage + amount < 12) {
        self.instructionsPage += amount;
      }
    }

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

      @param possibilities: Array, all of the potential spaces a piece could moves
      @param coordinates: Array (length == 2), the coordinates of the piece selected to move
      */
      $("#brd"+coordinates[0]+"\\,"+coordinates[1]).addClass("selected");
      for (i in possibilities) {
        $("#brd"+possibilities[i][0]+"\\,"+possibilities[i][1]).addClass("possibility");

      }


    }

    function castle(coordinates, selected_coords) {
      /*
      Checks to see the direction of the castle, and moves the king and rook accordingly.

      @param coordinates: Array (length == 2), The location of the rook.
      @param selected_coords: Array (length == 2), The location of the king.
      */
      //Gets the rook's name
      var rook_name = self.board[coordinates[0]][coordinates[1]];
      //If castling to the left
      if (coordinates[1] == 0) {
        //Moves the pieces
        BoardSrv.movePiece(selected_coords, [selected_coords[0], selected_coords[1]-2]);
        BoardSrv.movePiece(coordinates, [coordinates[0], coordinates[1]+2]);
      }
      //If castling to the right
      else if (coordinates[1] == 7)
      {
        //Moves the pieces
        BoardSrv.movePiece(selected_coords, [selected_coords[0], selected_coords[1]+2]);
        BoardSrv.movePiece(coordinates, [coordinates[0], coordinates[1]-3]);
      }

      //Updates the board
      BoardSrv.displayBoard();
    }

    function clearBoard() {
      BoardSrv.board = [];
      for (var i=0; i < 8; i++) {
        BoardSrv.board.push(new Array(8));
      }
    }

    function newGame() {
      $('.drawer').drawer('close');
      $state.reload();
      clearBoard();
      BoardSrv.round =  {
        round_number: 1,
        current_player: "white"
      };
      BoardSrv.displayBoard();
      console.log(self.board)
    }

    function endGame(winner) {
      self.winner = winner;
      $scope.openEndPage = function() {
  		ngDialog.openConfirm({template: '/site/partials/endgame.html',
  		  scope: $scope,
        className: 'ngdialog-theme-default'
      }).then(
        function(response) {
          if (response == "Play Again") {
            $route.reload();
          }
        }
      )
  	  };
      $scope.openEndPage();
    }

    function saveGame() {
      BoardSrv.saveGame()
      $scope.gameSaved = function() {
      ngDialog.open({template: '/site/partials/saved.html',
        scope: $scope,
        className: 'ngdialog-theme-default'
      })
       };

      $scope.gameSaved();
    }

    function loadGame() {
      BoardSrv.loadGame()
      $scope.gameLoaded = function() {
      ngDialog.open({template: '/site/partials/loaded.html',
        scope: $scope,
        className: 'ngdialog-theme-default'
      })
       };

      $scope.gameLoaded();
    }

    function getInstructions() {
      self.instructionsPage = 1;
      $scope.howToPlay = function() {
      ngDialog.open({template: '/site/partials/instructions.html',
        scope: $scope,
        className: 'ngdialog-theme-default'
        })
       };
      $scope.howToPlay();
    }

    function startMove(event) {
      /*
      Allows the user to move a piece. Takes in a click event, and if the piece is not currently moving, initializes a move.
      If the player is currently moving and clicks on a potential spot, moves the previously selected piece to the clicked possibility.

      @param event: Click event.
      */

      //Gets coordinates of clicked square
      var coordinates = self.getCoords(event.target.id);

      //If not in the middle of a move, get the possible move of moving the piece at the clicked square.
      if (self.moving == false) {

        //If the player selects a piece of the current player's color
        if (BoardSrv.round.current_player === BoardSrv.board[coordinates[0]][coordinates[1]].substring(0,5)) {
          self.possibilities = BoardSrv.getPossibilities(coordinates);
          displayPossibilities(self.possibilities, coordinates);
          BoardSrv.possibilityInCheck(self.possibilities, coordinates);
          self.moving = true;
        }

      //If in the middle of a move, and one clicks on a possibility, move the piece to the new spot.
      } else {
        for (item in self.possibilities) {
          if (self.possibilities[item].toString() === coordinates.toString()) {

            //Gets the old piece's information
            var selected_coords = self.getCoords($(".selected").attr("id"));
            var piece_name = self.board[selected_coords[0]][selected_coords[1]];

            //If the colors of the old piece and the selected possibility are the same, castle.
            if (!BoardSrv.isEmpty(coordinates)) {

              if (self.board[selected_coords[0]][selected_coords[1]].substring(0,5) == self.board[coordinates[0]][coordinates[1]].substring(0,5)) {
                self.castle(coordinates, selected_coords);
              }
              else {
                //Moves the piece
                BoardSrv.movePiece(selected_coords, coordinates);
              }

            }

            else {
              //Moves the piece
              BoardSrv.movePiece(selected_coords, coordinates);
            }

            //Updates the current player and round number
            if (BoardSrv.round.current_player === "black") {
              BoardSrv.round.current_player = "white";
              BoardSrv.round.round_number += 1;
            } else {
              BoardSrv.round.current_player = "black";
            }
        }}
          //Exits the moving process
          $(".possibility").removeClass("possibility");
          $(".selected").removeClass("selected");
          self.moving = false;
          BoardSrv.inCheck();
          if (BoardSrv.inCheck()[0] || BoardSrv.inCheck()[1]) {
            if (BoardSrv.inCheckmate() != false) {
              self.endGame(BoardSrv.inCheckmate());
            }
          }
      }

    }

  }
})();
