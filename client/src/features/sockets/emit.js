import { socket } from "./";

export const addClientToRoom = () => {
  socket.emit('joinWhiteboardRoom');
};
export const getQueueLength = () => {
  socket.emit('queueLengthToSocket');
};
export const removeUserFromQueue = () => {
  socket.emit('removeUserFromQueue');
};