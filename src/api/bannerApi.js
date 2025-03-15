import axiosClient from "./axiosClient";

const bannerApi = {
  getAll: () => axiosClient.get("/banner"),
  create: (data) => axiosClient.post("/banner", data),
  delete: (id) => axiosClient.delete(`/banner/${id}`),
};

export default bannerApi;
