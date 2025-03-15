import { Carousel, Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // Import icon lớn hơn
import { useEffect, useState } from "react";
import bannerApi from "../api/bannerApi";
import "../styles/Banner.css"; // Import CSS tùy chỉnh

const contentStyle = {
  height: "100vh", // Full màn hình
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#364d79",
};

const CustomPrevArrow = ({ onClick }) => (
  <LeftOutlined className="custom-arrow custom-prev" onClick={onClick} />
);

const CustomNextArrow = ({ onClick }) => (
  <RightOutlined className="custom-arrow custom-next" onClick={onClick} />
);

const Banner = () => {
  const [banner, setBanner] = useState([]);

  const fetchBanner = async () => {
    const allBanner = await bannerApi.getAll();
    setBanner(allBanner?.data.banners);
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <Carousel
      autoplay
      className="custom-carousel"
      arrows
      prevArrow={<CustomPrevArrow />}
      nextArrow={<CustomNextArrow />}
      speed={500}
    >
      {banner.map((item) => (
        <div key={item._id} style={contentStyle}>
          <Image
            src={item.link}
            alt="Banner"
            width="100%"
            height="80vh"
            style={{ objectFit: "contain" }}
            preview={false}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
