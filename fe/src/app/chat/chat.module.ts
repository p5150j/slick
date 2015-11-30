'use strict';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Sidebar } from './sidebar/sidebar.directive'

declare var io: any; // SocketIO.Client;


angular.module('slick.chat', [
    'btford.socket-io',
  ])
  .service('ChatService', ChatService)
  .controller('ChatController', ChatController)
  .directive('slSidebar', Sidebar)



  .factory('MySocket', ['socketFactory', 'socketUrl', (socketFactory: any, socketUrl: string) => {
      var socket = io.connect(socketUrl);

      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('error', () => {
        console.log('connect_error');
      });

      return socketFactory({
        ioSocket: socket
      });
    }]
  );
