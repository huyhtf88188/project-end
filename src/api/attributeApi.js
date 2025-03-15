import axiosClient from "./axiosClient";

const attributeApi = {
  getAll: () => axiosClient.get("/attributes"),
  getById: (id) => axiosClient.get(`/attributes/${id}`),
  create: (data) => axiosClient.post("/attributes", data),
  update: (id, data) => axiosClient.put(`/attributes/${id}`, data),
  delete: (id) => axiosClient.delete(`/attributes/${id}`),
};

export default attributeApi;
