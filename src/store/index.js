import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/users'

const store = configureStore({
  reducer: {
    users: userSlice,
  },
})

export default store
