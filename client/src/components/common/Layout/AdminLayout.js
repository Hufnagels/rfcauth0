import * as React from 'react';
import {
  NavLink,
} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

// Material
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Typography,
  Divider,
  AppBar,
  Toolbar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
} from '@mui/material';

// Material icons
import SvgIcon from '@mui/material/SvgIcon';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// custom
import AuthenticationButton from '../../Auth/Authenticationbutton';
import routes from '../../../features/routes/routes'
import ContentWrapper from './ContentWrapper';
import { SocketContext, socket } from '../../../features/context/socketcontext_whiteboard';

//const theme = createTheme();
const useStyles = makeStyles((theme) => {
// console.log(theme)
  return {
    AppBar:{
      zIndex:'100',
    },
    root: {
      zIndex:'100',
      display: 'flex',
      '& :hover':{
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.light,
      }
    },
    navlink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textDecoration:'none',
      color: theme.palette.text.primary,
      '& > *:hover':{
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.light,
      }
    },
    active: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
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
  const classes = useStyles();
  const [state, setState] = React.useState(false);
  const { isAuthenticated } = useAuth0();
  const routesData = routes(isAuthenticated)[0].children;
  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(!state);
  };
  const ref = React.createRef();
  const SideMenuIcon = React.forwardRef((props, ref) => {
// console.log('SideMenuIcon')
// console.log(props, ref.current.type.render.displayName)
    return (
      <SvgIcon ref={ref} component={ref.current.type.render.displayName} className="">
        {props.children}
      </SvgIcon>
    )
  });

  return (
    <div>
      <AppBar position="fixed" id="appbar" className={classes.AppBar}>
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
              routesData.map(({ path, title,icon, ...prop }, index) => {
              //console.log('prop', prop)
              //const Icon = icons[icon];
                if(title){
                  ref.current= icon;  
                  return (
                    <NavLink end className={classes.navlink} to={path} activeClassName={classes.active} key={`routeLink-${index}}`}>
                      <ListItem button key={`routeListItem-${index}}`} >
                        <ListItemIcon>
                          <ref.current.type />
                        </ListItemIcon>  
                        <Typography variant="inherit">{title}</Typography>
                      </ListItem>
                    </NavLink>
                  );
                }
              })
            }
            </List>
          </Box>
        </Drawer>
      </React.Fragment>
      <SocketContext.Provider value={socket}>
        <ContentWrapper />
      </SocketContext.Provider>
    </div>
  );
}

export default AdminLayout;