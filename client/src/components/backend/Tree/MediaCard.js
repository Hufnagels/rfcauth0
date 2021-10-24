import * as React from 'react';

import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@mui/material'

export default function MediaCard({title, subheader}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* <CardHeader 
              title={'Login'}
              subheader={new Date(Date.now()).toDateString()}
            /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
    </Card>
  );
}
