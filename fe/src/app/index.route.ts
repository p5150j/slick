var mainTemplate = require('./main/main.html');
var loginTemplate = require('./login/login.html');
var chatTemplate = require('./chat/chat.html');

/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: mainTemplate, //'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('auth', {
      url: '/login',
      templateUrl: loginTemplate,
      controller: 'LoginController',
      controllerAs: 'vm'
    })

    .state('chat', {
      url: '/chat',
      templateUrl: chatTemplate,
      controller: 'ChatController',
      controllerAs: 'vm'
    })
  ;

  $urlRouterProvider.otherwise('/login');
}
