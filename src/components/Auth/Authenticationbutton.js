import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

//Material

//custom
import LoginButton from "./Loginbutton";
import AccountMenu from "./AccountMenu";

const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <AccountMenu /> : <LoginButton />;
};

export default AuthenticationButton;
