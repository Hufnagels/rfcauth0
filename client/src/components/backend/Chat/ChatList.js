import * as React from 'react';

// Material
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

// Custom
import { 
  daydiff, 
  groupBy3 
} from '../../../features/utils';

const messages = [
  {
    id: 1,
    timestamp:1634465494,
    primary: 'Brunch this week?',
    secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: '/static/images/avatar/5.jpg',
  },
  {
    id: 2,
    timestamp:1634461894,
    primary: 'Birthday Gift',
    secondary: `Do you have a suggestion for a good present for John on his work
      anniversary. I am really confused & would love your thoughts on it.`,
    person: '/static/images/avatar/1.jpg',
  },
  {
    id: 3,
    timestamp:1634375494,
    primary: 'Recipe to try',
    secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
    person: '/static/images/avatar/2.jpg',
  },
  {
    id: 4,
    timestamp:1634371894,
    primary: 'Yes!',
    secondary: 'I have the tickets to the ReactConf for this year.',
    person: '/static/images/avatar/3.jpg',
  },
  {
    id: 5,
    timestamp:1634461894,
    primary: "Doctor's Appointment",
    secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
    person: '/static/images/avatar/4.jpg',
  },
  {
    id: 6,
    timestamp:1634285494,
    primary: 'Discussion',
    secondary: `Menus that are generated by the bottom app bar (such as a bottom
      navigation drawer or overflow menu) open as bottom sheets at a higher elevation
      than the bar.`,
    person: '/static/images/avatar/5.jpg',
  },
  {
    id: 7,
    timestamp:1634026294,
    primary: 'Summer BBQ',
    secondary: `Who wants to have a cookout this weekend? I just got some furniture
      for my backyard and would love to fire up the grill.`,
    person: '/static/images/avatar/1.jpg',
  },
];
const currentTimestamp = Date.now()/1000
messages.forEach((message,i) => {
  message['date'] = daydiff(message.timestamp,currentTimestamp)
})
const obj = groupBy3(messages, 'date')
const newMessagesArray = Object.keys(obj).map((key) => [key, obj[key]])

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export default function ChatList({heightHandler}) {
  const [open, setOpen] = React.useState(true)
  const openHandler = (e) => {
    e.preventDefault()
    let state = !open
    setOpen(state)
    heightHandler(state)
  }

  React.useEffect(()=>{
    console.log(newMessagesArray)
  },[])

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper elevation={3} square sx={{ pb: '52px' , transition:'ease-in-out .5s', height:(open ? '600px': '40px'), }}>
        <Typography variant="h6" gutterBottom component="div" 
          sx={{ 
            p: 2, 
            transition:'ease-in-out 1s', 
            height:'48px', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between'
          }}
        >
          Messages
          <IconButton color="inherit" onClick={((e) => { 
            //console.log('clicked')
            openHandler(e)
            })}>
            <CloseFullscreenIcon />
          </IconButton>
        </Typography>
        
        <Box sx={{ pb: 10 , height:(open ? '560px': '0px'), transition:'ease-in-out .5s', overflowY:'scroll'}}>
          <List sx={{ pb: 2 }}>
            {newMessagesArray.map((element, i) => {return (
              <React.Fragment key={element[0]+'-'+i}>
                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                  <Typography variant="body2" component="p">{element[0]}</Typography>
                </ListSubheader>
                  {element[1].map(({id, date, primary, secondary, person}) => {
                    return (
                    <ListItem button key={id}>
                      <ListItemAvatar>
                        <Avatar alt="Profile Picture" src={person} />
                      </ListItemAvatar>
                      <ListItemText primary={primary} secondary={secondary} />
                    </ListItem>
                  )})}
              </React.Fragment>
            )})}
          </List>
        </Box>
      </Paper>
      <AppBar position="absolute" color="primary" sx={{ top:'auto', left: 0, right:0, bottom: 0 , width:'300px'}}>
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <StyledFab color="secondary" aria-label="add">
            <AddIcon />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
