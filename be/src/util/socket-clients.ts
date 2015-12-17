import {Message} from "../shared/api-models";
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

  newMessage(newMessage: Message) {

    return this.sendMessageToRoom(newMessage.room, 'new message', newMessage);
  }

  getOnlineUsers() {
    //this should be faster!
    return _(this.io.sockets.sockets).map((obj) => {
      return obj['userId'];
    }).filter(e => e);
  }

  confirmLogin(user: string): void {

    this.getSocketRedis(user).emit('login', {
      //numUsers: numUsers
    });
  }


  broadcastUserStatusChanged(user, online: boolean) {

    this.io.sockets.emit('user status', {
      user: user,
      online: online
    });
  }

  private sendMessageToRoom(room: string, messageTag: string, data: {}) {
    //This goes into redis?
    //@TODO - this shouldn't decide to which users-- must receive a list of users.. and see if they are connected
    return this.RoomRepository.findById(room, 'users', {}).lean()
      .exec().then((user: IRoom) => {
        if (!user.users) {
          console.error('not user found to send message');
          return; //error @TODO handle
        }


        user.users.forEach((user) => {
          var s = this.getSocketRedis(user);
          s && s.emit(messageTag, data);
        });
      });
  }


  private getSocketRedis(user) {

    return _.find(this.io.sockets.connected, {userId: user});
  }

}
//}
