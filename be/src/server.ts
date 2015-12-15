/// <reference path="../typings/tsd.d.ts" />
import * as express from 'express';

import path = require('path');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import cors = require('cors')
import config = require("./config");
import mongoose = require("mongoose");
import socketio = require('socket.io');
import compression = require('compression');

import {AuthenticationController}  from './auth/AuthenticationController';
import {SocketRoute} from './routes/socket.route';
import {ChatRoute} from "./routes/chat.route";
import {IndexRoute} from "./routes/index";
import {SocketClients} from "./util/socket-clients";
import {SocketController} from "./controllers/socket.controller";
import {ValidationError} from "./models/validation.error";
import {ChatController} from "./controllers/chat.controller";



var feDistFolder = path.resolve(__dirname, '../../fe/dist'); //to easily test deployment version

var app: express.Express = express();

//Models
for (var model of config.globFiles(config.models)) {
  require(path.resolve(model));
}

let apiRouter = express.Router();
let authRouter = express.Router();


var port: number = process.env.PORT || config.port,
  http = require('http').createServer(app),
  io = socketio(http),
  socketClients = new SocketClients(io),

//------------ Initialize controller dependencies ----------
  socketController = new SocketController(socketClients),
  authenticationController = new AuthenticationController(app),
  chatController = new ChatController(socketClients),

// ----------- Initialize routes dependencies -------------
  socketRoutes = new SocketRoute(io, socketController),
  chatRoute = new ChatRoute(chatController),
  indexRoute= new IndexRoute()
  ;

authenticationController
  .appendRoutes(authRouter)
  .protectRoutes(apiRouter); //apply before appending

indexRoute
  .appendRoutes(authRouter); //no authentication

chatRoute
  .appendRoutes(apiRouter);



app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


///---------- routes ------------

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/', express.static(feDistFolder));

// middleware specific to this router
//apiRouter.use((req, res, next) => {
//  console.log(req, res);
//  next();
//});

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: express.Request, res: express.Response, next) => {
  //morgan.error(err);
  err.status == 500 || console.error(err);
  res.status(err.status || 500);
  if (err instanceof ValidationError) {
    console.error('Validation error', err);
    //return res.json(err.message);
    return res.json(err);
  }

  res.json({
    message: err.message,
    error: err //{}
  });
});


// Connect to mongodb
mongoose.connect(config.dbname);

http.listen(port, () => {
  var listeningPort: number = http.address().port;
  console.log('The server is listening on port: ' + listeningPort);
});
