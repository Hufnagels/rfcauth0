
function findRooms() {
  var availableRooms = [];
  var rooms = io.sockets.adapter.rooms;
  if (rooms) {
      for (var room in rooms) {
          if (!rooms[room].hasOwnProperty(room)) {
              availableRooms.push(room);
          }
      }
  }
  return availableRooms;
}

function avaliableRooms() {
  return Object.keys(socket.adapter.rooms)[1];
}

function lisUsersInRoom(room){
  return io.sockets.clients(room)
}

module.exports = {
  findRooms,
  avaliableRooms,
  lisUsersInRoom,
};