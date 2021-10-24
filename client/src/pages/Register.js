import React from 'react'

// Material
import { 
  Grid,
  Card,
  CardHeader,
  CardActions,
  Button,
  CircularProgress 
} from '@mui/material';

const Register = () => {
  return (
    <React.Fragment>
       <Card>
            <CardHeader 
              title={'Register'}
              subheader={new Date(Date.now()).toDateString()}
            />
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </React.Fragment>
  )
}

export default Register
