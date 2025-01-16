import { configureStore } from '@reduxjs/toolkit'
import {userSlice, productSlice} from './reducers/users'

const store = configureStore({
  reducer: {
    users: userSlice,
    products: productSlice,
  },
})

export default store
