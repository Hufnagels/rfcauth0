import React from 'react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

// Material
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const RestrictedArea = () => {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Backdrop
        sx={{  
          color: (theme) => theme.palette.secondary.light, 
          background: (theme) => theme.palette.common.backdrop,
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
        open={true}
        onClick={handleClose}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              Restricted area
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Backdrop>
    </React.Fragment>
  );
}

export default RestrictedArea;
