const color = require("colors");
const { get_Current_User, user_Disconnect, join_User } = require("./users");
const {listUsersinRoom} = require('./roomfunctions')

var clients = [];

module.exports = (io) => {  
  io.on('connection', socket => {
    clients.push(socket); 
    socket.on("ping", (count) => {
      //console.log(count);
    });
    console.info('connected socket: ', socket.id)

    socket.on('disconnect', (reason) => {
      console.info('disconnect')
      console.info(reason)
    });

    socket.on("joinWhiteboardRoom", ({ name, email, room }) => {
    
      //* create user
      if(room == 'undefined' || room === '') return
      const p_user = join_User(socket.id, name, email, room);
      
      console.log(`User (${p_user.name}) is online`.brightYellow)
      console.log(`User (${p_user.email}) is online`.brightYellow)
      console.log(`socket.id is: ${socket.id}`.brightRed);
      
      console.log(`User (${p_user.name}) is joined to (${p_user.room})`.brightBlue)
      
      //join user to room
      socket.join(p_user.room);
      
      //display a welcome message to the user who have joined a room
      const message = {
        userId: p_user.id,
        name: p_user.name,
        email: p_user.email,
        text: `Welcome ${p_user.name} in ${p_user.room} room!`,
        socketid: socket.id,
      }
      //display a welcome message to the user who have joined a room
      socket.emit("welcome-message", message );

      //display a notification message to all other users in the room
      message.text = `${p_user.name} connected to ${p_user.room} room!`
      socket.broadcast.to(p_user.room).emit("connection-message", message );
      
      
      socket.on('onPathCreated', data => {
        socket.broadcast.to(data.room).emit('new-path', data);
        console.log('onPathCreated: ', data.name)
      })

      socket.on('onObjectAdded', data => {
        socket.broadcast.to(data.room).emit('new-add', data);
        console.log('onObjectAdded: ', data.name)
      })
   
      socket.on('onObjectModified', data => {
         socket.broadcast.to(data.room).emit('new-modification', data);
         console.log('onObjectModified: ', data.name, data.id)
      })

      socket.on('onObjectRemoved', data => {
         socket.broadcast.to(data.room).emit('new-remove', data);
         console.log('onObjectRemoved: ', data.name)
      })

      socket.on('onJSONSended', data => {
        socket.broadcast.to(data.room).emit('json-send', data);
        console.log('onJSONSended: ', data.name)
     })
      //Grab any events and emit action
      
      socket.on('leave-WhiteboardRoom', data => {
        //console.log(socket.id)
        //console.log(data)
        const p_user = get_Current_User(data);
        //console.log(`user (${p_user.name}) disconnecting`);
        //clients.splice(clients.indexOf(socket), 1);
        if (p_user) {
          socket.broadcast.to(p_user.room).emit("leave-room-message", {
            userId: p_user.id,
            name: p_user.name,
            text: `${p_user.name} has left the room`,
            room: p_user.room,
          });
//console.log(`${p_user.name} has left the room`);
          user_Disconnect(data)
        }
        
      });
      /* socket.onAny((eventName, ...args) => {
        if (eventName === 'ping') return
        console.log('onAny: ', eventName, JSON.stringify(args))
        const message = `${name} did a(n) ${eventName}`
        socket.to(p_user.room).emit("action-message", message );
      }); */
   })
   socket.onAny((eventName, ...args) => {
    if (eventName === 'ping') return
    //console.log('onAny: ', eventName)//JSON.stringify(args))
    // const message = `${name} did a(n) ${eventName}`
   // socket.to(args.room).emit("action-message", args.text );
  });
})}