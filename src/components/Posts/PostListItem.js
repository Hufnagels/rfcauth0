import React from 'react'
import { 
  NavLink, 
  Link as RouterLink 
} from "react-router-dom";
// Material
import {
  Typography,
  Paper,
  Grid,
  ListItem,
  Button,
} from '@mui/material';



const PostListItem = (props) => {
  return (
    <Grid item xs={3}>
      <Paper elevation={2} >
        <div key={props.data.id}>
          <h3>{props.data.title}</h3>
          <p>{props.data.body}</p>
          <Button color="inherit"></Button>
          <NavLink end to={`/post/${props.data.id}}`} key={`routeLink-${props.data.title}}`}>
            <ListItem button key={`routeListItem-${props.data.title}}`} >
              <Typography variant="span">More...</Typography>
            </ListItem>
          </NavLink>
        </div>
      </Paper>
    </Grid>
  );
}
export default PostListItem;