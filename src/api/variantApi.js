import axiosClient from "./axiosClient";

const variantApi = {
  getAll: () => axiosClient.get("/variant"),
  getById: (id) => axiosClient.get(`/variant/${id}`),
  create: (data) => axiosClient.post("/variant", data),
  update: (productId, data) => axiosClient.put(`/variant/${productId}`, data),
  delete: (id) => axiosClient.delete(`/variant/${id}`),
};

export default variantApi;
