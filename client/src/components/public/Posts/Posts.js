import React from 'react'
import {
  Outlet
} from 'react-router-dom';

const Posts = () => {
  
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

export default Posts;