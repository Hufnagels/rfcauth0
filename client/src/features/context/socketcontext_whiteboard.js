import * as React from 'react'
import io from "socket.io-client";
import { SOCKET_URL } from "./localhost.config";

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'https://rfcauth0.netlify.app/') //`http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');
// export const socket = {};
 
export const socket = io.connect(SOCKET_URL, {
  'withCredentials': true,
  'headers': headers,
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': 50,
  'forceNew': true,
});

socket.on('connect', () => {
  console.log('socket connected');
})

socket.on('disconnect', () => {
  console.log('socket disconnected');
})

export const SocketContext = React.createContext(socket);