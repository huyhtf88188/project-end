import axiosClient from "./axiosClient";

const productApi = {
  getAll: () => axiosClient.get("/products"),
  getById: async (id) => {
    try {
      const data = await axiosClient.get(`/products/${id}`);
      return data; // Trả về data thay vì Promise chưa xử lý
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      throw error; // Quan trọng: Ném lỗi để Redux hoặc component xử lý
    }
  },

  create: (data) => axiosClient.post("/products", data),
  update: (id, data) => axiosClient.put(`/products/${id}`, data),
  delete: (id) => axiosClient.delete(`/products/${id}`),
  softDelete: (id) => axiosClient.put(`/products/${id}`),
  search: (query) => axiosClient.get(`/products/search?q=${query}`),
};

export default productApi;
