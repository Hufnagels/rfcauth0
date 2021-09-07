import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

//Material
import Button from '@mui/material/Button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <Button 
      color="inherit"
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