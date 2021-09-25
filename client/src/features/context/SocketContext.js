// https://gist.github.com/johndavedecano/1cf05a7e9e7b42e03cb1174977fc166e
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react'
import io from 'socket.io-client'
import { useAuth0 } from '@auth0/auth0-react';

// Custom
import { SOCKET_URL } from "./localhost.config";

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');


export const SocketContext = createContext()

export const SocketProvider = ({ children, store }) => {
  
  const [isConnected, setConnected] = useState(false)
  const socket = useRef(null)

  //const socketUrl = `${process.env.API_URL}/socket.io`
  
  const { user } = useAuth0();
  const { name, picture, email } = user;

  const [connection, setConnection] = useState({
    username: name,
    roomname: 'whiteboardRoom',
    email:email,
    socket: null, //socket,
    socketid: null, //socket.id,
  });

  const handleOnMessage = message => {
    console.log(message)
    // store.dispatch here
  }

  useEffect(() => {
    if (!isConnected) {
      socket.current = io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        headers: headers,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
        forceNew:true,
        query: {
          roomName: 'whiteboardRoom',
        },
        // query: {
        //   token: localStorage.getItem('auth_token'),
        // },
      })

      socket.current.on('connect', () => {
        console.info(`Successfully connected to socket at ${SOCKET_URL}`)
        setConnected(true)
      })

      // socket.current.on("disconnect", (reason) => {
      //   // if (reason === "io server disconnect") {
      //   //   // the disconnection was initiated by the server, you need to reconnect manually
      //   //   socket.connect();
      //   // }
      //   // else the socket will automatically try to reconnect
      //   console.info(`Successfully disconnected`)
      //   console.info(reason)
      //   setConnected(false)
      // });

      socket.current.on('error', err => {
        console.log('Socket Error:', err.message)
      })

      socket.current.on('message', handleOnMessage)
    }

    // return () => {
    //   if (socket.current && socket.current.connected) {
    //     socket.current.disconnect()
    //   }
    //   socket.current.disconnect()
    // }
  }, [socket.current])

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)