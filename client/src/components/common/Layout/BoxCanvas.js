import React from 'react'

import { styled } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';

const BCanvas = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: '100%',
    minWidth:'100%',
    height:'calc(100vh - 20px)',
    flexShrink: 0,
    boxSizing: 'border-box',
    display:'flex',
    position: 'relative', 
    zIndex:'100',
    overflow:'hidden', 
  }),
);

const BoxCanvas = ({children}) => {
  return (
    <BCanvas>
      {children}
    </BCanvas>
  )
}

export default BoxCanvas
