import * as React from 'react';
import {
  Outlet,
} from 'react-router-dom';

// Material
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const eh = '18px';

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
      sx={{
        minHeight: `calc(100vh - ${eh})`, 
        marginTop:`${margin*8}px`, 
        paddingLeft:'8px !important', 
        paddingRight:'8px !important'
      }}
    >
      <Box 
        sx={{ my: margin || 0 }} md={{ my: margin || 0 }} 
      >
        <Outlet />
      </Box>
    </Container>
  )
}

export default ContentWrapper;
