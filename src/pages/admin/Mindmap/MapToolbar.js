import React from 'react';

// Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      //margin: theme.spacing(1),
      //width: theme.spacing(10),
      //height: theme.spacing(16),
    },
  },
}));

const MapToolbarWrapper = styled('div')(({ theme }) => ({
  position:'absolute',
  top:10,
  right:10,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 0,
  
}));

const MapToolbar = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function onAdd(event, action, cb) {
    alert(action);
    console.log(event)
    cb();
  };

  function save(name){
    alert(name)
  }

  function load(name){
    alert(name)
  }

  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy', cb: load },
    { icon: <SaveIcon />, name: 'Save', cb: save },
    { icon: <PrintIcon />, name: 'Print', cb: save },
    { icon: <ShareIcon />, name: 'Share', cb: save },
  ];

  return (
    <MapToolbarWrapper>
      <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', top: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction={'down'}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={event => {action.cb(action.name)}}
            />
          ))}
        </SpeedDial>
      </Box>
    </MapToolbarWrapper>
  );
}

export default MapToolbar;