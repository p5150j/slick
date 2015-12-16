import {Message} from "../shared/api-models";
import {PrincipalService} from "../login/principal.service";
import IPromise = angular.IPromise;

export class ChatSocketService {

  private connected: boolean = false;

  private listener;

  private pendingMessages: Message[] = [];

  /** @ngInject */
  constructor(private $log: angular.ILogService,
              private $q: angular.IQService,
              private PrincipalService: PrincipalService,
              private MySocket) {

    let socket = MySocket;

    socket.on('connect', () => {
      this.$log.debug('Socket connected');
      if (PrincipalService.isAuthenticated()) {
        this.login();
      }
    });

    socket.on('not auth', (message: {message: any}) => {
      this.$log.debug('Not authed', message.message);
      this.connected = false;
      if (PrincipalService.isAuthenticated()) {
        this.login();
      }
    });

    socket.on('login', (data) => {
      this.connected = true;
      this.$log.debug("Logged in into socket");
    });

    socket.on('disconnected', () => {
      this.connected = false;
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data: Message) => {
      if (data.user == this.PrincipalService.getUserId()) {
        //may be pending message - we resolve the promise
        for (var i = 0; i < this.pendingMessages.length; i++) {
          let message = this.pendingMessages[i];
          if (message.room == data.room && message.text == data.text) {
            message['pending'].resolve(data);
            this.pendingMessages.splice(i, 1);
            break;
          }
        }
      }
      this.listener.addChatMessage(data)
    });

    //// Whenever the server emits 'user joined', log it in the chat body
    //socket.on('user joined', (data) => {
    //  this.$log.debug(data.username + ' joined');
    //  this.addParticipantsMessage(data);
    //});
    //
    //// Whenever the server emits 'user left', log it in the chat body
    //socket.on('user left', (data) => {
    //  this.$log.debug(data.username + ' left');
    //  this.addParticipantsMessage(data);
    //  //removeChatTyping(data);
    //});


    socket.on('user status', (data: {user:string, online:boolean}) => {
      this.listener.userStatusChanged(data.user, data.online );
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

  isConnected = () => {
    return this.connected;
  };

  addMessageListener = (listener) => {
    this.listener = listener;
  };

  login = () => {
    this.$log.log('trying to login');
    this.MySocket.emit('login', this.PrincipalService.getToken());
  };


  sendMessage = (message: Message): IPromise<Message> => {
    this.pendingMessages.push(message);
    this.MySocket.emit('new message', message);

    let deferred = this.$q.defer();
    message['pending'] = deferred;
    return deferred.promise;
  };
}
