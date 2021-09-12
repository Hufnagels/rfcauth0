import React from 'react'


// custom
import Wrapper from '../../../components/Wrapper';
import WBToolbar from './WBToolbar';
import Board from './Board';

const Whiteboard = () => {
  return (
    <Wrapper>
      <WBToolbar />
      <Board />
    </Wrapper>
  )
}

export default Whiteboard;
