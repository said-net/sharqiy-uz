import { createSlice } from "@reduxjs/toolkit";

export const AuthManager = createSlice({
    name: 'auth',
    initialState: {
        refresh: false,
        name: '',
        
        phone: '',
        id: ''
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInfoAuth: (state, { payload }) => {
            const { name, phone, image, id } = payload;
            state.name = name;
            state.phone = phone;
            state.id = id;
        }
    },
});
export const { setInfoAuth, setRefreshAuth } = AuthManager.actions
export default AuthManager.reducer