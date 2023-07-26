import { configureStore } from "@reduxjs/toolkit";
import AuthManager from "./authManager";

const manager = configureStore({
    reducer: {
        auth: AuthManager
    }
});
export default manager;