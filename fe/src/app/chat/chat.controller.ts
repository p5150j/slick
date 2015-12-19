import {ChatService} from './chat.service';
import {PrincipalService} from "../login/principal.service";
import {ChatSocketService} from "./chat-socket.service";
import {Message} from "../shared/api-models";
import {Room} from "../shared/api-models";


export class ChatController {

  public myArticles: any[];
  public logMessages: string[];

  public users: any[];
  public rooms: any[];
  public currentRoom: any; //room object


  /* @ngInject */
  constructor(private ChatService: ChatService,
              private ChatSocketService: ChatSocketService,
              private $state: angular.ui.IStateService,
              private toastr: any,
              private $mdMedia,
              private $mdSidenav: any,
              $rootScope,
              initialData
  ) {

    this.logMessages = [];
    this.users = [];
    this.rooms = [];

    $rootScope.$mdMedia = $mdMedia;

    ChatSocketService.addMessageListener(this);

    //ChatService.getInitialData().then((initialData: any)=> {
      this.users = initialData.users;
      this.rooms = initialData.rooms;
    //});
  }

  toggleToolbar = () => {
    this.$mdSidenav('left')
      .toggle()
  };

  addChatMessage(data: Message) {
    this.ChatService.prepareMessage(data); //this should come from the service -> data is 'prepared' there
    let allRooms = this.ChatService.getRooms();
    let room;

    if (room = allRooms[data.room]) {
      if (room == this.currentRoom) {
        //animate?
      } else {
        room.pending++;
      }

      room.messages.push(data); //@TODO: sort
    } else {
      this.ChatService.getRoomById(data.room).then((room) => {
        room.pending++;
        this.rooms.push(room);
      });
      //console.log('Created new room!!!');
    }

  }

  onRoomSelected(room: Room) {
    if (this.currentRoom == room) {
      return;
    }
    room.pending = 0;
    this.currentRoom = room;
    this.$state.go('chat.room', {'roomId': room._id});
  }

  userStatusChanged(userId, status) {
    //_.find(this.users, {userId: userId}).online = status; //needs to be faster?
    this.ChatService.getUsers()[userId].online = status; //it's the same object as in our list!
  }

  get() {
    this.ChatService.getArticles().then((d: any) => {
      this.myArticles = d;
    });
  }


}
