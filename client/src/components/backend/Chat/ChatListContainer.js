import React from 'react'

import {
  Box,
  Paper,
} from '@mui/material'

import ChatList from './ChatList'

const ChatListContainer = () => {
  const [open, setOpen] = React.useState(false)
  const [height, setHeight] = React.useState(open ? '600px': '100px')

  const heightHandler = (open) => {
    let h = open ? '600px': '100px'
    setHeight(h)
  }

  return (
    <React.Fragment>
      <Paper elevation={3} sx={{}}>
        <Box component="div" 
          sx={{ 
            p: 0, 
            //border: '1px dashed red',
            position:'fixed',
            bottom:0,
            left:10,
            width:'300px',
            height:height,
            //overflow:'hidden',
            transition:'ease-in-out .5s',
            backgroundColor:'white',
            zIndex:110,
          }}
        >
          <Box component="div" 
            sx={{ 
              p: 0,
              position:'relative',
              width:'300px',
              height:height,
              //overflow:'hidden',
              transition:'ease-in-out .5s',
              backgroundColor:'white',
            }}
          >
            <ChatList heightHandler={heightHandler}/>
          </Box>
          
        
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default ChatListContainer
