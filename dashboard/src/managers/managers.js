import { configureStore } from "@reduxjs/toolkit";
import authManager from "./auth.manager";
import CategoryManager from "./category.manager";
import ProductManager from "./product.manager";
const Manager = configureStore({
    reducer: {
        auth: authManager,
        category: CategoryManager,
        post: ProductManager,
    }
})
export default Manager;