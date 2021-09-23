const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");
const color = require("colors");

module.exports = (io) => {  
  io.on('connection', socket => {
   socket.on("joinWhiteboardRoom", ({ username, email, roomname }) => {
    
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

      socket.on('onPathCreated', data => {
        socket.broadcast.to(data.roomname).emit('new-path', data);
        console.log('object added: ', data.obj)
      })

      socket.on('onObjectAdded', data => {
        socket.broadcast.to(data.roomname).emit('new-add', data);
        //console.log('object added: ', data.obj.type)
      })
   
      socket.on('onObjectModified', data => {
         socket.broadcast.to(data.roomname).emit('new-modification', data);
         // console.log('object modified: ', data.obj.type)
      })

      socket.on('onObjectRemoved', data => {
         socket.broadcast.to(data.roomname).emit('new-remove', data);
         console.log('object removed: ', data.obj.id)
      })
   })

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
})}