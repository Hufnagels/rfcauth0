import React, { useState, useEffect } from "react";
import { 
  NavLink, 
  Link as RouterLink 
} from "react-router-dom";
import PropTypes from 'prop-types';

// Material
import { styled, useTheme, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Drawer,
  Container,
  Link,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Slide,
  Fab,
  Zoom,
  useScrollTrigger,
} from "@mui/material";


// Material icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// custom
import routes from '../features/routes/routes';
import AuthenticationButton from './Auth/Authenticationbutton';
import Layout from './Container';

// ScrollToTop
function HideOnScroll(props) {
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

function ScrollTop(props) {
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
console.log('click')
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
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
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
    backgroundColor: theme.palette.primary.main,
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
  },
  logo: {
    
    fontWeight: 900,
    color: "#FFFEFE",
    textAlign: "left",
  },
  links: {
    display:'flex',
    flexDirection:'row',
    flexWrap:'nowrap',
    alignContent:'center',
    justifyContent:'center',
    alignItems:'center',
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
    color: theme.palette.text.primary,
  },
  activeClass: {
    color: '#e55cb3',
    backgroundColor: '#90d6e3',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    padding: "20px 30px",
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const drawerWidth = 250;
const appname = process.env.APP_NAME;

const MainLayout = (props) => {
  const { header, logo, links, menuButton, activeClass, navlink, toolbar, drawerContainer } = useStyles();
  const headersData = routes[1].children;
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  
  const { mobileView, drawerOpen } = state;
console.log(appname)

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return (
      <React.Fragment>
        {SiteNameAndLogo}
        <div className={links}>{getMenuButtons()}</div>
      </React.Fragment>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <React.Fragment>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Box
            sx={{ width: drawerWidth }}
            role="presentation"
            /* onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)} */
          >
            <List>
              {getDrawerChoices()}
            </List>
            <div className={drawerContainer}>{getDrawerChoices()}</div>
          </Box>
        </Drawer>

        <div>{SiteNameAndLogo}</div>
      </React.Fragment>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ title, path }) => {
      if(title)
      return (
        <NavLink end className={navlink} to={path} activeClassName={activeClass} key={`routeLink-${title}}`}>
          <ListItem button key={`routeListItem-${title}}`} >
            <Typography variant="span">{title}</Typography>
          </ListItem>
        </NavLink>
      );
    });
  };

  const SiteNameAndLogo = (
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{appname}</Typography>
  );

  const getMenuButtons = () => {
    return headersData.map(({ title, path }) => {
      if(title)
      return (
        <Button
          {...{
            key: title,
            color: "inherit",
            to: path,
            component: RouterLink,
            className: menuButton,
          }}
        >
          {title}
        </Button>
      );
    });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar className={header}>
          <Toolbar className={toolbar}>
          {mobileView ? displayMobile() : displayDesktop()}
            <AuthenticationButton />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />
      <Layout margin='2' />
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}

export default MainLayout;