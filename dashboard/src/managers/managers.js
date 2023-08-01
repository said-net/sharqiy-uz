import { configureStore } from "@reduxjs/toolkit";
import authManager from "./auth.manager";
import CategoryManager from "./category.manager";
import OperatorManager from "./operator.manager";
import ProductManager from "./product.manager";
import OrderManager from "./order.manager";
const Manager = configureStore({
    reducer: {
        auth: authManager,
        category: CategoryManager,
        product: ProductManager,
        operator: OperatorManager,
        order: OrderManager
    }
})
export default Manager;