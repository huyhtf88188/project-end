import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const shortDescription =
    product.description?.length > 100
      ? product.description.slice(0, 100) + " ..."
      : product.description;
  const shortName =
    product.name?.length > 30
      ? product.name.slice(0, 130) + " ..."
      : product.name;

  const handleViewDetail = () => {
    navigate(`/products/${product._id}`);
    console.log(product._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col h-full">
      <div
        className="w-full aspect-[4/3] overflow-hidden rounded-md cursor-pointer"
        onClick={handleViewDetail}
      >
        <img
          src={product.imageUrl || "https://via.placeholder.com/200"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nội dung sản phẩm */}
      <div className="flex-grow flex flex-col space-y-2 mt-2">
        <h3 className="text-lg font-semibold line-clamp-2">{shortName}</h3>
        <p className="text-gray-600 text-sm min-h-[60px]">
          {shortDescription || "Không có mô tả"}
        </p>

        <p className="text-gray-700 font-bold">
          Giá: {product.basePrice.toLocaleString()}₫
        </p>
        <p
          className={`text-sm ${
            product.totalStock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.totalStock > 0
            ? `Còn ${product.totalStock} sản phẩm`
            : "Hết hàng"}
        </p>

        <button
          onClick={handleViewDetail}
          className={`mt-auto w-full py-2 rounded-md text-white font-semibold ${
            product.totalStock > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={product.totalStock === 0}
        >
          Xem Chi Tiết
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
