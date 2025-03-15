import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../redux/action/productAction";
import productSchema from "../../schemas/productSchema";
import { fetchProductData } from "../../redux/slice/productDataSlice";
import Attribute from "../../components/Attribute";
import { message } from "antd";

const { VITE_CLOUD_NAME, VITE_UPLOAD_PRESET } = import.meta.env;

const ProductForm = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailOption, setThumbnailOption] = useState("keep");
  const [uploading, setUploading] = useState(false);
  const { brands, categories, attributes, valueAttributes } = useSelector(
    (state) => state.productData
  );

  console.log(brands);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: { stock: 0, basePrice: 0 },
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", VITE_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setThumbnailUrl(data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (thumbnailOption === "link") {
      setThumbnailUrl(watch("thumbnail"));
    }
  }, [watch("thumbnail"), thumbnailOption]);

  const handleSubmitProduct = async (product) => {
    try {
      let newProduct = {
        ...product,
        attributes: selectedAttributes,
        variants: [],
      };

      if (thumbnailOption === "upload") {
        newProduct.imageUrl = thumbnailUrl;
      } else if (thumbnailOption === "link") {
        newProduct.imageUrl = product.thumbnail;
      } else if (thumbnailOption === "keep") {
        delete newProduct.thumbnail;
      }

      console.log("Dữ liệu gửi lên backend:", newProduct);
      await dispatch(addProduct(newProduct));
      message.success("Tạo sản phẩm thành công!");
      nav("/admin/products");
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <form onSubmit={handleSubmit(handleSubmitProduct)}>
        <h1 className="text-2xl font-bold mb-6 text-center">Tạo Sản Phẩm</h1>

        {/* Tên sản phẩm */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên Sản Phẩm
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả sản phẩm
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Tồn kho */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tồn kho
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("stock", { valueAsNumber: true })}
          />
        </div>

        {/* Giá mặc định */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá Mặc Định
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("basePrice", { valueAsNumber: true })}
          />
        </div>

        {/* Giới tính */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới Tính
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("sex")}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Thương hiệu */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thương Hiệu
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("brandId")}
          >
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Danh mục */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh Mục
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("categoryId")}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thuộc tính sản phẩm */}
        <Attribute
          attributes={attributes}
          valueAttributes={valueAttributes}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
        />

        {/* Thumbnail */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={thumbnailOption}
            onChange={(e) => setThumbnailOption(e.target.value)}
          >
            <option value="keep">Giữ nguyên</option>
            <option value="link">Nhập link</option>
            <option value="upload">Tải lên</option>
          </select>

          {thumbnailOption === "link" && (
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("thumbnail")}
            />
          )}
          {thumbnailOption === "upload" && (
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => uploadImage(e.target.files[0])}
            />
          )}

          {uploading && (
            <p className="text-blue-500 text-sm mt-2">Đang tải ảnh...</p>
          )}
          {thumbnailUrl && (
            <div className="flex justify-center mt-4">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-64 h-64 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Tạo Sản Phẩm
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
