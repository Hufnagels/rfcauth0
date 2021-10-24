import React from 'react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import JSONPretty from 'react-json-pretty';

// Material
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
} from '@mui/material'

// Custom
import RestrictedArea from "../../components/common/RestrictedArea";

const Profile = () => {
  const { user } = useAuth0();
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardContent>
              <JSONPretty data={JSON.stringify(user, null, 2)} />
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
    </React.Fragment>
  )
}

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <RestrictedArea />,
});
