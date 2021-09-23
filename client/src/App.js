import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import {
  useRoutes
} from 'react-router-dom';
//Material

//custom
// import AuthNav from './components/Auth/AuthNav';
import Loading from './components/Loading';
import routes from './features/routes/routes'

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  //let content = useRoutes(routes);
  const content = useRoutes(routes(isAuthenticated));
  console.clear()
  console.log(isAuthenticated)
  
  if (isLoading) {
    return <Loading />;
  }

  return content; 
}

