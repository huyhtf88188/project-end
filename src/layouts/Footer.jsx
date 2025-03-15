import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer
      className="bg-gray-900 text-gray-300 py-10  bottom-0 w-full"
      id="contact"
    >
      <div className="container mx-auto xl:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-5 text-center lg:text-left">
          <div className="xl:col-span-1 lg:col-span-2 col-span-1">
            <h2 className="font-bold text-white text-lg mb-4">
              ĐĂNG KÝ NHẬN TIN
            </h2>
            <p className="text-sm mb-3 lg:w-2/3 w-full">
              Nhận thông tin khuyến mãi & sản phẩm mới nhất từ HH-Shoes.
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center lg:justify-start">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="p-2 rounded-md w-full sm:w-64 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto text-sm">
                ĐĂNG KÝ
              </button>
            </form>
          </div>

          {/* Giới thiệu */}
          <div>
            <h2 className="font-bold text-white text-lg mb-4">GIỚI THIỆU</h2>
            <ul className="space-y-2 text-sm">
              <li>HH-Shoes - Thế giới giày chính hãng</li>
              <li>📞 0337 852 638</li>
              <li>✉️ support@hhshoes.com</li>
              <li>🕒 Giờ mở cửa: 08:30 - 22:00</li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h2 className="font-bold text-white text-lg mb-4">CHÍNH SÁCH</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Hướng dẫn đặt hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách Ưu Đãi Sinh Nhật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách Bảo Mật
                </a>
              </li>
            </ul>
          </div>

          {/* Địa chỉ cửa hàng & Mạng xã hội */}
          <div>
            <h2 className="font-bold text-white text-lg mb-4">
              ĐỊA CHỈ CỬA HÀNG
            </h2>
            <ul className="space-y-2 text-sm">
              <li>📍 Hồ Chí Minh (10 CH)</li>
              <li>📍 Hà Nội (2 CH)</li>
              <li>📍 Cần Thơ (2 CH)</li>
            </ul>
            {/* Mạng xã hội */}
            <div className="flex justify-center lg:justify-start space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-400">
          © 2024 HH-Shoes. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
