'use strict';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatSocketService } from './chat-socket.service';
import { Sidebar } from './sidebar/sidebar.directive'
import { Messages } from './room/messages/messages.directive'
import { Room } from './room/room.directive'
import { runBlock } from './socket.auth.run'

declare var io: any; // SocketIO.Client;


angular.module('slick.chat', [
    'btford.socket-io',
  ])
  .service('ChatService', ChatService)
  .service('ChatSocketService', ChatSocketService)
  .controller('ChatController', ChatController)
  .directive('slSidebar', Sidebar)
  .directive('slMessages', Messages)
  .directive('slRoom', Room)
  .run(runBlock)


  .factory('MySocket', ['socketFactory', 'socketUrl', (socketFactory: any, socketUrl: string) => {
      var socket = io.connect(socketUrl);

      socket.on('error', () => {
        console.log('connect_error');
      });

      return socketFactory({
        ioSocket: socket
      });
    }]
  );
