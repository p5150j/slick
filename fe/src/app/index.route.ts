/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('auth', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })

    .state('chat', {
      url: '/chat',
      templateUrl: 'app/chat/chat.html',
      controller: 'ChatController',
      controllerAs: 'vm'
    })
  ;

  $urlRouterProvider.otherwise('/login');
}
