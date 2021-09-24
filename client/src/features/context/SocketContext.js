import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react'
import io from 'socket.io-client'

// Custom
import { SOCKET_URL } from "./localhost.config";

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');


export const SocketContext = createContext()

export const SocketProvider = ({ children, store }) => {
  
  const [isConnected, setConnected] = useState(false)

  const socketUrl = `${process.env.API_URL}/socket.io`

  const socket = useRef(null)

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
        // query: {
        //   token: localStorage.getItem('auth_token'),
        // },
      })

      socket.current.on('connect', () => {
        console.info(`Successfully connected to socket at ${SOCKET_URL}`)
        setConnected(true)
      })

      socket.current.on('disconnect', () => {
        console.info(`Successfully disconnected`)
        setConnected(false)
      })

      socket.current.on('error', err => {
        console.log('Socket Error:', err.message)
      })

      socket.current.on('message', handleOnMessage)
    }

    return () => {
      if (socket.current && socket.current.connected) {
        socket.current.disconnect()
      }
    }
  }, [socket.current])

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)