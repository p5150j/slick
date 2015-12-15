
import express = require("express");
import mongoose = require("mongoose");
import {User, ROOM_TYPES, Room} from "../shared/api-models";
import {ValidationError} from "../models/validation.error";
import {IMessage, MessageRepository} from "../models/message.model";
import {IUser, UserRepository} from "../models/user.model";
import {IRoom, RoomRepository} from "../models/room.model";
import {SocketClients} from "../util/socket-clients";
import Server = SocketIO.Server;

var _ = require('lodash');

export class ChatController {

  private Article: mongoose.Model<mongoose.Document>;
  private MessageRepository: mongoose.Model<IMessage>;
  private RoomRepository: mongoose.Model<IRoom>;
  private UserRepository: mongoose.Model<IUser>;


  constructor(private socketClients: SocketClients) {
    this.Article = mongoose.model("Article");
    this.MessageRepository = MessageRepository;
    this.RoomRepository = RoomRepository;
    this.UserRepository = UserRepository;
  }

  public init = (req: express.Request, res: express.Response, next: Function) => {
    let myRooms;
    let user: User = req.user;
    console.log('Init for', user._id + '-' + user.username);

    this.RoomRepository.find({'users': user._id}).lean().exec() //@TODO: move this to redis (user->room map)
      .then((rooms)=> {
        myRooms = rooms;
        return this.MessageRepository['getForRooms'](_.pluck(rooms, '_id')).exec()
      })
      .then((messages) => {
        let roomIndexedMessages = _.indexBy(messages, '_id');

        myRooms.forEach((room, r, myRooms)=> {
          myRooms[r].messages = roomIndexedMessages[room._id] ? roomIndexedMessages[room._id].messages : [];
        });

        this.UserRepository.find({}, 'username role').lean().exec().then((users)=> {

          let onLineUsers = this.socketClients.getOnlineUsers();

          res.json({
            users: users,
            onlineUsers: onLineUsers,
            rooms: myRooms
          });

        }, (err) => {
          res.status(400).json({message: err})
        })
      }, (err) => {
        next(err)
      })
  };

  public createIMRoom = (req: express.Request, res: express.Response, next): void => {
    delete req.body._id; //just in case..
    var newRoom: Room = req.body;
    var toUser = req.params['toUser'];
    var myUser = req.user._id;

    //----- validate room better - ie. some validator object for rooms
    if (!toUser) {
      return next(new ValidationError('toUser is required'))
    }
    if (myUser == toUser) {
      return next(new ValidationError('can\'t make a conversation to yourself - maniac'));
    }
    let users = [toUser, myUser];
    let model: IRoom;

    this.RoomRepository.findOne({type: ROOM_TYPES.IM, users: {$all: users}}).exec((err: Error, room: IRoom) => {
      if (err) {
        return next(new ValidationError("find error",err));
      }

      if (!room) { //not exists
        model = new this.RoomRepository(newRoom);
        model.type = ROOM_TYPES.IM;
        model.users = [toUser, req.user._id];
      }else {
        model = room;
      }
      model.desc = newRoom.dsc;
      model.name = newRoom.name;
      model.save((err: Error, room: mongoose.Document) => {
        if (err) {
          console.log(err);
          return next(new ValidationError("save error", err));
        } else {
          res.json(200, room); //@TODO may be only {_id: xx}
        }
      });

    });
  };

  public getAll = (req: express.Request, res: express.Response, next): void => {
    this.RoomRepository.find((err: Error, articles: Array<mongoose.Document>) => {
      if (err) {
        return next(new ValidationError(err));
      } else {
        res.json(articles);
      }
    }).lean();
  };


  public getRoom = (req: any, res: express.Response, next): void => {
    let room:IRoom = req.room;
    this.MessageRepository['getForRoom'](room.id)
      .exec().then((messages) =>{
      room['messages'] = messages;
      res.json(req.room);
    }, (err) => {
      return next(new ValidationError(err));
    });
  };

  public getRoomParam = (req: any, res: express.Response, next: Function, id: string) => {
    if (!id) {
      return next(new ValidationError("Room is invalid"));
    }
    this.RoomRepository.findById(id).exec((err: Error, room: mongoose.Document) => {
      if (err) {
        return next(new ValidationError(err));
      } else {
        req.room = room;

        next();
      }
    });
  };
}
