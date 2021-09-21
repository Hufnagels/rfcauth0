import * as React from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react";

// custom
import Wrapper from '../../../components/Wrapper';
//import WBToolbar from './WBToolbar';
import Board4 from './Board4';
import RestrictedArea from '../../../components/RestrictedArea';
import {SocketContext, socket} from '../../../features/context/socketcontext';

const Whiteboard = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Wrapper>
        {/* <WBToolbar /> */}
        <Board4 />
      </Wrapper>
    </SocketContext.Provider>
  )
}

// export default Whiteboard;
export default withAuthenticationRequired(Whiteboard, {
  onRedirecting: () => <RestrictedArea />,
});