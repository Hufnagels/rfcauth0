import * as React from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react";

// custom
import Wrapper from '../../../components/Wrapper';
import Board4 from '../../../components/Whiteboard/Board4';
import RestrictedArea from '../../../components/RestrictedArea';
import {SocketContext, socket} from '../../../features/context/socketcontext_whiteboard';

//import SocketProvider from '../../../features/context/socketcontext/';

const Whiteboard = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Wrapper>
        <Board4 />
      </Wrapper>
    </SocketContext.Provider>
  )
  /* return (
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