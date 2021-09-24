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
  CardActionArea, 
  CardActions
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';

const PostListItem = (props) => {

  const cardWidth = (text) => {
    return text.length > 20 ? '4' : '2';
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Paper elevation={2} >
        <Card  key={`post-${props.data.id}`}>
          <CardActionArea>
            {props.data.image ?
              <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              />
              :
              <Skeleton variant="rectangular" width='100%' height={180} />
            }
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" style={{minHeight:'130px',}}>{props.data.title}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap /* style={{minHeight:'100px',}} */>{props.data.body}</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <NavLink end to={`/posts/${props.data.id}`} key={`routeLink-${props.data.id}}`}>
                <ListItem button key={`routeListItem-${props.data.id}}`} size="small">
                  <Typography variant="span" >More...</Typography>
                </ListItem>
              </NavLink>
            <Button size="small" color="primary">
              Share
            </Button>
          </CardActions>
        </Card>
      </Paper>
    </Grid>
  );
}

export default PostListItem;