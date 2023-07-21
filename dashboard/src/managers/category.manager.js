import { createSlice } from "@reduxjs/toolkit";

export const CategoryManager = createSlice({
    name: 'category',
    initialState: {
        refresh: false,
    },
    reducers: {
        setRefreshCategory: state => {
            state.refresh = !state.refresh;
        },

    },
});
export const { setRefreshCategory } = CategoryManager.actions
export default CategoryManager.reducer