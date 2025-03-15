// src/oderApi.js
import axiosClient from "./axiosClient";

const oderApi = {
  getAll: () => axiosClient.get("/oders"), // GET /api/oders
  getById: (id) => axiosClient.get(`/oders/${id}`), // GET /api/oders/:id
  create: (data) => axiosClient.post("/oders", data), // POST /api/oders
  update: (id, data) => axiosClient.put(`/oders/${id}`, data), // PUT /api/oders/:id
  delete: (id) => axiosClient.delete(`/oders/${id}`), // DELETE /api/oders/:id
};

export default oderApi;
