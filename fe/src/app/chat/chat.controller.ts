import {ChatService} from './chat.service';
import {PrincipalService} from "../login/principal.service";


export class ChatController {

  public myArticles: any[];
  public logMessages: string[];
  public chatMessages: string[];

  public users: any[];
  public rooms: any[];
  public currentRoom: any; //room object
  public connected: boolean;

  private MySocket: SocketIOClient.Socket;

  /* @ngInject */
  constructor(private ChatService: ChatService, private toastr: any, MySocket: SocketIOClient.Socket, private PrincipalService: PrincipalService) {
    this.MySocket = MySocket;

    this.logMessages = [];
    this.users = [];
    this.rooms = [];
    this.activate(this.MySocket);
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

  addChatMessage(data: any) {
    this.currentRoom.messages.push(data);
  }


  login() {
    this.MySocket.emit('login', this.PrincipalService.getToken());
  }

  onRoomSelected(room: any){
    this.currentRoom = room;
    this.currentRoom.messages = this.currentRoom.messages || [];
    this.log('room selected');
  }

  activate(socket: SocketIOClient.Socket) {

    this.ChatService.getInitialData().then((data: any)=> {
      this.users = data.users;
      this.rooms = data.rooms;
      this.onRoomSelected(this.rooms[0]);
    });

    this.login();
    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      this.connected = true;
      // Display the welcome message
      this.log("Welcome to Socket.IO Chat – ");
      this.addParticipantsMessage(data);
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
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

}
