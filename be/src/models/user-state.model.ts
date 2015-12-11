/// <reference path="../../typings/tsd.d.ts" />

"use strict";

import mongoose = require("mongoose");

var SchemaName = 'User';

var bcrypt = require('bcrypt')
  , salt_factor = 10;

export interface IUser extends mongoose.Document {
  role: string,
  email: string,
  password: string,
  username: string,
  token: string
}


var UserSchema: mongoose.Schema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  email: { type: String, required: true, index: { unique:true } },
  password: { type: String, required: true },
  username: { type: String, required: true },
  token: String
});

export var UserRepository = mongoose.model<IUser>(SchemaName, UserSchema);
