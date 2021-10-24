import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

//Material
import { makeStyles } from '@mui/styles';
import {
  Button,
} from "@mui/material";

// custom styles
const useStyles = makeStyles((theme) => ({
  navlinkNavbar : {
    textDecoration:'none',
    color: theme.palette.custom2.color5,
  },
}));

const LoginButton = () => {
  const classes = useStyles();
  const { loginWithRedirect } = useAuth0();
  
  return (
    <Button 
      className={classes.navlinkNavbar} 
      /* activeClassName={activeClassNavbar} */
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup",
        })
      }
    >
      LogIn
    </Button>
  )
}

export default LoginButton;