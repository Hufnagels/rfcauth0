import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  users:[],
  actualstate:{},
}

// const deleteUsersArrayById = produce(state.users, draft => {
//   const index = draft.findIndex(user => user.id === action.payload)
//   if (index !== -1) draft.splice(index, 1)
// })

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    adduser: (state, action) => {
      //state.users = action.payload;
      return {
        ...state,
        users: action.payload,
      }

    },
    removeuser: (state, action) => {
      console.log('removeuser')
      console.log(current(state), action)
    },
    // ({
    //   ...state,
    //   users: {
    //     ...state.users,
    //     ...state.users.filter(user => user.id !== action.payload)
    //   }

    // }),
    statechange: (state, action) => {
      state.actualstate = action.payload;

    },
    addobject: (state, action) => {
      state.users.push(action.payload)
      console.log(state, action)
    }
  }
})

export const { adduser, removeuser, statechange, addobject } = boardSlice.actions;

export const selectBoard = (state) => state.board.actualstate;

export default boardSlice.reducer;