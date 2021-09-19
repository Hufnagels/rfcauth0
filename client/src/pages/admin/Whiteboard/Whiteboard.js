import React from 'react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

// custom
import Wrapper from '../../../components/Wrapper';
import WBToolbar from './WBToolbar';
import Board3 from './Board3';
import RestrictedArea from '../../../components/RestrictedArea';

const Whiteboard = () => {
  return (
    <Wrapper>
      {/* <WBToolbar /> */}
      <Board3 />
    </Wrapper>
  )
}

// export default Whiteboard;
export default withAuthenticationRequired(Whiteboard, {
  onRedirecting: () => <RestrictedArea />,
});