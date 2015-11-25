"use strict";
/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");
import ArticleController = require("../controllers/article.controller");

class ArticleRoute {

  private controller: ArticleController;

  constructor(app : express.Express) {
    this.controller = new ArticleController(); //@TODO: inject
    this.generateRoutes(app);
  }

  public generateRoutes (app : express.Express) : void {

    app.route("/api/articles")
        .get(this.controller.list)
        .post(this.controller.create);

    app.route("/api/articles/:id")
        .get(this.controller.read);

    app.param("id", this.controller.articleById);

  }
}

module.exports = ArticleRoute;
