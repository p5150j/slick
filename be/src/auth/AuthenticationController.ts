/// <reference path="../../typings/tsd.d.ts" />
import passport = require('passport');

import LocalStrategy = require("passport-local");
import BearerStrategy = require("passport-http-bearer");

import express = require("express");
import mongoose = require("mongoose");
import {Strategy} from "passport-local";

"use strict";


export class AuthenticationController {

  private UserModel: mongoose.Model<mongoose.Document>;

  constructor(app: express.Application) {

    this.UserModel = mongoose.model('User');

    app.use(passport.initialize());

    passport.use('local', this.getAuthStrategy());
    passport.use('bearer', <passport.Strategy>this.getAccessTokenStrategy());
  }

  appendRoutes(router: express.Router): AuthenticationController {


    router.post('/login',
      (req, res, next) => {
        passport.authenticate('local', {session: false}, function (err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(400).json(info);
          }
          req.user = user;
          next();
        })(req, res, next);
      },
      function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send(req.user);
      });

    router.post('/logout', (req, res) => {
      req.logout();
    });

    router.post('/users', (req, res) => {
      var newUser = new this.UserModel(req.body);
      newUser.save((err, user) => {
        if (err) {
          res.status(400).send(err);
        }
        res.send(user);
      })
    });
    router.put('/users/:id', (req: express.Request, res) => {
      this.UserModel.findById(req.params.id, (err, user) => {
        if (err) {
          res.status(400).send(err);
        }
        console.log(user);
        user.set(req.body);
        user.save((err, user) => {
          if (err) {
            res.status(400).send(err);
          }
          res.send(user);
        })
      });
    });

    router.get('/users', (req, res) => {
      this.UserModel.find((err, users)=> {
        res.send(users);
      });
    });

    return this;
  }

  protectRoutes(router: express.Router): AuthenticationController {
    //router.use(passport.authenticate('bearer', {session: false}));
    router.use((req, res, next) => {
      passport.authenticate('bearer', {session: false}, function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({message: 'invalid or missing token'});
        }
        next();
      })(req, res, next);
    });
    return this;
  }

  protected getAuthStrategy(): Strategy {

    return new LocalStrategy.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (username, password, done) => {
        this.UserModel.findOne({username: username}, (err, user: any) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {message: 'Incorrect username or password.'});
          }
          user.authenticate(password, (err, valid: boolean) => {
            console.log(valid);
            if (err || !valid) {
              return done(null, false, {message: 'Incorrect username or password.'});
            } else {
              user.token = user._id; //super secret access Token!!
              user.save((err, savedUser) => {
                if (err) {
                  console.log(err);
                }
                return done(null, savedUser);
              });
            }
          });

        });
      });
  }

  protected getAccessTokenStrategy(): BearerStrategy.Strategy {
    return new BearerStrategy.Strategy((token, done) => {
        this.UserModel.findOne({token: token}, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {message: ''});
          }
          return done(null, user, {scope: 'all'});
        });
      }
    );

  }
}
