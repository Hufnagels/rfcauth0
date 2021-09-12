import React, { useState } from 'react';

// Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MuiBox from '@mui/material/Box';

// custom
import Map from './Map';
import MapToolbar from './MapToolbar';
import Wrapper from '../../../components/Wrapper';



const Mindmap = () => {

  return (
    <Wrapper>
      <MapToolbar />
      <Map />
    </Wrapper>
    
    
  );
}

export default Mindmap;