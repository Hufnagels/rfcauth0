const color = require("colors");
//const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users2');

// const {listUsersinRoom} = require('./roomfunctions')
// var clients = [];

module.exports = (io) => {  
  io.on('connect', socket => {
    console.info('connected socket: ', socket.id)

    socket.on('disconnect', (reason) => {
      console.info('disconnect', reason)

      const user = removeUser(socket.id);

      if(user) {
        io.to(user.room).emit('leave-room-message', { 
          sender: 'admin',
          userId: user.id,
          name: user.name,
          text: `${user.name} has left the room`,
          room: user.room,
        });
        io.to(user.room).emit('roomData', { 
          room: user.room, 
          users: getUsersInRoom(user.room)
        });
      }
    });

    socket.on("joinWhiteboardRoom", ({ name, email, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, email, room });
      
      if(error) return callback(error);

      socket.join(user.room);
console.log('Joined user: ', user)
      const message = {
        sender: 'admin',
        userId: user.id,
        name: user.name,
        email: user.email,
        socketid: socket.id,
      }

      message.text = `${user.name}, welcome to room ${user.room}.`
      socket.emit('welcome-message', message);
      
      message.text = `${user.name} has joined!`
      socket.broadcast.to(user.room).emit('connection-message', message);
  
      io.to(user.room).emit('roomData', { 
        room: user.room, 
        users: getUsersInRoom(user.room) 
      });
      
      // Console for testing
console.log(`User (${user.name}) is online`.brightYellow)
console.log(`User (${user.email}) is online`.brightYellow)
console.log(`socket.id is: ${socket.id}`.brightRed);
console.log(`User (${user.name}) is joined to (${user.room})`.brightBlue)
      
      // Whiteboard specific channels
      socket.on('onPathCreated', data => {
        socket.broadcast.to(data.room).emit('new-path', data);
        console.log('onPathCreated: ', data.room)
      })

      socket.on('onObjectAdded', data => {
        socket.broadcast.to(data.room).emit('new-add', data);
console.log('onObjectAdded: ', data.room)
      })
   
      socket.on('onObjectModified', data => {
         socket.broadcast.to(data.room).emit('new-modification', data);
         console.log('onObjectModified: ', data.name, data.id)
      })

      socket.on('onObjectRemoved', data => {
         socket.broadcast.to(data.room).emit('new-remove', data);
         console.log('onObjectRemoved: ', data.name, data.obj.id)
      })
      //Grab any events and emit action
      
      socket.on('leave-WhiteboardRoom', data => {
        const user = removeUser(data);

        if(user) {
          io.to(user.room).emit('leave-room-message', { 
            sender: 'admin',
            userId: user.id,
            name: user.name,
            text: `${user.name} has left the room`,
            room: user.room,
          });
          io.to(user.room).emit('roomData', { 
            room: user.room, 
            users: getUsersInRoom(user.room)
          });
        }
        
      });
      
      callback();
   })

  // socket.onAny((eventName, ...args) => {
  //   if (eventName === 'ping') return
  //   console.log('onAny: ', eventName, JSON.stringify(args))
  //   // const message = `${name} did a(n) ${eventName}`
  //  // socket.to(args.room).emit("action-message", args.text );
  // });
  })
}