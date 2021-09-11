const express = require("express");
const app = express();
const socket = require('socket.io')
const cors = require("cors");
const color = require("colors");
const port = process.env.SERVER_PORT || 4000;


app.use(express());
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server Up and running on port: ${port}`.brightRed);
});

io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

io.on('connection', (socket) => {
  console.log('User online')
  socket.on('canvas-data', (data) => {
    console.log('canvas-data', data)
    socket.broadcast.emit('canvas-data', data)
  })
})