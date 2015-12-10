/// <reference path='../../typings/tsd.d.ts' />
"use strict";

import {IUser} from "../models/user.model";
import express = require("express");

import {UserRepository} from '../models/user.model'
import {RoomRepository} from '../models/room.model'

export class IndexRoute {


  constructor() {

  }

  private getSeedData() {

    let users = [
      {
        _id: '565e2d404628fbac0d1a10d0', //
        email: 'alejandro@gmail.com',
        username: 'Alejandro',
        password: 'admin',
        role: 'admin'
      },
      {
        _id: '565e2d404628fbac0d1a10d1', //
        email: 'patrick@gmail.com',
        username: 'Patrick',
        password: 'admin',
        role: 'admin'
      },
      {
        _id: '565e2d404628fbac0d1a10d2', //
        email: 'ramiro@gmail.com',
        username: 'Ramiro',
        password: 'admin',
        role: 'admin'
      },
      {
        _id: '565e2d404628fbac0d1a10d3', //
        email: 'user1@gmail.com',
        username: 'User1',
        password: 'admin',
        role: 'user'
      },
      {
        _id: '565e2d404628fbac0d1a10d4', //
        email: 'user2@gmail.com',
        username: 'User2',
        password: 'admin',
        role: 'user'
      },
      {
        _id: '565e2d404628fbac0d1a10d5', //
        email: 'user3@gmail.com',
        username: 'User3',
        password: 'admin',
        role: 'user'
      }

    ];
    let rooms = [
      {
        _id: '565e2d404628fbac0d1a10f0',
        name: 'A private IM between 2 users', //client will show other person name
        desc: '',
        users: [users[0]._id, users[1]._id],
        type: 'IM'
      },
      {
        _id: '565e2d404628fbac0d1a10f1',
        name: 'A private IM between 2 users II', //client will show other person name
        desc: '',
        users: [users[1]._id, users[2]._id],
        type: 'IM'
      },
      {
        _id: '565e2d404628fbac0d1a10f2',
        name: 'A private IM between 2 users III', //client will show other person name
        desc: '',
        users: [users[0]._id, users[2]._id],
        type: 'IM'
      },
      {
        _id: '565e2d404628fbac0d1a10f3',
        name: 'Development', //client will show other person name
        desc: '',
        users: [users[0]._id, users[1]._id, users[2]._id,],
        type: 'GIM'
      },
    ];

    return {
      users: users,
      rooms: rooms
    }
  }

  public appendRoutes(router: express.Router): void {

    var data = this.getSeedData();
    router.get("/setup", (req: express.Request, res: express.Response): void => {

      UserRepository.remove({}).exec()
        .then(()=> {
          console.log('removed');
          //u.email =
          return UserRepository.create(data.users);
        })
        .then(() => {
          return RoomRepository.remove({}).exec()
        })
        .then(() => {
          return RoomRepository.create(data.rooms)
        })
        .then(() => {
            res.send(data);
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

}
