import React from 'react'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../../components/Loading";
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
  onRedirecting: () => <Loading />,
});
