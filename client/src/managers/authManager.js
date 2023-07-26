import { createSlice } from "@reduxjs/toolkit";

const AuthManager = createSlice({
    name: 'auth',
    initialState: {
        refresh: false,
        name: '',
        phone: '',
        id: '',
        role: '',
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInformations: (state, { payload }) => {
            const { name, phone, id, role } = payload;
            state.name = name;
            state.phone = phone;
            state.role = role;
            state.id = id;
        }
    }
});
export const { setInformations, setRefreshAuth } = AuthManager.actions;
export default AuthManager.reducer