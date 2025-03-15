import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message, Space, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProductData } from "../../redux/slice/productDataSlice";
import productApi from "../../api/productApi";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy danh sách sản phẩm khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Gọi API để lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const { data } = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm!");
    }
  };

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      console.log("Xóa sản phẩm ID:", id);

      // Gọi API để xóa sản phẩm trên server
      await productApi.delete(id);

      // Cập nhật danh sách sản phẩm sau khi xóa
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      // Gọi lại Redux để cập nhật danh sách sản phẩm
      dispatch(fetchProductData());

      message.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Lỗi khi xóa sản phẩm!");
    }
  };

  // Định dạng dữ liệu trước khi truyền vào bảng
  const formattedProducts = products.map((product) => ({
    key: product._id, // ID sản phẩm
    name: product.name, // Tên sản phẩm
    description: product.description, // Mô tả sản phẩm
    price: product.basePrice || 0, // Giá thấp nhất
    stock:
      product.variants.length > 0
        ? product.variants.reduce((sum, v) => sum + v.stock, 0)
        : 0, // Tính tổng tồn kho
    imageUrl: product.imageUrl || "", // Ảnh sản phẩm
    category: product.categoryId?.name || "Không xác định", // Lấy tên danh mục
    brand: product.brandId?.name || "Không xác định", // Lấy tên thương hiệu
  }));

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <Image src={imageUrl} width={80} height={80} />
        ) : (
          "Không có ảnh"
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true, // Hiển thị dấu ... nếu quá dài
    },
    {
      title: "Giá thấp nhất",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`, // Hiển thị giá có dấu phẩy
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <span style={{ color: stock > 0 ? "green" : "red" }}>{stock}</span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/products/update/${record.key}`)}
          >
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="select-none">
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate("/admin/products/add")}>
          + Thêm Sản Phẩm
        </Button>
        <Button type="default" onClick={() => navigate("/admin/adttributes")}>
          + Thêm Biến Thể
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={formattedProducts}
        rowKey="key"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProductTable;
