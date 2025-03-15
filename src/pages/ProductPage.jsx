import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/action/productAction";
import ProductCard from "../components/ProductCart";
import { Slider } from "antd";
import "antd/dist/reset.css";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sortOption, setSortOption] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTitle, setSearchTitle] = useState("Toàn bộ sản phẩm");
  const [priceRange, setPriceRange] = useState([0, 0]);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")
    ? decodeURIComponent(queryParams.get("query"))
    : "";

  const { items } = useSelector((state) => state.products);

  // Tính maxPrice từ variants[0].price của tất cả sản phẩm
  const maxPrice =
    items.length > 0
      ? Math.max(...items.map((p) => p.variants[0]?.price || p.basePrice || 0))
      : 0;

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
    // Cập nhật priceRange khi có dữ liệu sản phẩm
    if (items.length > 0 && priceRange[1] === 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [items, dispatch, maxPrice]);

  const brands = [
    ...new Set(items.map((product) => product.brandId?.name).filter(Boolean)),
  ];
  const categories = [
    ...new Set(
      items.map((product) => product.categoryId?.name).filter(Boolean)
    ),
  ];

  const filteredProducts = () => {
    let filtered = [...items];

    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.tags?.includes(query) ||
          p.brandId?.name.toLowerCase() === query?.toLowerCase() ||
          p.categoryId?.name.toLowerCase() === query?.toLowerCase()
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(p.brandId?.name)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.categoryId?.name)
      );
    }

    if (priceRange[1] > 0) {
      filtered = filtered.filter((p) => {
        const price = p.variants[0]?.price || p.basePrice || 0; // Lấy giá từ variants hoặc basePrice
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    if (sortOption) {
      filtered.sort((a, b) => {
        const priceA = a.variants[0]?.price || a.basePrice || 0;
        const priceB = b.variants[0]?.price || b.basePrice || 0;
        switch (sortOption) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  useEffect(() => {
    let titleParts = [];

    if (selectedBrands.length > 0) titleParts.push(...selectedBrands);
    if (selectedCategories.length > 0) titleParts.push(...selectedCategories);
    if (query) titleParts.push(query);
    if (items.length > 0 && (priceRange[0] > 0 || priceRange[1] < maxPrice)) {
      const priceText = `Giá từ ${priceRange[0].toLocaleString()} đến ${priceRange[1].toLocaleString()}`;
      titleParts.push(priceText);
    }

    if (titleParts.length > 0) {
      setSearchTitle(`Kết quả tìm kiếm: ${titleParts.join(", ")}`);
    } else {
      setSearchTitle("Toàn bộ sản phẩm");
    }
  }, [selectedBrands, selectedCategories, priceRange, query, items, maxPrice]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  return (
    <div className="flex">
      <aside className="w-1/5 bg-gray-100 p-6 rounded-r-lg shadow-md h-screen sticky top-4 overflow-auto">
        <h3 className="text-xl font-bold mb-4">Bộ lọc sản phẩm</h3>

        <label className="font-semibold block mb-2">Sắp xếp theo</label>
        <select
          className="w-full p-2 border rounded-md mb-4"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">-- Chọn cách sắp xếp --</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
        </select>

        <label className="font-semibold block mb-2">Khoảng giá</label>
        <div className="mb-4">
          {items.length > 0 ? (
            <>
              <Slider
                range
                min={0}
                max={maxPrice}
                value={priceRange}
                onChange={handlePriceRangeChange}
                step={Math.ceil(maxPrice / 100)}
                tipFormatter={(value) => `${value.toLocaleString()} VND`}
              />
              <div className="flex justify-between mt-2">
                <span>{priceRange[0].toLocaleString()} VND</span>
                <span>{priceRange[1].toLocaleString()} VND</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          )}
        </div>

        <label className="font-semibold block mb-2">Thương hiệu</label>
        <div className="mb-4">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="cursor-pointer mr-3"
                />
                <label htmlFor={`brand-${brand}`} className="cursor-pointer">
                  {brand}
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có thương hiệu nào.</p>
          )}
        </div>

        <label className="font-semibold block mb-2">Danh mục</label>
        <div>
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="cursor-pointer mr-3"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có danh mục nào.</p>
          )}
        </div>
      </aside>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">{searchTitle}</h2>

        {filteredProducts().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts().map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Không có sản phẩm nào.</p>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
