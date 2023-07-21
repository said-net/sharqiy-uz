import { configureStore } from "@reduxjs/toolkit";
import authManager from "./auth.manager";
import CategoryManager from "./category.manager";
import PostManager from "./post.manager";
const Manager = configureStore({
    reducer: {
        auth: authManager,
        category: CategoryManager,
        post: PostManager,
    }
})
export default Manager;