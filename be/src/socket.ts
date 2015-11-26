"use strict";
/// <reference path='../typings/tsd.d.ts' />
interface SocketData{
  userName: string;
}

export class SocketHandler {

  constructor(private io: SocketIO.Server) {

      this.activate();
  }


  public activate() : void {

    // usernames which are currently connected to the chat
    let usernames = {};
    let numUsers = 0;
    let data: { [key: string]: SocketData; } = { };

    this.io.on('connection', (socket: any )=> {

        console.log('a user connected');

      // Chatroom
        var addedUser = false;

        // when the client emits 'new message', this listens and executes
        socket.on('new message', function (data) {
          // we tell the client to execute 'new message'
          socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
          });
        });

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (username:string) {
          //data[socket.id] = {
          //  userName: username
          //};
            console.log('add user');

          // we store the username in the socket session for this client
          socket.username = username;
          // add the client's username to the global list
          usernames[username] = username;
          ++numUsers;
          addedUser = true;
          socket.emit('login', {
            numUsers: numUsers
          });
          // echo globally (all clients) that a person has connected
          socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
          });
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
          socket.broadcast.emit('typing', {
            username: socket.username
          });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
          socket.broadcast.emit('stop typing', {
            username: socket.username
          });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
          // remove the username from global usernames list
          if (addedUser) {
            delete usernames[socket.username];
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
              username: socket.username,
              numUsers: numUsers
            });
          }
        });

    });
  }
}
