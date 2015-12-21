import {Message} from "../shared/api-models";
import {PrincipalService} from "../login/principal.service";
import IPromise = angular.IPromise;
import {ChatService} from "./chat.service";

export class ChatSocketService {

  private connected: boolean = false;

  private pendingMessages: Message[] = [];

  private retryTime: number = 1000;
  private timeoutInCourse: any;

  /** @ngInject */
  constructor(private $log: angular.ILogService,
              private $q: angular.IQService,
              private PrincipalService: PrincipalService,
              private ChatService: ChatService,
              private $timeout: angular.ITimeoutService,
              private MySocket) {

    let socket = MySocket;

    socket.on('connect', () => {
      this.$log.debug('Socket connected');
      this.connectedChange(false);
    });

    socket.on('not auth', (message: {message: any}) => {
      this.$log.debug('Not authed', message.message);
      this.connectedChange(false);
    });

    socket.on('login', (data) => {
      this.connectedChange(true);
    });

    socket.on('disconnected', () => {
      this.$log.info('socket disconnected'); //do we need to retry
      //this.connectedChange(false);
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
      ChatService.addChatMessage(data);
      //this.listener.addChatMessage(data)
    });

    socket.on('user status', (data: {user:string, online:boolean}) => {
      this.ChatService.userStatusChanged(data.user, data.online );
    });

    socket.on('typing', (data) => {
      //addChatTyping(data);
    });

    socket.on('stop typing', (data) => {
      //removeChatTyping(data);
    });
    socket.on('model error', (data) => {
      console.error(data);
    });

    socket.on('login error', (data) => {
      console.error(data);

      $timeout(()=> {
        this.login()
      }, 5000);
    });
  }

  isConnected = () => {
    return this.connected;
  };

  login = () => {

    this.MySocket.emit('login', this.PrincipalService.getToken());
  };


  sendMessage = (message: Message): IPromise<Message> => {
    this.pendingMessages.push(message);
    this.MySocket.emit('new message', message);

    let deferred = this.$q.defer();
    message['pending'] = deferred;
    return deferred.promise;
  };


  private connectedChange(newStatus){
    this.connected = newStatus;

    if(!this.connected) {
      this.$log.log('trying to login');
      if(this.timeoutInCourse) {
        return;
      }
      this.timeoutInCourse = this.$timeout(()=> {
        this.retryTime *= 2;
        this.timeoutInCourse = null;
        if (this.PrincipalService.isAuthenticated()) {
          this.login();
        }
      }, this.retryTime);
    }else {
      this.retryTime = 1000;
      this.timeoutInCourse && this.$timeout.cancel(this.timeoutInCourse);
      this.$log.debug("Logged in into socket");
    }
  }
}
