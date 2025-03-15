import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";
import productDataSliceReducer from "./slice/productDataSlice";
import cartReducer from "./slice/cartSlice";
import orderReducer from "./slice/oderSlice";
const store = configureStore({
  reducer: {
    products: productReducer,
    productData: productDataSliceReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export default store;
