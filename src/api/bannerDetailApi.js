import axiosClient from "./axiosClient";

const bannerDetailApi = {
	getAll: () => axiosClient.get("/banner-details"),
	getById: (id) => axiosClient.get(`/banner-details/${id}`),
	create: (data) => axiosClient.post("/banner-details", data),
	update: (id, data) => axiosClient.put(`/banner-details/${id}`, data),
	delete: (id) => axiosClient.delete(`/banner-details/${id}`),
};

export default bannerDetailApi;
