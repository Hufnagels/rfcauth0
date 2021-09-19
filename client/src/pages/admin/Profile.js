import React from 'react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import RestrictedArea from "../../components/RestrictedArea";
import JSONPretty from 'react-json-pretty';


const Profile = () => {
  const { user } = useAuth0();
  return (
    <div>
      <JSONPretty data={JSON.stringify(user, null, 2)} />
    </div>
  )
}

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <RestrictedArea />,
});
