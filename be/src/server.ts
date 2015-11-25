/// <reference path="../typings/tsd.d.ts" />
import express = require('express');
import path = require('path');

var app : express.Express = express();

app.get('/', (req, res) => {
    res.send('hello');
});

/*
app.get('/api/coolresource', (req, res) => {
    res.send({
        "isApiWorking": true
    });
});
*/

var port: number = process.env.PORT || 3002;
var server = app.listen(port, () => {
    var listeningPort: number = server.address().port;
    console.log('The server is listening on port: ' + listeningPort);
});
