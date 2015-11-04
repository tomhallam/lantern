(function(window, angular, undefined) {
  'use strict';

  angular.module('lantern.main', [])
    .controller('MainController', MainController)

  function MainController($scope) {

    console.log('TEST');

    $scope.beacons = [];
    $scope.$on('frontend:beaconsUpdate', function(event, data) {
      $scope.$apply(function() {
          console.log(data.length);
          $scope.beacons = data;
      })
    });

  }

}(window, window.angular))
