// src/redux/slice/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import oderApi from "../../api/orderApi";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await oderApi.create(orderData);
      return response.data.order; // Backend trả về { message, order }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Lỗi khi tạo đơn hàng"
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await oderApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Lỗi khi lấy danh sách đơn hàng"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await oderApi.update(orderId, { status });
      return response.data.updatedOrder; // Backend trả về { message, updatedOrder }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Lỗi khi cập nhật trạng thái"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await oderApi.delete(orderId);
      return orderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Lỗi khi xóa đơn hàng"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export const selectOrders = (state) => state.orders.orders;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;

export default orderSlice.reducer;
