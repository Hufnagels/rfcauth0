import io from "socket.io-client";
import { socketEvents } from "./events";
import { addClientToRoom } from "./emit";

import { SOCKET_URL } from "./localhost.config";

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');


export const socket = io.connect(SOCKET_URL, {
  'withCredentials': true,
  'headers': headers,
  // 'reconnection': true,
  // 'reconnectionDelay': 500,
  // 'reconnectionAttempts': 10,
  // 'forceNew': true,
});

export const initSockets = ({ setValue }) => {
  socketEvents({ setValue });
  // setValue    ^ is passed on to be used by socketEvents
  addClientToRoom()
};