import * as React from 'react';

//Material
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//custom
import AuthenticationButton from '../Auth/Authenticationbutton';


export default function Navigation() {

  return (
    <React.Fragment>
    
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>ReactChatMindmap</Typography>
            <AuthenticationButton />
          </Toolbar>
        </AppBar>
      </Box>
    </React.Fragment>
  );
}