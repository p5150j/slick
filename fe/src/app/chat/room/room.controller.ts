import {Room, Message} from "../../shared/api-models";
import {ChatSocketService} from "../chat-socket.service";
import {ChatService} from "../chat.service";

/** @ngInject */
export class RoomController {

  public currentMessage: string;
  public slRoom: Room; //room
  public isConnected: Function;

  constructor(private ChatSocketService: ChatSocketService,
              private ChatService: ChatService,
              private $stateParams: angular.ui.IStateParamsService,
              public $timeout: angular.ITimeoutService,
              private $scope: angular.IScope
  ) {

    this.isConnected = ChatSocketService.isConnected;


    ChatService.getRoomById($stateParams['roomId']).then((room) => {
      this.slRoom = room;
      $scope['chatVm'].onRoomLoaded(room);
    });



    //change this to some event system...
    $scope.$watch('vm.slRoom.messages.length', (newVal) => {

      this.slRoom.pending = 0;
      let $element:any = angular.element;
      $element = $element.find('main')[0];

      $timeout(() => {
        $element.scrollTop = $element.scrollHeight;

      });
    });
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
        this.slRoom.pending = 0;
      });
  }
}
