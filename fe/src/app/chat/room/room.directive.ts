import {Room, Message} from "../../shared/api-models";
import {ChatSocketService} from "../chat-socket.service";

var tpl = require('./room.html');


/** @ngInject */
export function Room(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: tpl,
    controller: SlRoomController,
    controllerAs: 'vm',
    bindToController: {
      slRoom: '='
    },
    link: linkFunction

  };


  function linkFunction(scope, element, attrs, controller) {

    element.on("$destroy", function () {
      scope.$destroy();
    });
    scope.$watch('vm.slRoom.messages.length', (newVal) => {
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
  public isConnected: Function;

  constructor(private ChatSocketService: ChatSocketService,
              public $timeout: angular.ITimeoutService) {
    //this.slRoom.usersObj

    this.isConnected = ChatSocketService.isConnected;

  }



  // Sends a chat message
  sendMessage() {

    var message = this.currentMessage;
    // Prevent markup from being injected into the message
    //message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {

      this.currentMessage = '';

      let newMessage = new Message();
      newMessage.text = message;
      newMessage.room = this.slRoom._id;

      this.sendPendingMessage(newMessage);
    }
  }

  sendPendingMessage = (pendingMessage) => {
    this.slRoom.messages.push(pendingMessage);
    this.ChatSocketService.sendMessage(pendingMessage)
      .then((m) => { //someone will add the message for us
        _.remove(this.slRoom.messages, pendingMessage);
      });
  }
}
