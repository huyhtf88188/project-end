import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) =>
    axiosClient.post("/auth/register", data, { withCredentials: true }),

  getProfile: () =>
    axiosClient.get("/auth/profile", {
      withCredentials: true,
    }),
  updateProfile: (data) =>
    axiosClient.put("/auth/profile", data, {
      withCredentials: true,
    }),

  forgotPassword: (data) =>
    axiosClient.post("/auth/forgot-password", data, {
      withCredentials: true,
    }),
  logout: () => axiosClient.post("/auth/logout", {}, { withCredentials: true }),
};

export default authApi;
