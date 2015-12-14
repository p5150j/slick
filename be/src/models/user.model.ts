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

UserSchema.path('username').validate(function (value) {
  return (value.length > 2);
}, 'Username too short');


// Intercept save to hash password, profile info
UserSchema.pre('save', function (next) {
  var user = this;

  // Ignore if password unaltered
  if (!user.isModified('password')){ return next();}

  // Generate salt
  bcrypt.genSalt(salt_factor, function (err, salt) {
    if (err) {return next(err);}

    // Hash provided password
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return next(err);}

      // Update password
      user.password = hash;
      next();
    })
  })
});

/*
 * Methods
 */

// Provide method to validate password
let methods : any = UserSchema['methods'];
methods.authenticate = function (pass, next) {
  // Compare via bcrypt
  bcrypt.compare(pass, this.password, function (err, valid) {
    if (err) {return next(err);}
    next(null, valid)
  })
};


// UserSchema parse
['toJSON', 'toObject'].forEach(function (prop) {
  UserSchema.set(prop, {
    transform: function (doc, ret, options) {
      delete ret.password
    }
  })
});

export var UserRepository = mongoose.model<IUser>(SchemaName, UserSchema);
