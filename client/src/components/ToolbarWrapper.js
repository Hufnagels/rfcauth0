import React from 'react';

// Material
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const ToolBarWrapper = styled('div')(({ theme }) => ({
  position:'absolute',
  top:10,
  right:10,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 0,
  zIndex:'110',
}));

const ToolbarWrapper = ({children}) => {
  return (
    <ToolBarWrapper>
      <Box sx={{ height: 'auto', transform: 'translateZ(0px)', flexGrow: 1 }}>
        <Paper elevation={3}>
          {children}
        </Paper>
      </Box>
    </ToolBarWrapper>
  );
}

export default ToolbarWrapper;