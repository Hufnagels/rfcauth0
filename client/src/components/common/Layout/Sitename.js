import React from 'react'

import { Typography } from '@mui/material';

const Sitename = () => {
  return (
    <React.Fragment>
      <Typography 
        variant="h6" 
        component="div" 
        sx={{ flexGrow: 1 }}
      >
        {process.env.REACT_APP_WEBSITE_NAME}
      </Typography>
    </React.Fragment>
  )
}

export default Sitename
