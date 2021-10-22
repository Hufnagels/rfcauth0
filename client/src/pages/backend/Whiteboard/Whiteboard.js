import * as React from 'react'
//import { withAuthenticationRequired } from "@auth0/auth0-react";

// Material

// custom
//import RestrictedArea from '../../../components/common/RestrictedArea';
import Wrapper from '../../../components/common/Wrapper';
import Board6 from '../../../components/backend/Board/Board6';
//import Board5 from '../../../components/admin/board/Board5';
// import Board4 from '../../../../_temp/_Whiteboard/Board4';
import BoardSocketMessage from '../../../components/backend/Board/BoardSocketMessage';

const WhiteboardPage = () => {
  return (
    <React.Fragment>
      {/* <Wrapper></Wrapper> */}
        <BoardSocketMessage />
        <Board6 />
    </React.Fragment>
  )
}

export default WhiteboardPage;
// export default withAuthenticationRequired(Whiteboard, {
//   onRedirecting: () => <RestrictedArea />,
// });