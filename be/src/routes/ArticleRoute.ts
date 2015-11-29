"use strict";
/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");
import {ArticleController} from "../controllers/article.controller";

export class ArticleRoute {

  private controller: ArticleController;

  constructor() {
    this.controller = new ArticleController(); //@TODO: inject
  }

  public appendRoutes(router: express.Router): void {

    router.route("/articles")
      .get(this.controller.list)
      .post(this.controller.create);

    router.route("/articles/:id")
      .get(this.controller.read);

    router.param("id", this.controller.articleById);

  }
}
