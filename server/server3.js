const express = require("express");
const app = express();
const socket = require('socket.io')
const cors = require("cors");
const color = require("colors");

const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");
const router = require('./server3-router')
const port = process.env.SERVER_PORT || 4000;

app.use(express());
app.use(cors());
app.use(router);

const server = app.listen(port, () => {
  console.log(`Server Up and running on port: ${port}`.brightMagenta);
});

io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});

io.on('connection', (socket) => {
  
  socket.on("joinRoom", ({ username, email, roomname }) => {
    
    //* create user
    const p_user = join_User(socket.id, username, email, roomname);
    
    console.log(`User (${p_user.username}) is online`.brightYellow)
    console.log(`User (${p_user.email}) is online`.brightYellow)
    console.log(`socket.id is: ${socket.id}`.brightRed);
    socket.join(p_user.roomname);
    console.log(`User (${p_user.username}) is joined to (${p_user.roomname})`.brightBlue)
    
    //display a welcome message to the user who have joined a room
    socket.emit("connection-message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username} in ${p_user.roomname} room!`,
      socketid: socket.id,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("connection-message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
    
    socket.on('onObjectAdded', (data) => {
      console.log('onObjectAdded-canvas-data: ', data)
      socket.to(data.roomname).emit('onObjectAdded', data);
      //console.clear()
    });
    socket.on('onObjectModified', (data) => {
      console.log('onObjectModified-canvas-data: ', data.owner)
      socket.broadcast.emit('onObjectModified', data)
      //console.clear()
    });
    socket.on('onObjectRemoved', (data) => {
      console.log('onObjectRemoved-canvas-data: ', data)
      socket.broadcast.emit('onObjectRemoved', data)
      //console.clear()
    });
    socket.on('onPathCreated', (data) => {
      console.log('onPathCreated-canvas-data: ', data)
      socket.broadcast.emit('onPathCreated', data)
      //console.clear()
    });
  });

  socket.on('join', ({username, roomname}) => {
    console.log(user, room)
  })

  socket.on('canvas-data', (data) => {
    console.log('canvas-data: ', data.length)
    socket.broadcast.emit('canvas-data', data)
    //console.clear()
  });
  

  socket.on('disconnect', () => {
    //console.log(socket)
    const p_user = user_Disconnect(socket.id);
    //console.log(`user (${p_user.username}) disconnecting`);
    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
      console.log('user disconnected');
    }
    
  });
})