import * as React from 'react';
import {
  Outlet,
} from 'react-router-dom';

// Material
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


const ContentWrapper = ({margin}) => {
  return (
    <Container maxWidth={false} style={{minHeight: '82vh', marginTop:'8px'}}>
      <Box sx={{ my: margin || 0 }} md={{ my: margin || 0 }} m={0}>
        <Outlet />
      </Box>
    </Container>
  )
}

export default ContentWrapper;
