import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConnectonAlertDialog({agreeToConnect}) {
  const [open, setOpen] = React.useState(true);

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
    setOpen(true);
  },[])

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
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
