import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { socket } from '../../../features/context/socketcontext_whiteboard';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ConnectonDecideDialog({agreeToConnect, connected, connectedToRoom}) {
  
  // Alert
  const [openAlert, setOpenAlert] = React.useState(connected);

  const handleCloseAlert = () => {
    setOpenAlert(true);
  };

  // Dialog 
  const [open, setOpen] = React.useState(false);
  const [vertical, setVertical] = React.useState('top')
  const [horizontal, setHorizontal] = React.useState('center')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    agreeToConnect(false)
  };

  const agreeClose = () => {
    setOpen(false);
    agreeToConnect(true)
  };

  React.useEffect(() => {
console.log(socket.connected)
    setOpen(socket.connected) //typeof socket.id == 'undefined' ? false : true);
  },[socket])

  return (
    <div>
      <Snackbar 
        open={!openAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert} 
        anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          App isn't connected to socket server! You can work only locally!
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Connect to Board room?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you want to work in collaborative way, please agree and you connect to whiteboard room.
            If you disagree, you can work privately, but your work isn't shared with collegs.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Stay private</Button>
          <Button onClick={agreeClose} autoFocus>Connect</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
