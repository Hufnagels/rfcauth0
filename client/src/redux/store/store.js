import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/counterSlice';
import whiteboardReducer from '../reducers/whiteboardSlice';
// import mindmapReducer from '../../pages/admin/Mindmap/mindmapSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    board: whiteboardReducer,
  },
});