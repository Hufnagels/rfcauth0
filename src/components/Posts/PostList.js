import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

// Material

import { Grid, Paper, CircularProgress } from '@mui/material';

// custom
import PostListItem from './PostListItem';

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
    <React.Fragment>
    <h1>PostList</h1>
    <Grid 
      container 
      direction="row"
      spacing={2}
    >
      { postsdata.length ? 
        postsdata.map(post => <PostListItem data={post} />)
        : <CircularProgress color="secondary" />
      }
    </Grid>
    </React.Fragment>
  )
}

export default PostList;