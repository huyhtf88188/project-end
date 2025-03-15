// src/redux/slice/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../../api/cartApi";

const initialState = {
  items: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

// Tính toán totalPrice từ danh sách items
const calculateTotalPrice = (items) => {
  // Kiểm tra nếu items không tồn tại hoặc không phải mảng
  if (!items || !Array.isArray(items)) {
    console.warn("Items is not an array or is undefined:", items);
    return 0;
  }
  return items.reduce(
    (total, item) =>
      total + (item.variantId?.price || 0) * (item.quantity || 0),
    0
  );
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await cartApi.getCart();
      return response.data; // Trả về object cart từ API
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async ({ variantId }, thunkAPI) => {
    try {
      await cartApi.removeFromCart(variantId);
      return variantId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ variantId, quantity }, thunkAPI) => {
    try {
      await cartApi.updateCartItem(variantId, quantity);
      return { variantId, quantity };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addItem = createAsyncThunk(
  "cart/addItem",
  async (item, thunkAPI) => {
    try {
      console.log(item);
      await cartApi.addToCart(item);
      return item;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await cartApi.clearCart();
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        // console.log("fetchCart response:", action.payload); // Log để kiểm tra dữ liệu
        // Lấy items từ payload, đảm bảo là mảng
        const items = action.payload?.items || [];
        state.items = Array.isArray(items) ? items : [];
        state.totalPrice = calculateTotalPrice(state.items);
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Remove Item
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.variantId._id !== action.payload
        );
        state.totalPrice = calculateTotalPrice(state.items);
      })
      // Update Item Quantity
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const item = state.items.find(
          (item) => item.variantId._id === action.payload.variantId
        );
        if (item) {
          item.quantity = action.payload.quantity;
          state.totalPrice = calculateTotalPrice(state.items);
        }
      })
      // Add Item
      .addCase(addItem.fulfilled, (state, action) => {
        const existingItem = state.items.find(
          (item) =>
            item.productId === action.payload.productId &&
            item.variantId._id === action.payload.variantId
        );
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.totalPrice = calculateTotalPrice(state.items);
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
      });
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectTotalPrice = (state) => state.cart.totalPrice;

export default cartSlice.reducer;
