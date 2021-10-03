import * as React from 'react';
import { useDispatch } from 'react-redux';

// Material
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
// Custom
import { socket } from '../../../features/context/socketcontext_whiteboard'
import { 
  adduser,
  removeuser,
} from '../../../redux/reducers/whiteboardSlice';

export default function BoardSocketMessage() {
  //const socket = useSocket();
  const dispatch = useDispatch();
  const [isConnected, setConnected] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  const [actiontype, setActiontype] = React.useState('success')
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

    return () => {
      setConnected(false);
    }
  },[])

  React.useEffect(()=> {

    if(isConnected){
      socket.on('welcome-message', (response) => {
        setActiontype('success')
        setOpen(true);
console.log('welcome-message: ', response)
        //setMessage({...message, message: response.username});
        setMessage(response.text);
        //delete response.text;
        dispatch(adduser(response))
      })
      socket.on('connection-message', (response) => {
        setActiontype('info')
        setOpen(true);
console.log('connection-message: ', response)
        //setMessage({...message, message: response.username});
        
        setMessage(response.text);
        //delete response.text;
        dispatch(adduser(response))
      })
      socket.on('action-message', (response) => {
        setActiontype('info')
        setOpen(true);
  //console.log('action-message: ', JSON.stringify(response))
        //setMessage({...message, message: response.username});
        setMessage(JSON.stringify(response));
      })
      socket.on('leave-room-message', (response) => {
        setActiontype('warning')
        setOpen(true);
  //console.log('leave-room-message: ', response)
        setMessage(response.text);
        dispatch(removeuser(response.userId))
      })
    }
  },[isConnected])

  

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        /*message={message}
         action={action} */
      >
        <Alert onClose={handleClose} severity={actiontype} sx={{ width: '100%' }}>{message}</Alert>
      </Snackbar>
    </div>
  );
}

