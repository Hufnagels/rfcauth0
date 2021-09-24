import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../../pages/admin/Counter/counterSlice';
// import mindmapReducer from '../../pages/admin/Mindmap/mindmapSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});