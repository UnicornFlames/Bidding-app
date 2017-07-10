angular.module('bidding', [ 
  'bidding.controllers',
  'ngRoute',
  'angular.filter'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	when("/settle", {templateUrl: "src/settle.html", controller: "biddingController"}). 
	otherwise({redirectTo: '/settle'});
}]);