"use strict";
/// <reference path="../../typings/tsd.d.ts" />

//export module controllers {

import mongoose = require("mongoose");


export class SocketServiceAPI {


  private UserModel: mongoose.Model<mongoose.Document>;

  private usernames = {};


  constructor() {

    this.UserModel = mongoose.model('User');

  }


  newMessage(data: any, socket: SocketIO.Socket) {

    // we tell the client to execute 'new message'
    console.log(data.message);

    socket.broadcast.emit('new message', {
      username: socket['userId'],
      message: data
    });
  }


  login(accessToken: string, socket: SocketIO.Socket): void {
    this.UserModel.findOne({token: accessToken}, function (err, user) {
      if (err || !user) {
        return socket.disconnect(true);
      }

      socket['userId'] = user._id;

      console.log('add user');

      socket.emit('login', {
        //numUsers: numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        userId: socket['userId']
      });
    });
  }


  logout(socket: SocketIO.Socket): void {
    // remove the username from global usernames list
    //  delete usernames[socket.username];
    //  --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      userId: socket['userId']
    });
  }
}
//}
