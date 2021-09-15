import * as React from 'react';
import {
  NavLink,
  Outlet,
  useLocation
} from 'react-router-dom';

// Material
import { styled, useTheme, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Typography,
  Divider,
  AppBar,
  Toolbar,
  Box,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';

// Material icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

// custom
import AuthenticationButton from '../Auth/Authenticationbutton';
import routes from '../../features/routes/routes'
import ContentWrapper from './ContentWrapper';

//const theme = createTheme();
const useStyles = makeStyles(theme => {
  console.log(theme)
  return {
    root: {
      display: 'flex',
    },
    navlink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textDecoration:'none',
    },
    active: {
      color: '#e55cb3',
      backgroundColor: '#90d6e3',
    }
  }
  
});
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const drawerWidth = 250;

const AdminLayout = () => {
  const theme = useTheme();
  const classes = useStyles();
  let location = useLocation();
  const [appname, setAppname] = React.useState(null)
  const [state, setState] = React.useState(false);
  
  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(!state);
  };

  return (
    <div>
      <AppBar position="fixed" id="appbar">
        <Toolbar>
          {/* <Button onClick={toggleDrawer('left', true)} color='secondary'>{'left'}</Button> */}
          <IconButton
            color='inherit'
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            sx={{
              marginRight: '36px',
              ...({ display: 'block' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{process.env.REACT_APP_WEBSITE_NAME}</Typography>
          <AuthenticationButton />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <React.Fragment key='left'>
        <Drawer
          anchor='left'
          open={state}
          onClose={toggleDrawer(false)}
        >
          <DrawerHeader>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box
            sx={{ width: drawerWidth }}
            role="presentation"
            /* onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)} */
          >
            <List>
            {
              routes[0].children.map(({ path, title, ...prop }, index) => {
              console.log('prop', prop)
              //const Icon = icons[icon];
              if(title)
                return (
                  <NavLink end className={classes.navlink} to={path} activeClassName={classes.active} key={`routeLink-${index}}`}>
                    <ListItem button key={`routeListItem-${index}}`} >
                      <ListItemIcon>
                        <prop.icon />
                      </ListItemIcon>  
                      <Typography variant="inherit">{title}</Typography>
                    </ListItem>
                  </NavLink>
                );
              })
            }
            </List>
          </Box>
        </Drawer>
      </React.Fragment>

      <ContentWrapper />
    </div>
  );
}

export default AdminLayout;