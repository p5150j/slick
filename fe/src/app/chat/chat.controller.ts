import {ChatService} from './chat.service';
import {PrincipalService} from "../login/principal.service";
import {ChatSocketService} from "./chat-socket.service";
import {Message} from "../shared/api-models";


export class ChatController {

  public myArticles: any[];
  public logMessages: string[];

  public users: any[];
  public rooms: any[];
  public currentRoom: any; //room object


  /* @ngInject */
  constructor(private ChatService: ChatService, private toastr: any, private ChatSocketService: ChatSocketService) {

    this.logMessages = [];
    this.users = [];
    this.rooms = [];

    ChatSocketService.addMessageListener(this);

    ChatService.getInitialData().then((data: any)=> {
      this.users = data.users;
      this.rooms = data.rooms;
      this.onRoomSelected(this.rooms[0]); //first room
    });
  }

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

  onRoomSelected(room: any) {
    if (this.currentRoom == room) {
      return;
    }
    room.pending = 0;
    this.currentRoom = room;
    this.currentRoom.messages = this.currentRoom.messages || [];
    //this.ChatService.prepareRoom(this.currentRoom);
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
