/// <reference path="../../typings/tsd.d.ts" />

import {IUser} from "./user.model";
"use strict";

import mongoose = require("mongoose");
import {Schema} from "mongoose";

var SchemaName = 'Message';

export interface IMessage extends mongoose.Document {
  text: string;
  user: string;
  room: string;
  ts: Date
}

export var MessageSchema : mongoose.Schema  = new mongoose.Schema({
  user : { type: Schema.Types.ObjectId, ref: 'User' , required: true},
  room : { type: Schema.Types.ObjectId, ref: 'Room' , required: true},
  text: { type: String  },
  ts: { type: Date, default: Date.now, required: true }
});

MessageSchema.index({ ts: 1, room: 1 }); //

export var MessageRepository = mongoose.model<IMessage>(SchemaName, MessageSchema);
