import axiosClient from "./axiosClient";

const userApi = {
  getProfile: () => axiosClient.get("auth/profile"),
  updateProfile: (data) => axiosClient.put("auth/profile", data),
};

export default userApi;
