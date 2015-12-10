/// <reference path="../../typings/tsd.d.ts" />

import {IUser} from "./user.model";
"use strict";

import mongoose = require("mongoose");
import {Schema} from "mongoose";
import {ROOM_TYPES} from '../shared/api-models'

var SchemaName = 'Room';


export interface IRoom extends mongoose.Document {
  name: string;
  desc: string;
  users: string[];
  type: ROOM_TYPES
  ts: Date
}


export var RoomSchema: mongoose.Schema = new mongoose.Schema({
  users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
  name: {type: String, required: true},
  desc: {type: String},
  type: {type: String, enum: [ROOM_TYPES.IM, ROOM_TYPES.GIM], uppercase: true, required: true}, //im, group im
  ts: {type: Date, default: Date.now, required: true}
});

RoomSchema.index({users: 1}); //

export var RoomRepository = mongoose.model<IRoom>(SchemaName, RoomSchema);
