import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800">
        404 - Không tìm thấy trang
      </h1>
      <p className="text-gray-600 mt-2">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại!
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md text-lg hover:bg-blue-700 transition"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default NotFoundPage;
