(function(window, angular, undefined) {
  'use strict';

  angular.module('lantern.main', [])
    .controller('MainController', MainController)

  function MainController($scope, $state) {

    $scope.loadBeacon = loadBeacon;
    $scope.beaconTree = [];

    $scope.$on('frontend:beaconsUpdate', function(event, data) {
      $scope.$apply(function() {
          $scope.beaconTree = data;
          $scope.beaconGroups = Object.keys(data);
      })
    });

    function loadBeacon(beacon) {
      $scope.beaconInView = beacon.uuid + '.' + beacon.major + '.' + beacon.minor;
      return $state.go('app.main.beacon', {
        major: beacon.major,
        minor: beacon.minor,
        uuid: beacon.uuid
      }, {});
    }

  }

}(window, window.angular))
