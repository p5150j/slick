/// <reference path="../../typings/tsd.d.ts" />

"use strict";

//export module controllers {

import { IMessage, MessageRepository } from '../models/message.model'
import { IUser, UserRepository } from '../models/user.model'

import {SocketClients} from "../util/socket-clients";

import mongoose = require("mongoose");


export class SocketController {

  private MessageRepository: mongoose.Model<IMessage>;
  private UserRepository: mongoose.Model<IUser>;

  constructor(private socketClients: SocketClients) {
    this.MessageRepository = MessageRepository;
    this.UserRepository = UserRepository;
  }


  newMessage(newMessage: IMessage) {

    console.log(newMessage)
    this.MessageRepository.create(newMessage)
      .then(()=> {
        this.socketClients.newMessage(newMessage);
      });

    //socket.broadcast.emit('new message', {
    //  username: socket['userId'],
    //  message: data
    //});
  }


  login(accessToken: string, socket: SocketIO.Socket): void {
    this.UserRepository.findOne({token: accessToken}, (err, user) => {
      if (err || !user) {
        return socket.disconnect(true);
      }


      socket['userId'] = user.id;
      console.log('logged into socket', socket);

      this.socketClients.confirmLogin(user.id);
      this.socketClients.broadcastUserStatusChanged(user.id, true);

    });
  }


  logout(userId: string): void {
    // remove the username from global usernames list
    //  delete usernames[socket.username];
    //  --numUsers;

    // echo globally that this client has left
    this.socketClients.broadcastUserStatusChanged(userId, true);
  }
}
//}
