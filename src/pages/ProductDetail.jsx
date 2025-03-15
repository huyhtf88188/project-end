import {
  Button,
  Card,
  Carousel,
  Col,
  InputNumber,
  message,
  Radio,
  Row,
  Switch,
  Typography,
} from "antd";
import "antd/dist/reset.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCart";
import { fetchProductById, fetchProducts } from "../redux/action/productAction";
import { useAuth } from "../context/AuContext"; // Import hook useAuth
import "../styles/productDetail.css";
import { set } from "mongoose";
import { addItem } from "../redux/slice/cartSlice";
const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, singleProduct } = useSelector(
    (state) => state.products
  );
  const { error } = useSelector((state) => state.cart.items);
  const { user } = useAuth();

  const [zoomImage, setZoomImage] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColors, setSelectedColors] = useState("");
  const [selectedSizes, setSelectedSizes] = useState("");
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!id) return;
    const fetchData = async () => {
      try {
        await dispatch(fetchProductById(id));
        await dispatch(fetchProducts());
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      }
    };
    fetchData();
  }, [id, dispatch]);

  // Update selected variant based on color/size
  useEffect(() => {
    if (singleProduct && singleProduct.variants) {
      const matchedVariant = singleProduct.variants.find((variant) => {
        return (
          variant.attributes.find((attr) => {
            return (
              attr.attributeId._id.toString() === "67c58166bfdb40692810e641" &&
              attr.valueId._id.toString() === selectedColors.toString()
            );
          }) &&
          variant.attributes.find((attr) => {
            return (
              attr.attributeId._id.toString() === "67c5816bbfdb40692810e645" &&
              attr.valueId._id.toString() === selectedSizes.toString()
            );
          })
        );
      });
      setSelectedVariant(matchedVariant || null);
    }
  }, [selectedColors, selectedSizes, singleProduct]);

  // Update stock text
  useEffect(() => {
    if (selectedVariant) {
      if (selectedVariant.stock > 0) {
        setStock(`Còn ${selectedVariant.stock} sản phẩm`);
      } else {
        setStock("Hết hàng");
      }
    } else if (singleProduct && selectedColors) {
      setStock("Hết hàng");
    } else if (
      singleProduct &&
      typeof singleProduct.totalStock !== "undefined"
    ) {
      setStock(`Còn ${singleProduct.totalStock} sản phẩm`);
    } else {
      setStock("Đang tải...");
    }
  }, [selectedVariant, singleProduct, selectedColors]);

  // Early returns
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Title level={2}>
          <div className="loading flex justify-center gap-1">
            <span>Đ</span>
            <span>a</span>
            <span>n</span>
            <span>g</span>
            <span> </span>
            <span>t</span>
            <span>ả</span>
            <span>i</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </Title>
      </div>
    );
  }

  if (!singleProduct) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Title level={2}>Sản phẩm không tồn tại!</Title>
        <Button
          type="primary"
          onClick={() => navigate("/products")}
          style={{ marginTop: 16 }}
        >
          Quay lại sản phẩm
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      addItem({
        productId: singleProduct._id,
        variantId: selectedVariant._id,
        quantity,
      })
    );
    if (!error) {
      message.success("Thêm vào giỏ hàng thành công!");
      setQuantity(1);
      setSelectedColors("");
      setSelectedSizes("");
    }
  };

  const images = [singleProduct.imageUrl];
  const uniqueColors = [
    ...new Map(
      singleProduct.variants
        ?.map((v) => {
          const colorAttr = v.attributes.find(
            (a) => a.attributeId.name === "Color"
          );
          return colorAttr
            ? [
                colorAttr.valueId._id,
                { _id: colorAttr.valueId._id, name: colorAttr.valueId.name },
              ]
            : null;
        })
        .filter(Boolean)
    ).values(),
  ];
  const uniqueSizes = [
    ...new Map(
      singleProduct.variants
        ?.map((v) => {
          const sizeAttr = v.attributes.find(
            (a) => a.attributeId.name === "Size"
          );
          return sizeAttr
            ? { _id: sizeAttr.valueId._id, name: sizeAttr.valueId.name }
            : null;
        })
        .filter(Boolean)
        .map((obj) => [obj._id, obj])
    ).values(),
  ];

  const handleColorChange = (colorId) => {
    setSelectedColors(colorId);
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSizes(sizeId);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <Row gutter={[32, 32]} align="top">
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            style={{
              padding: 0,
              width: "100%",
              height: "450px",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Carousel arrows dots infinite>
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{ position: "relative", cursor: "zoom-in" }}
                  onClick={() => setZoomImage(!zoomImage)}
                >
                  <img
                    src={img || "https://via.placeholder.com/450"}
                    alt={singleProduct.name}
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                      transform: zoomImage
                        ? "scale(1.5)"
                        : view3D
                        ? "rotateY(30deg)"
                        : "scale(1)",
                    }}
                  />
                </div>
              ))}
            </Carousel>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Text style={{ marginRight: 8 }}>Xem 3D:</Text>
              <Switch
                checked={view3D}
                onChange={(checked) => {
                  setView3D(checked);
                  if (checked) setZoomImage(false);
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={14}>
          <Card
            bordered={false}
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "24px",
            }}
          >
            <Title level={2} style={{ marginBottom: 16 }}>
              {singleProduct.name}
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 24 }}>
              {singleProduct.description || "Không có mô tả"}
            </Paragraph>

            <div style={{ marginBottom: 24 }}>
              {selectedVariant?.price ? (
                <>
                  <Text strong style={{ fontSize: "24px", color: "#f5222d" }}>
                    {selectedVariant.price.toLocaleString()} VND
                  </Text>
                  {singleProduct.basePrice !== selectedVariant.price && (
                    <Text
                      delete
                      type="secondary"
                      style={{ marginLeft: 8, fontSize: "18px" }}
                    >
                      {singleProduct.basePrice.toLocaleString()} VND
                    </Text>
                  )}
                </>
              ) : (
                <Text strong style={{ fontSize: "24px" }}>
                  {singleProduct.basePrice.toLocaleString()} VND
                </Text>
              )}
            </div>

            <Text
              style={{
                color: selectedVariant?.stock > 0 ? "#52c41a" : "#f5222d",
                marginBottom: 24,
                display: "block",
              }}
            >
              {stock}
            </Text>

            {uniqueColors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ marginRight: 12 }}>
                  Màu sắc:
                </Text>
                <Radio.Group
                  onChange={(e) => handleColorChange(e.target.value)}
                  value={selectedColors}
                >
                  {uniqueColors.map((color) => {
                    const isAvailable = singleProduct.variants.some(
                      (v) =>
                        v.attributes.some(
                          (a) =>
                            a.attributeId.name === "Color" &&
                            a.valueId._id === color._id
                        ) && v.stock > 0
                    );
                    return (
                      <Radio
                        key={color._id}
                        value={color._id}
                        disabled={!isAvailable}
                        style={{ marginRight: 16 }}
                      >
                        {color.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            )}

            {uniqueSizes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ marginRight: 12 }}>
                  Kích thước:
                </Text>
                <Radio.Group
                  onChange={(e) => handleSizeChange(e.target.value)}
                  value={selectedSizes}
                >
                  {uniqueSizes.map((size) => {
                    const isAvailable = singleProduct.variants.some(
                      (v) =>
                        v.attributes.some(
                          (a) =>
                            a.attributeId.name === "Size" &&
                            a.valueId._id === size._id
                        ) && v.stock > 0
                    );
                    return (
                      <Radio
                        key={size._id}
                        value={size._id}
                        disabled={!isAvailable}
                        style={{ marginRight: 16 }}
                      >
                        {size.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            )}

            <Paragraph style={{ marginBottom: 8 }}>
              <Text strong>Thương hiệu: </Text>
              {singleProduct.brandId?.name || "Không xác định"}
            </Paragraph>
            <Paragraph style={{ marginBottom: 8 }}>
              <Text strong>Danh mục: </Text>
              {singleProduct.categoryId?.name || "Không xác định"}
            </Paragraph>
            <Paragraph style={{ marginBottom: 24 }}>
              <Text strong>Giới tính: </Text>
              {singleProduct.sex || "Không xác định"}
            </Paragraph>

            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ marginRight: 12 }}>
                Số lượng:
              </Text>
              <InputNumber
                min={1}
                max={selectedVariant?.stock || 0}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              />
            </div>

            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              style={{ width: "100%" }}
            >
              Thêm vào giỏ hàng
            </Button>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: "3rem" }}>
        <Title level={3}>Sản phẩm liên quan</Title>
        {items.length > 0 ? (
          <Row gutter={[16, 16]}>
            {items.slice(0, 4).map((product) => (
              <Col xs={12} sm={8} md={6} key={product._id}>
                <div
                  style={{
                    width: "20rem",
                    height: "30rem",
                    transform: "scale(0.7)",
                    transformOrigin: "top left",
                    overflow: "hidden",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Text type="secondary">Không có sản phẩm liên quan.</Text>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          type="default"
          size="large"
          onClick={() => navigate("/products")}
        >
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
