// be sure to require socket.io
const express = require("express");
const app = express();
const socket = require('socket.io')
const cors = require("cors");

const router = require('./server3-router')

app.use(express());
app.use(cors());
app.use(router);

const port = process.env.SERVER_PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server Up and running on port: ${port}`);
});

// after we start listening to our server, we can set up and attach our socket.io server
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});
// in a separate file we'll get more specific about the events we want our socket server to listen for and broadcast
require('./server4-socket')(io)