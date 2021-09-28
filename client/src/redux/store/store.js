import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/counterSlice';
import whiteboardReducer from '../reducers/whiteboardSlice';
// import mindmapReducer from '../../pages/admin/Mindmap/mindmapSlice';
import undoable from 'redux-undo';

export const store = configureStore({
  reducer: {
    counter: undoable(counterReducer),
    board: undoable(whiteboardReducer),
  },
});