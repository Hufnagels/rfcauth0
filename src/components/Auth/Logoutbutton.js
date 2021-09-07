import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

//Material
import { Button } from '@material-ui/core';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      color="inherit"
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;