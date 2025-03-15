import axiosClient from "./axiosClient";

const valueAttributeApi = {
  getAll: () => axiosClient.get("/value-attribute"),
  getById: (id) => axiosClient.get(`/value-attribute/${id}`),
  create: (data) => axiosClient.post("/value-attribute", data),
  update: (id, data) => axiosClient.put(`/value-attribute/${id}`, data),

  // ✅ Fix lỗi `req.body` rỗng bằng cách gửi `attributeId` trong `data`
  delete: (valueId, attributeId) =>
    axiosClient.delete(`/value-attribute/${valueId}`, {
      data: { attributeId },
    }),
};

export default valueAttributeApi;
