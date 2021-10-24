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

const Login = () => {
  return (
    <React.Fragment>
       <Card>
            <CardHeader 
              title={'Login'}
              subheader={new Date(Date.now()).toDateString()}
            />
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </React.Fragment>
  )
}

export default Login
