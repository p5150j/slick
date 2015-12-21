/// <reference path='../../typings/tsd.d.ts' />

import {IMessage} from "../models/message.model";
import api = require ('../shared/api-models');

import {SocketController} from "../controllers/socket.controller.ts";


export class SocketRoute {

  constructor(private io: SocketIO.Server, private SocketController: SocketController) {

    this.activate();
  }


  public activate(): void {

    //
    //this.io.use(function(socket, next){
    //  console.log('-----------------------------------------------------');
    //  console.log(socket.request);
    //  next();
    //  //if (socket.request.headers.cookie) return next();
    //  //next(new Error('Authentication error'));
    //});

    this.io.on('connection', (socket: SocketIO.Socket)=> {

      console.log('a user connected');

      let onevent = socket['onevent'];
      socket['onevent'] = function (packet) {
        let eventName = packet.data[0];
        if(eventName !== 'login' && !socket['userId']) {
          packet.data.unshift('not auth'); //this will be called
        }
        onevent.call (this, packet);
      };

      socket.on('not auth', function() {

        socket.emit('not auth', {
          message: arguments
        });
      });

      // when the client emits 'new message', this listens and executes
      socket.on('new message', (data) => {

        console.log('new message user', data.text);
        //see how to make this less boilerplate, and how to validate (somewhere.. may be later)
        let newMessage = <api.Message>{};
        newMessage.room = data.room;
        newMessage.text = data.text;
        newMessage.user = socket['userId'];

        return this.sendErrorsBack(socket, this.SocketController.newMessage(newMessage));

      });

      // when the client emits 'add user', this listens and executes
      socket.on('login', (accessToken: string) => {

        return this.sendErrorsBack(socket, this.SocketController.login(accessToken, socket), 'login error');

      });


      socket.on('disconnect', () => {
        socket['userId'] && this.SocketController.logout(socket['userId']);
      });

      socket.on('logout', () => {

        return this.sendErrorsBack(socket, this.SocketController.logout(socket['userId']));

      });


      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.emit('typing', {
          username: socket['userId']
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket['userId']
        });
      });


    });
  }

  private sendErrorsBack(socket, promise, tag = 'model error') {
    return promise.then(null, (reason: any) => {
      socket.emit(tag, {
        message: reason
      });
    });
  }
}
