import React from 'react'

// Material
import {
  Checkbox,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Avatar,
} from '@mui/material'
// custom

const dataset = [
  {
    alttext: 'Collaborative Whiteboard',
    typotext: 'Add, remove, edit, pan, zoom, freehand draw, load, save',
    isfinished: true,
  },
  {
    alttext: 'Decision Tree',
    typotext: 'Add, remove, edit, pan, zoom, load, save',
    isfinished: true,
  },
  {
    alttext: 'D3.js Charts',
    typotext: 'Simple Bar chart. Rigidline and R function are coming....',
    isfinished: false,
  },
  {
    alttext: 'Blog Post list',
    typotext: 'Simple blog post list....',
    isfinished: true,
  },
]
function stringAvatar(name) {
  return {
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
const Listelement = ({data,i}) => {
  const {alttext, typotext, isfinished} = data
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start" key={i}
              secondaryAction={
                <Checkbox
                  edge="end"
                  checked={isfinished ? true : false}
                />
              }
              disablePadding
            >
              <ListItemAvatar><Avatar alt={alttext} {...stringAvatar(alttext)} /></ListItemAvatar>
              <ListItemText
                primary={alttext}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Admin
                    </Typography>
                    {" — "}
                    <Typography variant="body" component="div">
                      {typotext}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
    </React.Fragment>
    
  )
}

const Home = props => {

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h3" color="text.secondary" gutterBottom>Home 2</Typography>
          <Typography variant="h5" component="div">Concept site </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">Includes some interresting features</Typography>
          <Typography variant="body2"></Typography>
          <List sx={{ width: '100%',  bgcolor: 'background.paper' }}>
            {
              dataset.map((data, i)=> { 
                return (<Listelement data={data} key={i} />)
              })
            }
          </List>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </React.Fragment>
  )
}

export default Home
