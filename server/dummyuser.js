let c_users = [];

function join_User(id, username, roomname) {
  const p_user = { id, username, roomname};
  filterUserAndRoom(username,roomname)
  c_users.push(p_user);
  console.log('users: ', c_users)
  return p_user;
}

console.log("user out: ", c_users);

function filterUserAndRoom(username,roomname) {
  return c_users = c_users.filter(function( obj ) {
    //return (obj.username !== username) && (obj.roomname !== roomname || obj.roomname == 'undefined');
    return (obj.roomname !== 'undefined' || !(obj.username == username) && (obj.roomname == roomname));
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
};