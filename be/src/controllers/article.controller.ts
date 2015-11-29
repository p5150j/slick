"use strict";
/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");
import mongoose = require("mongoose");


export class ArticleController {

  private Article: mongoose.Model<mongoose.Document>;

  constructor() {
    this.Article = mongoose.model("Article");

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
