import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import authApi from "../api/authApi";
import { registerSchema } from "../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  const nav = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleSubmitForm = async (data) => {
    try {
      const res = await authApi.register(data);
      console.log(res);
      const confirmRegister = confirm(
        "Đăng ký thành công. Chuyển đến trang đăng nhập?"
      );
      if (confirmRegister) nav("/login");
      else reset();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng Ký Tài Khoản
        </h2>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tên"
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
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
            <FaPhone className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400" />
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
          <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Đăng Ký
          </button>
          <p className="text-center text-gray-600 mt-4">
            Bạn đã có tài khoản?
            <Link to="/login" className="text-blue-500 ml-2 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
