/// <reference path="../../typings/tsd.d.ts" />

import {Promise} from "mongoose";
import {Message} from "../shared/api-models";
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


  newMessage(newMessage: Message): Promise<any> {

    console.log(newMessage);
    return this.MessageRepository.create(newMessage)
      .then(()=> {
        this.socketClients.newMessage(newMessage);
      });

    //socket.broadcast.emit('new message', {
    //  username: socket['userId'],
    //  message: data
    //});
  }


  login(accessToken: string, socket: SocketIO.Socket): Promise<any> {
    return this.UserRepository.findOne({token: accessToken}, (err, user) => {
      if (err || !user) {
        return socket.disconnect(true);
      }

      console.log(user);
      var userId: string = <string>user._id;

      socket['userId'] = userId;
      console.log('logged into socket');

      this.socketClients.confirmLogin(userId);
      this.socketClients.broadcastUserStatusChanged(userId, true);

    }).lean().exec();
  }


  logout(userId: string): Promise<any> {
    // remove the username from global usernames list
    //  delete usernames[socket.username];
    //  --numUsers;

    // echo globally that this client has left
    this.socketClients.broadcastUserStatusChanged(userId, true);

    return new Promise().resolve(null, true);
  }
}
