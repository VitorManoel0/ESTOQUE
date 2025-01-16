import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => action.payload || [],
    addUser: (state, action) => {
      state.push(action.payload)
    },
    removeUser: (state, action) => {
      return state.filter((user) => user.id !== action.payload)
    },
  },
})

export const { setUsers, addUser, removeUser } = usersSlice.actions
export default usersSlice.reducer
