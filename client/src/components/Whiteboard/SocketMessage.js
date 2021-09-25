import * as React from 'react';

// Material
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Custom
//import { useSocket } from '../../features/context/SocketContext';
import { socket } from '../../features/context/socketcontext_whiteboard'

export default function SocketMessage() {
  //const socket = useSocket();
  const [isConnected, setConnected] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [snackstate, setSnacktate] = React.useState({
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal } = snackstate;

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  React.useEffect(()=> {
    if(socket && socket.connected) setConnected(true)
  },[socket])

  React.useEffect(()=> {

    if(isConnected){
    socket.on('welcome-message', (response) => {
      setOpen(true);
      console.log('welcome-message: ', response)
      //setMessage({...message, message: response.username});
      setMessage(response.text);
    })
    socket.on('connection-message', (response) => {
      setOpen(true);
      console.log('connection-message: ', response)
      //setMessage({...message, message: response.username});
      setMessage(response.text);
    })
    socket.on('action-message', (response) => {
      setOpen(true);
      console.log('action-message: ', JSON.stringify(response))
      //setMessage({...message, message: response.username});
      setMessage(JSON.stringify(response));
    })
    socket.on('leave-room-message',(response) => {
      setOpen(true);
      console.log('leave-room-message: ', response)
      setMessage(response.username);
    })
  }
  },[isConnected])

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}

