import { socket } from './index';

export const socketEvents = ({ setValue }) => {
  socket.on('connect', () => {
    console.log('socket connected')
    setValue(state => { return { ...state, socketid:socket.id } });
  })
  
  socket.on('connection-message', (message) => {
    console.log('connection-message',message)
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
  })
};