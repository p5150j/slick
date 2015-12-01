

"use strict";
import {SocketServiceAPI} from "./controllers/SocketServiceAPI";

/// <reference path='../typings/tsd.d.ts' />

interface SocketData {
  userName: string;
}

export class SocketHandler {

  private SocketService: SocketServiceAPI;

  constructor(private io: SocketIO.Server) {

    this.activate();
    this.SocketService = new SocketServiceAPI();
  }


  public activate(): void {

    // usernames which are currently connected to the chat
    let numUsers = 0;
    let data: { [key: string]: SocketData; } = {};

    this.io.on('connection', (socket: any)=> {

      console.log('a user connected');

      // when the client emits 'new message', this listens and executes
      socket.on('new message', (data) => {

        this.SocketService.newMessage(data, socket);

      });

      // when the client emits 'add user', this listens and executes
      socket.on('login', (accessToken: string) => {

        this.SocketService.login(accessToken, socket);

      });

      // when the user disconnects.. perform this
      socket.on('logout', () => {

        this.SocketService.logout(socket);

      });


      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });


    });
  }
}
