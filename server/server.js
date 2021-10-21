// be sure to require socket.io
const express = require("express");
const app = express();
const socket = require('socket.io')
const cors = require("cors");

require('dotenv').config({ path: require('find-config')('.env') })
const router = require('./components/router')

app.use(express());
app.use(cors());
app.use(router);

const port = process.env.PORT || 6000;
const server = app.listen(port, () => {
  console.log(`Server Up and running on port: ${port}`);
});

// after we start listening to our server, we can set up and attach our socket.io server
// local dev
/*
const io = socket(server, {
   cors: {
    //origin: process.env.ORIGIN || 'http://localhost',
    origin: '*',//['http://localhost:3000', 'http://localhost:5000','https://rfcauth0.netlify.app'],
    methods: ["GET", "POST", "PUT"],
    transports: ['websocket', 'polling'],
    credentials: true
  }, 
  allowEIO3: true
});
*/

// production
const io = socket(server, {
  cors: { 
    origin:[ 'https://rfcauth0.netlify.app', 'http://localhost:3000'], 
    credentials: true
  },
});

// in a separate file we'll get more specific about the events we want our socket server to listen for and broadcast
require('./components/socket')(io);