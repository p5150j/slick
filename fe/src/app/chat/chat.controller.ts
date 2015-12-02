import {ChatService} from './chat.service';
import {PrincipalService} from "../login/principal.service";


export class ChatController {

  public data: any[];
  public logMessages: string[];
  public participantMessages: string[];
  public chatMessages: string[];

  public users: Array;
  public rooms: Array;
  public userName: string;
  public connected: boolean;
  public currentMessage: string;

  private socket: SocketIOClient.Socket;

  /* @ngInject */
  constructor(private ChatService: ChatService, private toastr: any, MySocket: SocketIOClient.Socket, private PrincipalService: PrincipalService) {
    this.socket = MySocket;

    this.logMessages = [];
    this.participantMessages = [];
    this.chatMessages = [];
    this.users = [];
    this.rooms = [];
    this.activate(this.socket);
  }

  get() {
    this.ChatService.getArticles().then((d: any) => {
      this.data = d;
    });
  }

  // Sends a chat message
  sendMessage() {
    var message = this.currentMessage;
    // Prevent markup from being injected into the message
    //message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && this.connected) {
      this.currentMessage = '';
      var socketData = {
        room: this.rooms[0]._id,
        user: this.PrincipalService.getUsername(),
        text: message
      };
      this.addChatMessage(socketData);

      // tell server to execute 'new message' and send along one parameter
      this.socket.emit('new message', socketData);
    }
  }

  log(message: string, options?) {
    this.logMessages.push(message);
  }

  addParticipantsMessage(message: string) {
    this.participantMessages.push(message);
  }

  addChatMessage(data: any) {
    this.chatMessages.push(data);
  }


  login() {
    this.socket.emit('login', this.PrincipalService.getToken());
  }

  activate(socket: SocketIOClient.Socket) {

    this.ChatService.getInitialData().then((data: any)=> {
      this.users = data.users;
      this.rooms = data.rooms;
    });

    this.login();
    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      this.connected = true;
      // Display the welcome message
      var message = "Welcome to Socket.IO Chat – ";
      this.log(message, {
        prepend: true
      });
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
  }

}
