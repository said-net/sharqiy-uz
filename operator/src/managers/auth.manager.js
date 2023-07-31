import { createSlice } from "@reduxjs/toolkit";

export const AuthManager = createSlice({
    name: 'auth',
    initialState: {
        refresh: false,
        name: '',
        balance: 0,
        phone: '',
        id: ''
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInfoAuth: (state, { payload }) => {
            const { name, phone, id, balance } = payload;
            state.name = name;
            state.phone = phone;
            state.id = id;
            state.balance = balance;
        }
    },
});
export const { setInfoAuth, setRefreshAuth } = AuthManager.actions
export default AuthManager.reducer