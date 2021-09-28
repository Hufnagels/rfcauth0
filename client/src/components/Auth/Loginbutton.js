import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

//Material
import { makeStyles } from '@mui/styles';
import {
  Button,
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
    color: theme.palette.primary.link,
  },
  activeClassNavbar: {
    color: theme.palette.primary.contrastText,
    outlinBottom: '1px solid #90d6e3',
  },

}));

const LoginButton = () => {
  const { activeClassNavbar, navlinkNavbar } = useStyles();
  const { loginWithRedirect } = useAuth0();
  
  return (
    <Button 
      className={navlinkNavbar} 
      /* activeClassName={activeClassNavbar} */
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