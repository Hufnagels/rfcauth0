import * as React from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react";

// custom
import Wrapper from '../../../components/Wrapper';
import Board4 from '../../../components/Whiteboard/Board4';
import RestrictedArea from '../../../components/RestrictedArea';
//import { SocketContext, socket } from '../../../features/context/socketcontext_whiteboard';
// import { SocketProvider } from '../../../features/context/SocketContext'
import SocketMessage from '../../../components/Whiteboard/SocketMessage';

const Whiteboard = () => {
  return (
      <Wrapper>
        <Board4 />
        <SocketMessage />
      </Wrapper>
  )
  /* return (
    <SocketContext.Provider value={socket}>
      <Wrapper>
        <Board4 />
        <SocketMessage />
      </Wrapper>
    </SocketContext.Provider>
  ) */
  /* return (
    <SocketProvider>
      <Wrapper>
        <Board4 />
        <SocketMessage />
      </Wrapper>
  </SocketProvider>
  ) */
  /* 
  https://alexboots.medium.com/using-react-context-with-socket-io-3b7205c86a6d
  return (
    <SocketProvider>
      <Wrapper>
        <Board4 />
      </Wrapper>
    </SocketProvider>
  ) */
}

// export default Whiteboard;
export default withAuthenticationRequired(Whiteboard, {
  onRedirecting: () => <RestrictedArea />,
});