import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

//Material
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

// custom styles
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
  },
  navlinkNavbar : {
    textDecoration:'none',
    color: theme.palette.primary.light,
  },
  activeClassNavbar: {
    color: '#ffeeee',
    outlinBottom: '1px solid #90d6e3',
  },

}));

const LoginButton = () => {
  const { activeClassNavbar, navlinkNavbar } = useStyles();
  const { loginWithRedirect } = useAuth0();
  
  return (
    <Button 
      className={navlinkNavbar} 
      activeClassName={activeClassNavbar}
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup",
        })
      }
    >
      Login
    </Button>
  )
}

export default LoginButton;