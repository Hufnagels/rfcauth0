import * as React from 'react'
//import { withAuthenticationRequired } from "@auth0/auth0-react";

// Material

// custom
//import RestrictedArea from '../../../components/common/RestrictedArea';
import Wrapper from '../../../components/common/Wrapper';
//import Board6 from '../../../components/admin/board/Board6';
import Board5 from '../../../components/admin/board/Board5';
// import Board4 from '../../../../_temp/_Whiteboard/Board4';
import BoardSocketMessage from '../../../components/admin/board/BoardSocketMessage';

const Whiteboard = () => {
  return (
    <React.Fragment>
      {/* <Wrapper></Wrapper> */}
        <BoardSocketMessage />
        <Board5 />
    </React.Fragment>
  )
}

export default Whiteboard;
// export default withAuthenticationRequired(Whiteboard, {
//   onRedirecting: () => <RestrictedArea />,
// });