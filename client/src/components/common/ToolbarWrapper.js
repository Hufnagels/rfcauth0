import React from 'react';

// Material
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const ToolBarWrapper = styled('div')(({ theme }) => ({
  position:'absolute',
  top:0,
  right:0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 0,
  zIndex:'110',
  backgroundColor: theme.palette.secondary.main,
}));

const ToolbarWrapper = ({children}) => {
  const theme = useTheme();
  return (
    <ToolBarWrapper>
      <Paper elevation={3}>
        <Box sx={{ 
          height: 'auto',
          transform: 'translateZ(0px)',
          flexGrow: 1,
          position:'relative',
          width:'50px',
          display:'flex',
          flexDirection:'column'
        }}>
          {children}
        </Box>
      </Paper>
    </ToolBarWrapper>
  );
}

export default ToolbarWrapper;