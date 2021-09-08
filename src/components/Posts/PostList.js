import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

// custom
import PostItem from './PostItem';
const PostList = () => {
  const [postsdata, setPostsdata] = useState([]);

  const fetchData = async () => {
    try {
      // fetch data from a url endpoint
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      console.log("response");
      console.log(response.data);
      setPostsdata(response.data)
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
      {
        postsdata.map((postitem) =>  {
          <JSONPretty data={JSON.stringify(postitem, null, 2)} />
        }
         
        )
      }
    </div>
  )
}

export default PostList;