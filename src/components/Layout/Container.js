import * as React from 'react';
import {
  Outlet,
} from 'react-router-dom';

// Material
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


const Layout = (props) => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ my: props.margin || 0 }}>
        <Outlet />
      </Box>
    </Container>
  )
}

export default Layout;
