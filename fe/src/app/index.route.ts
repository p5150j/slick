import {ChatService} from "./chat/chat.service";

var loginTemplate = require('./login/login.html');
var chatTemplate = require('./chat/chat.html');
var roomTemplate = require('./chat/room/room.html');

/* @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

  $stateProvider

    .state('auth', {
      url: '/login',
      templateUrl: loginTemplate,
      controller: 'LoginController',
      controllerAs: 'vm'
    })

    .state('chat', {
      url: '/chat',
      templateUrl: chatTemplate,
      resolve: {
        /* @ngInject */
        initialData: (ChatService) => {
          return ChatService.getInitialData();
        }
      },
      controller: 'ChatController',
      controllerAs: 'chatVm'
    })

    .state('chat.room', {
      url: '/room/:roomId',
      templateUrl: roomTemplate,
      controller: 'RoomController',
      controllerAs: 'vm'
    })
  ;

  $urlRouterProvider.otherwise('/chat');
}
