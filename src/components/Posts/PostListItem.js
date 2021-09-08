import React from 'react'

// Material
import {
  Paper,
  Grid,
  Button,
} from '@mui/material';



const PostListItem = (props) => {
  return (
    <Grid item xs={3}>
      <Paper elevation={2} >
        <div key={props.data.id}>
          <h3>{props.data.title}</h3>
          <p>{props.data.body}</p>
          <Button color="inherit">More...</Button>
        </div>
      </Paper>
    </Grid>
  );
}
export default PostListItem;