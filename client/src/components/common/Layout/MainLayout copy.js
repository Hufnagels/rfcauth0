import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  NavLink, 
  Link as RouterLink 
} from "react-router-dom";

// Material
import { styled } from '@mui/material/styles';
import { makeStyles, useTheme } from '@mui/styles';
import {
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Box,
  Drawer,
  Menu,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  Slide,
  Fab,
  Zoom,
  useScrollTrigger,
  useMediaQuery,
} from "@mui/material";
import SvgIcon from '@mui/material/SvgIcon';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// custom
import AuthenticationButton from '../../Auth/Authenticationbutton';
import ContentWrapper from './ContentWrapper';
//import RouterBreadcrumbs from '../RouterBreadcrumbs';
import Sitename from "./Sitename";
import Footer from "./Footer";
import routes from '../../../features/routes/routes';

// ScrollToTop
const HideOnScroll = (props) => {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const ScrollTop = (props) => {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );
// console.log('click')
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 , zIndex: '1000'}}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

// custom styles
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.primary.header,
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
  },
  logo: {
    fontWeight: 900,
    color: theme.palette.primary.color,
    textAlign: "left",
  },
  links: {
    display:'flex',
    flexDirection:'row',
    flexWrap:'nowrap',
    alignContent:'center',
    justifyContent:'center',
    alignItems:'center',
    textDecoration:'none',
  },
  menuButton: {
    fontWeight: 500,

    marginLeft: "18px",
  },
  navlink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'flex-start',
    textDecoration:'none',
    //color: theme.palette.text.primary,
    color: theme.palette.primary.contrastText,
  },
  navlinkNavbar : {
    textDecoration:'none',
    color: theme.palette.primary.contrastText,
  },
  activeClassSidenav: {
    color: theme.palette.primary.dark,
    //backgroundColor: '#90d6e3',
  },
  activeClassNavbarElement: {
    color: theme.palette.primary.contrastText,
    
  },

  drawerContainer: {
    padding: "20px 30px",
  },
  active: {
    color: theme.palette.primary.contrastText,
    //backgroundColor: theme.palette.primary.dark,
    borderBottom: '1px solid #ffeeee',
  }
}));

const MainLayout = (props) => {
  const classes = useStyles();
  
  const isAuthenticated = false;
  const routesData = routes(isAuthenticated)[1].children;

  const [state, setState] = React.useState({
    mobileView: false,
    drawerOpen: false,
  });  
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
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              
              <Sitename />
              <Box >
              <List component="nav" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            {
              routesData.map(({ path, title,icon, ...prop }, index) => {
              //console.log('prop', prop)
              //const Icon = icons[icon];
                if(title){
                  ref.current= icon;  
                  return (
                    <NavLink end className={classes.navlink} to={path} activeClassName={classes.active} key={`routeLink-${index}}`}>
                      <ListItemButton key={`routeListItem-${index}}`} color="primary" >
                        <Typography variant="inherit">{title}</Typography>
                      </ListItemButton>
                    </NavLink>
                  );
                }
              })
            }
            </List>
            </Box>
              <AuthenticationButton />
            </Toolbar>
          </AppBar>
        </Box>
      </HideOnScroll>
      <Typography component="div" id="back-to-top-anchor" />
      <ContentWrapper margin='2' />
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Footer className="" title={'footer'}/>
    </React.Fragment>
  );
}

export default MainLayout