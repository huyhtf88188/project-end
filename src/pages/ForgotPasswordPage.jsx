import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import authApi from "../api/authApi";

export const ForgotPasswordPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleForgotPassword = async (data) => {
    try {
      await authApi.fogotPassword(data);
      alert("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Quên Mật Khẩu
        </h2>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-4"
        >
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Gửi Yêu Cầu
          </button>
          <p className="text-center text-gray-600 mt-4">
            <Link to="/login" className="text-blue-500 hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
