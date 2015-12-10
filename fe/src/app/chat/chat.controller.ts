import {ChatService} from './chat.service';
import {PrincipalService} from "../login/principal.service";
import { Message } from "../shared/api-models";


export class ChatController {

  public myArticles: any[];
  public logMessages: string[];

  public users: any[];
  public rooms: any[];
  public currentRoom: any; //room object
  public connected: boolean;

  private MySocket: SocketIOClient.Socket;

  /* @ngInject */
  constructor(private ChatService: ChatService, private toastr: any, MySocket: SocketIOClient.Socket) {
    this.MySocket = MySocket;

    this.logMessages = [];
    this.users = [];
    this.rooms = [];
    this.activate(this.MySocket);
  }

  activate(socket: SocketIOClient.Socket) {

    this.ChatService.getInitialData().then((data: any)=> {
      this.users = data.users;
      this.rooms = data.rooms;
      this.onRoomSelected(this.rooms[0]); //first room
    });

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      this.connected = true;
      // Display the welcome message
      this.log("Welcome to Socket.IO Chat – ");
      this.addParticipantsMessage(data);
    });

    socket.on('disconnected', () => {
      this.connected = false;
    });
      // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data: Message) => {
      this.addChatMessage(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
      this.log(data.username + ' joined');
      this.addParticipantsMessage(data);
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
      this.log(data.username + ' left');
      this.addParticipantsMessage(data);
      //removeChatTyping(data);
    });

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', (data) => {
      //addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', (data) => {
      //removeChatTyping(data);
    });
    socket.on('model error', (data) => {
      console.error(data);
    });
  }


  addChatMessage(data: Message) {
    this.ChatService.prepareMessage(data);
    let allRooms = this.ChatService.getRooms();
    let room;

    if(room = allRooms[data.room]){
      if(room == this.currentRoom){
        //animate?
      }else {
        //add some pending message somewhere
      }
      room.messages.push(data);
    }else {
      console.log('Create new room!!!');
    }

  }

  onRoomSelected(room: any){
    if(this.currentRoom == room) {
      return;
    }
    this.currentRoom = room;
    this.currentRoom.messages = this.currentRoom.messages || [];
    this.ChatService.prepareRoom(this.currentRoom);
    this.log('room selected');
  }


  get() {
    this.ChatService.getArticles().then((d: any) => {
      this.myArticles = d;
    });
  }

  log(message: string, options?) {
    this.logMessages.push(message);
  }

  addParticipantsMessage(message: string) {
    console.log('wtf is this ' + message);
    //this.participantMessages.push(message);
  }

}
