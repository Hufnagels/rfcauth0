import React from 'react';

// Material
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';

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
      <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
        {children}
      </Box>
    </ToolBarWrapper>
  );
}

export default ToolbarWrapper;