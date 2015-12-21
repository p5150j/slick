import {ChatService} from './chat.service';
import {PrincipalService} from "../login/principal.service";
import {ChatSocketService} from "./chat-socket.service";
import {Message} from "../shared/api-models";
import {Room} from "../shared/api-models";


export class ChatController {

  public myArticles: any[];

  //public users: any[];
  //public rooms: any[];
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

    //this.users = [];
    //this.rooms = [];

    $rootScope.$mdMedia = $mdMedia;
    ChatSocketService.login();

    //ChatService.addListener(this);

    //ChatService.getInitialData().then((initialData: any)=> {
    //  this.users = initialData.users;
    //  this.rooms = initialData.rooms;
    //});
  }

  toggleToolbar = () => {
    this.$mdSidenav('left')
      .toggle()
  };

  //onNewRoom(room) {
  //  this.rooms.push(room);
  //}

  onRoomSelected(room: Room) {
    if (this.currentRoom == room) {
      return;
    }
    //room.pending = 0;
    this.currentRoom = room;
    this.$state.go('chat.room', {'roomId': room._id});
  }
  onRoomLoaded(room: Room){ //called by child
    this.currentRoom = room; //may not be set on first load
  }

  get() {
    this.ChatService.getArticles().then((d: any) => {
      this.myArticles = d;
    });
  }


}
