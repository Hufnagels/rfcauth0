const users = [];

const addUser = ({ id, name, email, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  
  const existingUser = users.find((user) => user.room === room && user.name === name && user.email === email);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, email, room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const filterUserAndRoom = (id, username, email, roomname) => {
  return users = users.filter(function( obj ) {
    
    //return (obj.username !== username) && (obj.roomname !== roomname || obj.roomname == 'undefined');
    //return (obj.roomname !== 'undefined' || !((obj.username == username) && (obj.roomname == roomname) && (obj.email == email)));
    return !(obj.username === username && obj.email === email && obj.roomname === roomname)
  });
};
console.log('Users:', users)
module.exports = { addUser, removeUser, getUser, getUsersInRoom };


/* let c_users = [];

function join_User(id, username, email, roomname) {
  const p_user = { id, username, email, roomname};
  
  filterUserAndRoom(id, username, email, roomname)
  c_users.push(p_user);
  console.log('users: ', c_users)
  return p_user;
}

console.log("user out: ", c_users);

function filterUserAndRoom(id, username, email, roomname) {
  return c_users = c_users.filter(function( obj ) {
    
    //return (obj.username !== username) && (obj.roomname !== roomname || obj.roomname == 'undefined');
    //return (obj.roomname !== 'undefined' || !((obj.username == username) && (obj.roomname == roomname) && (obj.email == email)));
    return !(obj.username === username && obj.email === email && obj.roomname === roomname)
  });
};

function get_Current_User(id) {
  return c_users.find((p_user) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }

}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
}; */