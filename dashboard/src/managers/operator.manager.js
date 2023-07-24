import { createSlice } from "@reduxjs/toolkit";

export const OperatorManager = createSlice({
    name: 'operator',
    initialState: {
        refresh: false,
    },
    reducers: {
        setRefreshOperator: state => {
            state.refresh = !state.refresh;
        },

    },
});
export const { setRefreshOperator } = OperatorManager.actions
export default OperatorManager.reducer