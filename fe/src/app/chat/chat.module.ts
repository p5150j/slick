'use strict';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatSocketService } from './chat-socket.service';
import { Sidebar } from './sidebar/sidebar.directive'
import { Messages } from './room/messages/messages.directive'

//import { Room } from './room/room.directive'
import { RoomController } from './room/room.controller';
import { RoomToolbar } from './room/room-toolbar.directive';

var io: any = <any>require('socket.io-client');


angular.module('slick.chat', [
    'btford.socket-io',
  ])
  .service('ChatService', ChatService)
  .service('ChatSocketService', ChatSocketService)
  .controller('ChatController', ChatController)
  .controller('RoomController', RoomController)
  .directive('slSidebar', Sidebar)
  .directive('slMessages', Messages)
  .directive('slRoomToolbar', RoomToolbar)
  //.directive('slRoom', Room)


  .factory('MySocket', ['socketFactory', (socketFactory: any /*socketUrl: string*/) => {

      var socket = io.connect();

      socket.on('error', () => {
        console.log('connect_error');
      });

      return socketFactory({
        ioSocket: socket
      });
    }]
  );
