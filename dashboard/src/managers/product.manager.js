import { createSlice } from "@reduxjs/toolkit";

export const ProductManager = createSlice({
    name: 'product',
    initialState: {
        refresh: false,
    },
    reducers: {
        setRefreshProduct: state => {
            state.refresh = !state.refresh;
        },

    },
});
export const { setRefreshProduct } = ProductManager.actions
export default ProductManager.reducer