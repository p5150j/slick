

import api = require ('../../shared/api-models');
import {Room} from "../../shared/api-models";
import {ChatSocketService} from "../chat-socket.service";
import {Message} from "../../shared/api-models";

/** @ngInject */
export function Room(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'app/chat/room/room.html',
    controller: SlRoomController,
    controllerAs: 'vm',
    bindToController: {
      slRoom: '='
    },
    link: linkFunction

  };



  function linkFunction(scope, element, attrs, controller){

    element.on("$destroy", function () {
      scope.$destroy();
    });
    scope.$watch('vm.slRoom.messages.length', (newVal) =>{
      let $element = element.find('main');
      controller.$timeout(() => {
        $element[0].scrollTop = $element[0].scrollHeight;
      });
    });
  }
}

/** @ngInject */
export class SlRoomController {

  public currentMessage: string;
  public slRoom: Room; //room

  constructor(private ChatSocketService: ChatSocketService,
              public $timeout: angular.ITimeoutService

  ) {
    //this.slRoom.usersObj

  }


  // Sends a chat message
  sendMessage() {
    var message = this.currentMessage;
    // Prevent markup from being injected into the message
    //message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {

      let m = new api.Message();
      m.text = message;
      m.room = this.slRoom._id;
      this.ChatSocketService.sendMessage(m);


      //@TODO - this will return a promise, when it returns we enable the send button again
      //this.addChatMessage(socketData); //add as transient
      this.currentMessage = '';

    }
  }
}
