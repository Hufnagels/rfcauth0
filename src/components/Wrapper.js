import React, { useState } from 'react';

// Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MuiBox from '@mui/material/Box';

// custom



// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     position: 'relative',
//     padding:0,
//     margin:0,
//     '& > *': {
//       //margin: theme.spacing(1),
//       /*width: theme.spacing(100), 
//       height: theme.spacing(16), */
//     },
//   },
//   mindmap: {
//     display: 'flex',
//     position: 'relative',
//     minHeight: '100vh'//calc(100vh - 82px),
//   },

// }));

// const MapWrapper = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'left',
//   justifyContent: 'flex-end',
//   position: 'relative',
//   padding: theme.spacing(0, 1),
//   minHeight: '90vh',
//   minWidth: '100%',
  
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

const Box = styled(MuiBox, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: '100%',
    height:'calc(100vh - 80px)',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    display:'flex',
    position: 'relative', 
    zIndex:'100',
    /*  backgroundColor: theme.palette.primary.main,*/
    // borderWidth: '1px',
    // borderStyle: 'dashed', 
    // borderColor: theme.palette.primary.main, 
  }),
);

const Wrapper = ({ children }) => {
  // const classes = useStyles();

  return (
    <React.Fragment >
      <Grid 
        container
        direction="row"
      >
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box>
              { children }
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
    </React.Fragment>
    
    
  );
}

export default Wrapper;