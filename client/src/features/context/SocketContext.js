// https://gist.github.com/johndavedecano/1cf05a7e9e7b42e03cb1174977fc166e
import React, {
  createContext,
  useContext,
  useEffect,
} from 'react'
import io from 'socket.io-client'
//import { useAuth0 } from '@auth0/auth0-react';

// Custom
import { SOCKET_URL } from "./localhost.config";
//import { socket } from './socketcontext_whiteboard';

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');

export const SocketContext = createContext()

export const SocketProvider = ({ children, store }) => {
  const socket = React.useRef(null);
  const [socketData, setSocketData] = React.useState({
    socket:null,
    connected:false
  })

  useEffect(() => {
    socket.current = io.connect(SOCKET_URL, {
      'withCredentials': true,
      'headers': headers,
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionAttempts': 100,
      'forceNew': true,
    });
console.log('socket.current')
console.log(socket.current)
    setSocketData({...socketData, socket:socket.current})
    socket.current.on('connect', () => {
      console.info(`Successfully connected to socket at ${SOCKET_URL}`)
      setSocketData({...socketData, connected:true})
    })
    socket.current.on('disconnect', () => {
      console.info(`Disconnected from socket at ${SOCKET_URL}`)
      setSocketData({...socketData, connected:false})
    })

    return () => {
      socket.current = null;
      setSocketData({
        socket:null,
        connected:false
      })
    }
  })

  /* useEffect(() => {
    socket.current.on('connect', () => {
      console.info(`Successfully connected to socket at ${SOCKET_URL}`)
      setSocketData({...socketData, connected:true})
    })
    socket.current.on('disconnect', () => {
      console.info(`Disconnected from socket at ${SOCKET_URL}`)
      setSocketData({...socketData, connected:false})
    })
  },[socket.current]) */
  
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}

/* 
export const Socket = () => {
  const socket = React.useRef(null);
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.current = io.connect(SOCKET_URL, {
      'withCredentials': true,
      'headers': headers,
      'reconnection': true,
      'reconnectionDelay': 500,
      'reconnectionAttempts': 100,
      'forceNew': true,
    });
console.log('Socket')
console.log(socket)
  },[])

  useEffect(() => {
    socket.current.on('connect', () => {
      console.info(`Successfully connected to socket at ${SOCKET_URL}`)
      setConnected(true)
    })
    socket.current.on('disconnect', () => {
      console.info(`Disconnected from socket at ${SOCKET_URL}`)
      setConnected(false)
    })
  },[socket.current])

  return socket.current
}
 */
/* 
export const SocketProvider = ({ children, store }) => {
  const sref = React.useRef(Socket)
console.log('SocketProvider')
console.log(sref.current)
  return (
    <SocketContext.Provider value={sref.current}>
      {children}
    </SocketContext.Provider>
  )
};
 */
//export const SocketContext = createContext()
/* 
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
 */
export const useSocket = () => useContext(SocketContext)