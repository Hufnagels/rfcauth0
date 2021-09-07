import React from 'react'

// Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  mindmap_canvas: {
    display: 'flex',
    minHeight: '100%',
    '& > *': {
      position: 'relative',
      /*margin: theme.spacing(0),*/
      
    },
  },
}));


const Map = () => {
  const classes = useStyles();

  return (
      <React.Fragment>
        dsdsd
      </React.Fragment>

  )
}
export default Map;