/// <reference path='../../typings/tsd.d.ts' />

import {IMessage} from "../models/message.model";
import Socket = SocketIO.Socket;
"use strict";
import {SocketController} from "../controllers/socket.controller.ts";


export class SocketRoute {

  constructor(private io: SocketIO.Server, private SocketController: SocketController) {

    this.activate();
  }


  public activate(): void {

    // usernames which are currently connected to the chat
    let numUsers = 0;
    //let data: { [key: string]: SocketData; } = {};

    this.io.on('connection', (socket: SocketIO.Socket)=> {

      console.log('a user connected');

      // when the client emits 'new message', this listens and executes
      socket.on('new message', (data) => {

        console.log('new message user', socket)
        //see how to make this less boilerplate, and how to validate (somewhere.. may be later)
        let newMessage = <IMessage>{};
        newMessage.room = data.room;
        newMessage.text = data.text;
        newMessage.user = socket['userId'];

        this.SocketController.newMessage(newMessage);

      });

      // when the client emits 'add user', this listens and executes
      socket.on('login', (accessToken: string) => {

        this.SocketController.login(accessToken, socket);

      });

      // when the user disconnects.. perform this
      socket.on('logout', () => {

        this.SocketController.logout(socket['userId']);

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
}
