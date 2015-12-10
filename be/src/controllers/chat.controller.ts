/// <reference path="../../typings/tsd.d.ts" />

"use strict";

import {User, ROOM_TYPES, Room} from "../shared/api-models";
import {ValidationError} from "../models/validation.error";
import express = require("express");
import mongoose = require("mongoose");
import {IMessage, MessageRepository} from "../models/message.model";
import {IUser, UserRepository} from "../models/user.model";
import {IRoom, RoomRepository} from "../models/room.model";

var _ = require('lodash');

export class ChatController {

  private Article: mongoose.Model<mongoose.Document>;
  private MessageRepository: mongoose.Model<IMessage>;
  private RoomRepository: mongoose.Model<IRoom>;
  private UserRepository: mongoose.Model<IUser>;


  constructor() {
    this.Article = mongoose.model("Article");
    this.MessageRepository = MessageRepository;
    this.RoomRepository = RoomRepository;
    this.UserRepository = UserRepository;
  }

  public init = (req: express.Request, res: express.Response, next: Function) => {
    var myRooms;
    var user: User = req.user;
    console.log('the user is ', user._id + '-' + user.username);


    this.RoomRepository.find({'users': user._id}).lean().exec() //@TODO: move this to redis (user->room map)
      .then((rooms)=> {
        myRooms = rooms;
        let roomIds = _.pluck(rooms, '_id');
        console.log('room', roomIds);
        //return roomIds;
        //
        return this.MessageRepository.aggregate([
          {
            $match: {room: {$in: roomIds}}
          },
          {
            $group: {
              _id: '$room',
              messages: {$push: {_id: '$id', text: '$text', ts: '$ts', user: '$user'}}
            }
          }
        ]).exec()
      })
      .then((messages) => {
        var ixMessages = _.indexBy(messages, '_id');

        myRooms.forEach((room, index, array)=> {
          array[index].messages = ixMessages[room._id] ? ixMessages[room._id].messages : [];
        });

        this.UserRepository.find({}, 'username role').lean().exec().then((users)=> {

          res.json({
            users: users,
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


  public getRoom = (req: any, res: express.Response): void => {
    res.json(req.room);
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
