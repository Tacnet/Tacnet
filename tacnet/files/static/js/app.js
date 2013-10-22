'use strict';


// Declare app level module which depends on filters, and services
angular.module('tacApp', [
  'ngRoute',
  'tacApp.filters',
  'tacApp.services',
  'tacApp.directives',
  'tacApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/about', {templateUrl: 'partials/about.html'});
  $routeProvider.when('/contact', {templateUrl: 'partials/contact.html'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
