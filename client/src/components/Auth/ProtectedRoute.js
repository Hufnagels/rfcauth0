import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import RestrictedArea from "../RestrictedArea";

const ProtectedRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <RestrictedArea />,
    })}
    {...args}
  />
);

export default ProtectedRoute;