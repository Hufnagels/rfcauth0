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
  // 'forceNew': true,
});

socket.on('connect', () => {
  console.log('socket connected')
})

// socket.on('connection-message', (response) => {
//   console.log('connection-message: ', response)
//   setConnection({...connection, username: response.username});
//   setConnection({...connection, socketid: response.socketid});
// })
export const SocketContext = React.createContext(socket);

// import { createContext, useState } from 'react';
// import io from "socket.io-client";
// import { SOCKET_URL } from "./localhost.config";

// let headers = new Headers();
// headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
// headers.append('Access-Control-Allow-Credentials', 'true');

// export const SocketContext = createContext();

// export default function SocketContextProvider(props) {
//   const [sock, setSocket] = useState(null);

//   let socket = async () => {
//     if (sock) {
//       return Promise.resolve(sock); // If already exists resolve
//     }
//     return new Promise((resolve, reject) => {
//       let newSock = io(SOCKET_URL, {'withCredentials': true,'headers': headers,})
      
//       let didntConnectTimeout = setTimeout(() => {
//         reject();
//       }, 15000) // Reject if didn't connect within 15 seconds

//       newSock.once('connect', () => {
//         clearTimeout(didntConnectTimeout); // It's connected so we don't need to keep waiting 15 seconds
//         setSocket(newSock); // Set the socket
//         resolve(newSock); // Return the socket
//       })
//     });
//   };

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {props.children}
//     </SocketContext.Provider>
//   );
// }