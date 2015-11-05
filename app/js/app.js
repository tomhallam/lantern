(function(window, angular, undefined) {
  'use strict';

  var ipc = require('ipc');

  angular.module('lantern', ['ui.router','lantern.main', 'lantern.beacon'])
    .config(LanternConfig)
    .controller('LanternController', LanternController)
    .filter('guid', function() {
      return function(input) {
        var guidGroups = /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/;
        return input.replace(guidGroups, '$1-$2-$3-$4-$5');
      };
    });


  function LanternConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/main');
    $stateProvider
      .state('app', {
        abstract: 'true',
        templateUrl: 'views/layout.html',
        controller: 'LanternController'
      })
      .state('app.main', {
        url: '/main',
        controller: 'MainController as vm',
        templateUrl: 'views/main.html'
      })
      .state('app.main.beacon', {
        url: '/beacon/:uuid/:major/:minor',
        controller: 'BeaconController as vm',
        templateUrl: 'views/beacon.html'
      })

  }

  function LanternController($state, $rootScope, $scope) {

    $scope.page = $state.current.name.replace('.', '-');

    $scope.$on('$viewContentLoaded', function() {
      ipc.send('frontend-ready');
    });

    ipc.on('main:beaconUpdate', function(beacons) {
      $rootScope.$broadcast('frontend:beaconsUpdate', beacons);
    });

  }


}(window, window.angular));
