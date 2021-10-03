import * as React from 'react';
//import { useDispatch } from 'react-redux';

// Material
import Snackbar from '@mui/material/Snackbar';
import { Alert, Stack } from '@mui/material';

export default function BoardActionMessage({actiontype, message}) {
  const [open, setOpen] = React.useState(false);
  const [snackstate, setSnacktate] = React.useState({
    vertical: 'top',
    horizontal: 'center',
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
    if(message && message.length > 0) {
      setOpen(true);
    }
    return () => {
      
    }
  },[message, actiontype])

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert 
            onClose={handleClose} 
            severity={actiontype} 
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Stack>
      </Snackbar>
    </div>
  );
}

