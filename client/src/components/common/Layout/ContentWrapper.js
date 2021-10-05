import * as React from 'react';
import {
  Outlet,
} from 'react-router-dom';

// Material
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const eh = '120px';

const ContentWrapper = ({margin}) => {
  React.useEffect(() => {
    const setResponsiveness = () => {
      return eh
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);
  
  return (
    <Container 
      maxWidth={false} 
      style={{minHeight: `calc(100vh - ${eh})`, marginTop:'8px', paddingLeft:'16px !important', paddingRight:'16px !important'}}
    >
      <Box 
        sx={{ my: margin || 0 }} md={{ my: margin || 0 }} m={0}
      >
        <Outlet />
      </Box>
    </Container>
  )
}

export default ContentWrapper;
