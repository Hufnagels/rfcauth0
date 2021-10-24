import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Material
import { 
  Grid,
  Card,
  CardHeader,
  CardActions,
  Button,
  CircularProgress 
} from '@mui/material';

// custom
import PostListItem from './PostListItem';

const PostList = () => {
  const [postsdata, setPostsdata] = useState([]);

  const fetchData = async () => {
    try {
      // fetch data from a url endpoint
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      // console.log("response");
      // console.log(response.data);
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
       <Card>
            <CardHeader 
              title={'PostList'}
              subheader={new Date(Date.now()).toDateString()}
            />
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    <Grid 
      container 
      direction="row"
      spacing={2}
      sx={{marginTop:1}}
    >
      { postsdata.length ? 
        /* Object.entries(postsdata).map(([slug, { post }]) => (<PostListItem slug={slug} data={post} />)) */
        postsdata.map((post) => <PostListItem key={post.id} data={post} />)
        : <CircularProgress color="secondary" />
      }
    </Grid>
    </React.Fragment>
  )
}

export default React.memo(PostList);