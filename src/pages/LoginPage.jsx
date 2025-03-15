import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import authApi from "../api/authApi";
import { loginSchema } from "../schemas/authSchema";
import cookie from "cookiejs";
import { useAuth } from "../context/AuContext";

export const LoginPage = () => {
  const { setUser } = useAuth();
  const nav = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      const res = await authApi.login(data);

      setUser(res.data.user);
      const token = res.data.accessToken;
      cookie.set("token", token);
      nav("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng Nhập
        </h2>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Đăng Nhập
          </button>
          <p className="text-center text-gray-600 mt-4">
            <Link to="/fogot-password" className="text-red-500 hover:underline">
              Quên mật khẩu?
            </Link>
          </p>
          <p className="text-center text-gray-600 mt-2">
            Bạn chưa có tài khoản?
            <Link to="/register" className="text-blue-500 ml-2 hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
