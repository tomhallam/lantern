(function(window, angular, undefined) {
  'use strict';

  angular.module('lantern.main', [])
    .controller('MainController', MainController)

  function MainController($scope) {

    console.log('TEST');

    $scope.beaconTree = [];
    $scope.$on('frontend:beaconsUpdate', function(event, data) {
      $scope.$apply(function() {
          $scope.beaconTree = data;
      })
    });

  }

}(window, window.angular))
