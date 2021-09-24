const color = require("colors");
const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");
const {listUsersinRoom} = require('./roomfunctions')

var clients = [];

module.exports = (io) => {  
  io.on('connection', socket => {
    clients.push(socket); 
    socket.on("ping", (count) => {
      //console.log(count);
    });
    socket.on("joinWhiteboardRoom", ({ username, email, roomname }) => {
    
      //* create user
      const p_user = join_User(socket.id, username, email, roomname);
      
      console.log(`User (${p_user.username}) is online`.brightYellow)
      console.log(`User (${p_user.email}) is online`.brightYellow)
      console.log(`socket.id is: ${socket.id}`.brightRed);
      console.log('clients',clients.id);
      console.log(`User (${p_user.username}) is joined to (${p_user.roomname})`.brightBlue)
      
      //join user to room
      socket.join(p_user.roomname);
      
      //display a welcome message to the user who have joined a room
      const message = {
        userId: p_user.id,
        username: p_user.username,
        text: `Welcome ${p_user.username} in ${p_user.roomname} room!`,
        socketid: socket.id,
      }
      //display a welcome message to the user who have joined a room
      socket.emit("welcome-message", message );

      //display a notification message to all other users in the room
      message.text = `${p_user.username} connected to ${p_user.roomname} room!`
      socket.broadcast.to(p_user.roomname).emit("connection-message", message );
      
      
      socket.on('onPathCreated', data => {
        socket.broadcast.to(data.roomname).emit('new-path', data);
        console.log('onPathCreated: ', data.username)
      })

      socket.on('onObjectAdded', data => {
        socket.broadcast.to(data.roomname).emit('new-add', data);
        console.log('onObjectAdded: ', data.username)
      })
   
      socket.on('onObjectModified', data => {
         socket.broadcast.to(data.roomname).emit('new-modification', data);
         console.log('onObjectModified: ', data.username, data.id)
      })

      socket.on('onObjectRemoved', data => {
         socket.broadcast.to(data.roomname).emit('new-remove', data);
         console.log('onObjectRemoved: ', data.username, data.obj.id)
      })
      //Grab any events and emit action
      socket.onAny((eventName, ...args) => {
        console.log('onAny: ', eventName, ...args)
      });
   })

   socket.on('disconnect', () => {
      //console.log(socket)
      const p_user = user_Disconnect(socket.id);
      //console.log(`user (${p_user.username}) disconnecting`);
      clients.splice(clients.indexOf(socket), 1);
      if (p_user) {
        socket.broadcast.to(p_user.room).emit("disconnect-message", {
          userId: p_user.id,
          username: p_user.username,
          text: `${p_user.username} has left the room`,
        });
        console.log('user disconnected');
        console.log('clients',clients.id);
      }
      
    });
    
})}