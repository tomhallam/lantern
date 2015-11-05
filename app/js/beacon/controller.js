(function(window, angular, undefined) {
  'use strict';

  angular.module('lantern.beacon', [])
    .controller('BeaconController', BeaconController)

  function BeaconController($scope, $state) {

      $scope.uuid = $state.params.uuid;
      $scope.major = Number($state.params.major);
      $scope.minor = Number($state.params.minor);

  }

}(window, window.angular))
