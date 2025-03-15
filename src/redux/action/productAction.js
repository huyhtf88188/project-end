import { createAsyncThunk } from "@reduxjs/toolkit";
import productApi from "../../api/productApi";

// Fetch danh sách sản phẩm
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const response = await productApi.getAll();
  return response.data;
});

// Fetch danh sách sản phẩm
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const response = await productApi.getById(id);
    return response.data;
  }
);

// Thêm sản phẩm
export const addProduct = createAsyncThunk("products/add", async (product) => {
  const response = await productApi.create(product);
  return response.data;
});

// Cập nhật sản phẩm
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updatedProduct }) => {
    const response = await productApi.update(id, updatedProduct);
    return response.data;
  }
);

// Xóa sản phẩm
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await productApi.delete(id);
  return id;
});
