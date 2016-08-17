(function() {
  'use strict';
  
  angular
		.module('chessApp', ['ui.router']);

	angular
		.module('chessApp')
  	.config(function($stateProvider, $httpProvider,$urlRouterProvider){

        $urlRouterProvider.otherwise('/play');

        $stateProvider
    			.state('game',{
    				url:'/play',
    				templateUrl:'site/partials/game.html',
    				controller:'GameCtrl as ctrl'
    			})

      });

})();
