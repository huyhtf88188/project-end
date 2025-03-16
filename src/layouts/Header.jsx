import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuContext";
import productApi from "../api/productApi";
import "../styles/header.css";
import { fetchCart } from "./../redux/slice/cartSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const cartItems = useSelector((state) => state.cart.items);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSearch = async (value) => {
    if (value.trim()) {
      try {
        const response = await productApi.search(value);
        setSearchResults(response.data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await productApi.search(searchQuery);
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userMenu = (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
      <div className="py-2 px-4 text-gray-700">Xin chào {user?.name}</div>
      <div
        className="py-2 px-4 text-gray-700 hover:bg-gray-100 cursor-pointer"
        onClick={() => navigate("auth/profile")}
      >
        Xem Profile
      </div>
      <div
        className="py-2 px-4 text-gray-700 hover:bg-gray-100 cursor-pointer"
        onClick={handleLogout}
      >
        Đăng xuất
      </div>
    </div>
  );

  return (
    <header className="bg-white shadow-md select-none">
      <div className="container mx-auto px-15">
        <nav className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-blue-600 select-none"
          >
            <img src="../../public/logo.png" alt="Logo" className="h-8 mr-2" />
            HH-Shoes
          </Link>

          <div className="relative">
            <input
              type="text"
              className="search-bar"
              placeholder="Tìm kiếm ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
            />
            {searchResults.length > 0 && (
              <div className="absolute bg-white border rounded-lg shadow-lg mt-2 w-full">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/products/${result._id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setSearchResults([])}
                  >
                    {result.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <ul className="hidden lg:flex xl:gap-8 gap-4 font-medium relative mb-0 select-none">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Trang chủ
              </Link>
            </li>

            <li className="group relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition flex items-center"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                Thể loại
              </button>
              {categoryOpen && (
                <div className="absolute left-0 top-full w-40 mt-2 z-50 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/products?query=gi%C3%A0y%20th%E1%BB%83%20thao"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        giày thể thao
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="products?query=giày%20chạy%20bộ"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        giày đá bóng
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            <li className="group relative">
              <button
                className="text-gray-700 hover:text-blue-600 transition flex items-center"
                onClick={() => setBrandOpen(!brandOpen)}
              >
                Thương hiệu
              </button>
              {brandOpen && (
                <div className="absolute left-0 top-full w-40 mt-2 z-50 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/products?query=Adidas"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Adidas
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?query=Nike"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        nike
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            <li>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition "
              >
                Liên hệ
              </a>
            </li>
          </ul>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <FaShoppingCart
                    size={20}
                    className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                    onClick={() => navigate("/auth/cart")}
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute bottom-3 left-5 inline-block w-4 h-4 bg-red-600 text-white text-xs font-bold text-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <FaUser
                    size={20}
                    className="text-gray-700 hover:text-blue-600 transition cursor-pointer ml-4 z-60"
                    onClick={() => setMenuOpen(!menuOpen)}
                  />
                  {menuOpen && userMenu}
                </div>
              </>
            ) : (
              <button className="bg-blue-500 py-2 px-3 rounded-3xl text-sm text-white font-semibold hover:cursor-pointer transition-all btn">
                <Link to="/login">Đăng nhập</Link>
              </button>
            )}

            <button
              className="text-gray-700 hover:text-blue-600 transition lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="lg:hidden">
            <ul className="flex flex-col space-y-4 mt-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <button
                  className="text-gray-700 hover:text-blue-600 transition flex items-center"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  Thể loại
                </button>
                {categoryOpen && (
                  <ul className="mt-2 space-y-2">
                    <li>
                      <Link
                        to="/products?query=giày%20thể%20thao"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Giày thể thao
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?query=giày%20chạy%20bộ"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Giày đá bóng
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  className="text-gray-700 hover:text-blue-600 transition flex items-center"
                  onClick={() => setBrandOpen(!brandOpen)}
                >
                  Thương hiệu
                </button>
                {brandOpen && (
                  <ul className="mt-2 space-y-2">
                    <li>
                      <Link
                        to="/brand/adidas"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Adidas
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/brand/nike"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Nike
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Liên hệ
                </a>
              </li>
              {user && (
                <>
                  <li>
                    <div className="relative">
                      <FaShoppingCart
                        size={20}
                        className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                        onClick={() => navigate("/cart")}
                      />
                      {cartItems.length > 0 && (
                        <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-600 text-white text-xs font-bold text-center rounded-full">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="relative">
                      <FaUser
                        size={20}
                        className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                      />
                      {menuOpen && userMenu}
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
