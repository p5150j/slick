import {Message} from "../shared/api-models";

export class ChatSocketService {

  /** @ngInject */
  constructor(private $log: angular.ILogService,
              private $q: angular.IQService,
              //private PrincipalService,
              private MySocket) {

  }

  sendMessage = (message: Message ) => {

    this.MySocket.emit('new message', message);
    //@TODO: we could hide this under a promise, if we manage to get a kind of confirmation from the server
  }
}
