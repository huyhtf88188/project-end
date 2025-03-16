// src/pages/user/cartPage.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, InputNumber, message, Modal } from "antd";
import {
  fetchCart,
  removeItem,
  updateItemQuantity,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectTotalPrice,
} from "../../redux/slice/cartSlice";
import { useAuth } from "../../context/AuContext";

const CartPage = () => {
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalPrice);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVariantId, setCurrentVariantId] = useState(null);

  useLayoutEffect(() => {
    dispatch(fetchCart())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, []);

  const showModal = (variantId) => {
    setCurrentVariantId(variantId);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleRemoveItem(currentVariantId);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRemoveItem = async (variantId) => {
    try {
      await dispatch(removeItem({ variantId })).unwrap();
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const handleQuantityChange = (variantId, quantity, stock) => {
    if (quantity > stock) {
      window.alert("Số lượng vượt quá số lượng tồn kho");
      return;
    }
    if (quantity === 0) {
      showModal(variantId);
    } else {
      dispatch(updateItemQuantity({ variantId, quantity })).catch((error) => {
        console.error("Error updating item quantity:", error);
        message.error("Lỗi khi cập nhật số lượng sản phẩm");
      });
    }
  };

  const handleCheckout = () => {
    navigate("/auth/payment");
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <img
            src={record.productId.imageUrl}
            alt={record.productId.name}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h2 className="text-lg font-semibold">{record.productId.name}</h2>
            <div className="text-gray-600">
              {record.variantId.attributes?.map((attr) => (
                <div key={attr._id}>
                  {attr.attributeId.name}: {attr.valueId.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <p className="text-gray-600">
          {record.variantId.price?.toLocaleString()} đ
        </p>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={0}
          // max={record.variantId.stock}
          value={record.quantity}
          onChange={(value) =>
            handleQuantityChange(
              record.variantId._id,
              value,
              record.variantId.stock
            )
          }
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Button
          type="danger"
          style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
          onClick={() => showModal(record.variantId._id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

  if (error) {
    return <p>Lỗi khi tải giỏ hàng: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Giỏ Hàng</h1>
      {cartItems && cartItems.length > 0 ? (
        <div>
          <Table
            dataSource={cartItems}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
          />
          <div className="flex justify-end items-center mt-6">
            <h2 className="text-xl font-bold">
              Tổng cộng: {totalAmount.toLocaleString()} đ
            </h2>
          </div>
          <div className="flex justify-end items-center mt-6">
            <Button type="primary" size="large" onClick={handleCheckout}>
              Thanh Toán
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Giỏ hàng của bạn đang trống.
        </p>
      )}
      <div className="text-center mt-6">
        <Link to="/" className="text-blue-500">
          Tiếp tục mua sắm
        </Link>
      </div>
      <Modal
        title="Xác nhận xóa"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
      </Modal>
    </div>
  );
};

export default CartPage;
