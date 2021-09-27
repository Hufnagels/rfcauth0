import * as React from 'react'
import io from "socket.io-client";
import { SOCKET_URL } from "./localhost.config";

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');

export const socket = io.connect(SOCKET_URL, {
  'withCredentials': true,
  'headers': headers,
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': 10,
  'forceNew': true,
});

socket.on('connect', () => {
  console.log('socket connected')
})
// let count = 0;
// setInterval(() => {
//   socket.volatile.emit("ping", ++count);
// }, 1000);
// socket.on('connection-message', (response) => {
//   console.log('connection-message: ', response)
//   setConnection({...connection, username: response.username});
//   setConnection({...connection, socketid: response.socketid});
// })
export const SocketContext = React.createContext(socket);