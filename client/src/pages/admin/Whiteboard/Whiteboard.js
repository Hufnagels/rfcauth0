import * as React from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react";

// custom
import RestrictedArea from '../../../components/common/RestrictedArea';
import Wrapper from '../../../components/common/Wrapper';
import Board5 from '../../../components/admin/board/Board5';
import Board4 from '../../../components/admin/Whiteboard/Board4';
import BoardSocketMessage from '../../../components/admin/board/BoardSocketMessage';

const Whiteboard = () => {
  return (
      <Wrapper>
        <BoardSocketMessage />
        <Board5 />
      </Wrapper>
  )
}

export default Whiteboard;
// export default withAuthenticationRequired(Whiteboard, {
//   onRedirecting: () => <RestrictedArea />,
// });