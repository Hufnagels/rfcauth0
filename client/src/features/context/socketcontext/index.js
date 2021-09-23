import React, { useState, useEffect } from "react";
import SocketContext from "./context";
import { initSockets } from "../../sockets";

const SocketProvider = (props) => {
  const [value, setValue] = useState({
    queueLength: 0,
    positionInLine: 0,
    socketid:'',
  });
useEffect(() => initSockets({ setValue }), [initSockets]);
// Note, we are passing setValue ^ to initSockets
return(
    <SocketContext.Provider value={ value }>
      { props.children }
    </SocketContext.Provider>
  )
};
export default SocketProvider;