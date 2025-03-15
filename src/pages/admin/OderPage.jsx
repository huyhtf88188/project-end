// src/pages/OrderManagementPage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Select, message, Modal } from "antd";
import {
  deleteOrder,
  fetchOrders,
  selectOrderError,
  selectOrderLoading,
  selectOrders,
  updateOrderStatus,
} from "../../redux/slice/oderSlice";

const { Option } = Select;

const OrderPage = () => {
  const orders = useSelector(selectOrders) || [];
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders()).catch((error) => {
      console.error("Error fetching orders:", error);
    });
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }))
      .unwrap()
      .then(() => message.success("Cập nhật trạng thái thành công"))
      .catch((error) => message.error("Lỗi khi cập nhật trạng thái"));
  };

  const handleDelete = (orderId) => {
    Modal.confirm({
      title: "Xác nhận xóa đơn hàng",
      content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      onOk: () => {
        dispatch(deleteOrder(orderId))
          .unwrap()
          .then(() => message.success("Xóa đơn hàng thành công"))
          .catch((error) => message.error("Lỗi khi xóa đơn hàng"));
      },
    });
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span>{text.slice(-6)}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => <span>{userId?.name || "Khách vãng lai"}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "userId",
      key: "phone",
      render: (userId) => <span>{userId?.phone || "N/A"}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (orderDetails) => (
        <ul>
          {orderDetails.map((item) => (
            <li key={item._id}>
              {item.productId.name} (x{item.quantity})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => <span>{text.toLocaleString("vi-VN")} VND</span>,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="processing">Đang xử lý</Option>
          <Option value="shipped">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="danger"
          onClick={() => handleDelete(record._id)}
          className="bg-red-500 hover:bg-red-600"
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-8 text-center">Quản Lý Đơn Hàng</h1>
      {loading ? (
        <p className="text-center">Đang tải danh sách đơn hàng...</p>
      ) : error ? (
        <p className="text-center text-red-500">Lỗi: {error}</p>
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default OrderPage;
