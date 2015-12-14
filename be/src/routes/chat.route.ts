"use strict";
/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");
import {ChatController} from "../controllers/chat.controller";

export class ChatRoute {

  private controller: ChatController;

  constructor() {
    this.controller = new ChatController(); //@TODO: inject
  }

  public appendRoutes(router: express.Router): void {

    router.route("/init")
      .get(this.controller.init);

    router.route("/rooms/im/:toUser")
      .put(this.controller.createIMRoom); //put - there is only 1

    router.route("/rooms/:room_id")
      //.put(this.controller.createRoom)
      .get(this.controller.getRoom);

    router.route("/rooms")
      .get(this.controller.getAll);

    //router.param("id", this.controller.articleById);
    router.param("room_id", this.controller.getRoomParam);

  }
}
