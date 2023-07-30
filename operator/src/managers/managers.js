import { configureStore } from "@reduxjs/toolkit";
import authManager from "./auth.manager";
const Manager = configureStore({
    reducer: {
        auth: authManager,
    }
})
export default Manager;