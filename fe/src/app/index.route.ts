/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })

    .state('chat', {
      url: '/chat',
      templateUrl: 'app/chat/chat.html',
      controller: 'ChatController',
      controllerAs: 'vm'
    })

  ;

  $urlRouterProvider.otherwise('/');
}
