(function(window, angular, undefined) {
  'use strict';

  angular.module('lantern', [
    'ui.router',
    'lantern.main'
  ])
    .config(LanternConfig)
    .controller('LanternController', LanternController)

  /**

  */
  function LanternConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/main');
    $stateProvider
      .state('app', {
        abstract: 'true',
        templateUrl: 'views/layout.html',
        controller: 'LanternController as vm'
      })
      .state('app.main', {
        url: '/main',
        controller: 'MainController as vm',
        templateUrl: 'views/main.html'
      })

  }

  function LanternController() {

  }

}(window, window.angular))
