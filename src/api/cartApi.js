// src/api/cartApi.js
import axiosClient from "./axiosClient"; // Giả định bạn dùng axiosClient

const cartApi = {
  getCart: () => axiosClient.get("/cart"),
  addToCart: (item) => axiosClient.post("/cart/add", item),
  removeFromCart: (variantId) =>
    axiosClient.delete("/cart/remove", { data: { variantId } }), // Sửa để gửi body trong DELETE
  updateCartItem: (variantId, quantity) =>
    axiosClient.put("/cart/update", { variantId, quantity }),
  clearCart: () => axiosClient.delete("/cart/clear"), // Thêm hàm clearCart
};

export default cartApi;
