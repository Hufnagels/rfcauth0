import React, { useState, useEffect} from 'react'
import {
  // rest of the elements/components imported remain same
  useParams
} from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

const PostItem = (props) => {
  const { id } = useParams();
  const [postdata, setPostdata] = useState(null);

  const fetchData = async () => {
    try {
      // fetch data from a url endpoint
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts/"+ id);
      // console.log("response");
      // console.log(response.data);
      setPostdata(response.data)
      //dispatch({type: 'FETCH_SUCCESS', payload: response.data})

    } catch(error) {
      //dispatch({type: 'FETCH_ERROR', error: error.message})
      console.log("error", error.message);
    }
  }

  useEffect(() => {
    fetchData();
    
  }, []);
  
  return (
    <div>
      <h1>postitem - {postdata ? postdata.title:null}</h1>
      <JSONPretty data={JSON.stringify(postdata)} />
    </div>
  )
}

export default PostItem
