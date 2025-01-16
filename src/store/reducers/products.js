import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => action.payload || [],
    addProduct: (state, action) => {
      state.push(action.payload)
    },
    removeProduct: (state, action) => {
      return state.filter((product) => product.id !== action.payload)
    },
  },
})

export const { setProducts, addProduct, removeProduct } = productsSlice.actions
export default productsSlice.reducer
