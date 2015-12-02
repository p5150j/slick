/// <reference path="../../typings/tsd.d.ts" />

"use strict";
import express = require("express");
import mongoose = require("mongoose");
import {IRoom, RoomRepository} from "../models/room.model";
import {IMessage, MessageRepository} from "../models/message.model";
import {IUser, UserRepository} from "../models/user.model";


export class ArticleController {

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

  public init = (req: express.Request, res: express.Response) => {
    let data = {rooms: null, users: null};
    this.RoomRepository.find({}).exec()
      .then((rooms)=> {
        data.rooms = rooms;
        this.UserRepository.find({}).exec().then((users)=> {
          data.users = users;
          res.json(data);
        }, (err) => {
          res.status(400).json({message: err})
        })
      })
  }

  public list = (req: express.Request, res: express.Response): void => {
    this.Article.find((err: Error, articles: Array<mongoose.Document>) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        res.jsonp(200, articles);
      }
    });
  };

  public create = (req: express.Request, res: express.Response): void => {
    var newArticle = new this.Article(req.body);

    console.log(req);
    newArticle.save((err: Error, article: mongoose.Document) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        res.jsonp(200, article);
      }
    });
  };

  public read = (req: any, res: express.Response): void => {
    res.jsonp(req.article);
  };

  public articleById = (req: any, res: express.Response, next: Function, id: string) => {
    if (!id) {
      return res.status(400).send({
        message: "Article is invalid"
      });
    }
    this.Article.findById(id).exec((err: Error, article: mongoose.Document) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        req.article = article;
        next();
      }
    });
  };
}
