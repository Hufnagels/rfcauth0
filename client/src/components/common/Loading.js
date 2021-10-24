import * as React from 'react';

// Material
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Backdrop
        sx={{  
          color: (theme) => theme.palette.secondary.light, 
          background: (theme) => theme.palette.common.backdrop,
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
        open={true}
        onClick={handleClose}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </React.Fragment>
  );
}

export default Loading;