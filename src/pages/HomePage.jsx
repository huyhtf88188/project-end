import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../api/productApi";
import ProductCard from "../components/ProductCart";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/action/productAction";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    const response = async () => {
      const { payload } = await dispatch(fetchProducts());

      setProducts(payload);
    };
    response();
  }, []);

  // Lọc sản phẩm theo tiêu chí
  const nikeProducts = products.filter((p) => p.brandId?.name === "nike");
  const adidasProducts = products.filter((p) => p.brandId?.name === "Adidas");
  const sportShoes = products.filter(
    (p) => p.categoryId?.name === "giày thể thao"
  );

  return (
    <>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Section: Nike */}
        <ProductSection
          title=" Nike"
          products={nikeProducts}
          bgColor="bg-blue-50"
          query="Nike"
        />

        {/* Section: Adidas */}
        <ProductSection
          title="Adidas"
          products={adidasProducts}
          bgColor="bg-blue-50"
          query="Adidas"
        />
        <ProductSection
          title="giày thể thao"
          products={sportShoes}
          bgColor="bg-blue-50"
          query="giày thể thao"
        />
      </main>
    </>
  );
};

const ProductSection = ({ title, products, bgColor, query }) => {
  const navigate = useNavigate();

  return (
    <section className={`${bgColor} py-10 px-6 rounded-lg`}>
      <h3 className="text-4xl font-bold text-center mb-6">{title}</h3>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate(`/products?query=${query}`)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              Xem thêm
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Không có sản phẩm nào.</p>
      )}
    </section>
  );
};

export default HomePage;
