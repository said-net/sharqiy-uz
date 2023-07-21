import { createSlice } from "@reduxjs/toolkit";

export const PostManager = createSlice({
    name: 'post',
    initialState: {
        refresh: false,
    },
    reducers: {
        setRefreshPost: state => {
            state.refresh = !state.refresh;
        },

    },
});
export const { setRefreshPost } = PostManager.actions
export default PostManager.reducer