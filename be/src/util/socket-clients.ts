/// <reference path="../../typings/tsd.d.ts" />

"use strict";


import mongoose = require("mongoose");

import {IMessage, MessageRepository} from "../models/message.model";
import {IRoom, RoomRepository} from "../models/room.model";
var _ = require('lodash');

export class SocketClients {

  private io: SocketIO.Server;
  private MessageRepository: mongoose.Model<IMessage>;
  private RoomRepository: mongoose.Model<IRoom>;


  constructor(io: SocketIO.Server) {
    this.MessageRepository = MessageRepository;
    this.RoomRepository = RoomRepository;
    this.io = io;
  }

  private sendMessageToRoom(room: string, messageTag: string, data: {}) {
    //This goes into redis?
    this.RoomRepository.findById(room, 'users', {})
      .exec().then((user: IRoom) => {
      if (!user.users) {

        return; //error @TODO handle
      }


      user.users.forEach((user) => {
        var s = this.getSocketRedis(user);
        s && s.emit(messageTag, data);
      });
    });
  }


  newMessage(newMessage: IMessage) {

    // we tell the client to execute 'new message'
    console.log(newMessage.text);

    var clientData = {
      user: newMessage.user,
      message: newMessage.text
    };
    return this.sendMessageToRoom(newMessage.room, 'new message', clientData);
  }

  confirmLogin(user:string): void {

    this.getSocketRedis(user).emit('login', {

        //numUsers: numUsers
      });
  }

  broadcastUserStatusChanged(user, connected: boolean) {
    this.io.sockets.emit('user joined', {
      userId: user,
      status: 'online' //@TODO;
    });
  }

  private getSocketRedis(user){
    return _.find(this.io.sockets.connected, {userId: user});
  }

}
//}
