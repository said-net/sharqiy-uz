import { createSlice } from "@reduxjs/toolkit";

export const OrderManager = createSlice({
    name: 'order',
    initialState: {
        refresh: false,
    },
    reducers: {
        setRefreshOrder: state => {
            state.refresh = !state.refresh;
        },

    },
});
export const { setRefreshOrder } = OrderManager.actions
export default OrderManager.reducer