/// <reference path="../typings/tsd.d.ts" />
import express = require('express');
import path = require('path');
import logger = require('morgan');
import bodyParser = require('body-parser');
import cors = require('cors')

import config = require("./config");
import mongoose = require("mongoose");

import socketio = require('socket.io');


//import routes = require('./routes/index');
//import users = require('./routes/users');

import {SocketHandler} from './socket';


var app : express.Express = express();

//Models
for (var model of config.globFiles(config.models)) {
    require(path.resolve(model));
}


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


//Routes
for (var route of config.globFiles(config.routes)) {
    let routerController = require(path.resolve(route));
    new routerController(app);
}


//app.get('/', (req, res) => {
//    res.send('hello');
//});

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next: Function) {
    var err: Error = new Error("Not Found yo");
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: express.Request, res: express.Response, next) => {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

//if (app.get("env") === "development") {
    app.use((err: Error, req: express.Request, res: express.Response, next) => {
        res.status(500);
        res.send({
            message: err.message,
            error: err
        });
    });
//}

// Connect to mongodb
mongoose.connect(config.dbname);

var port: number = process.env.PORT || 3002,
    http = require('http').createServer(app),
    io = socketio(http),
    socketHandler = new SocketHandler(io)
    ;


//server.listen(port, () => {
http.listen(port, () => {
    var listeningPort: number = http.address().port;
    console.log('The server is listening on port: ' + listeningPort);
});
