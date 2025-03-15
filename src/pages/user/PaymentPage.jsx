import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button, message, Radio, Divider, List } from "antd";
import { selectTotalPrice, selectCartItems } from "../../redux/slice/cartSlice"; // Import selectors từ cartSlice
import { useAuth } from "../../context/AuContext";
import axiosClient from "../../api/axiosClient";

const PaymentPage = () => {
  const totalPrice = useSelector(selectTotalPrice); // Tổng tiền từ Redux
  const cartItems = useSelector(selectCartItems) || []; // Danh sách sản phẩm trong giỏ hàng
  const { user } = useAuth(); // Thông tin người dùng từ context
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // Phương thức thanh toán mặc định

  // Cập nhật thông tin form khi user thay đổi
  useEffect(() => {
    form.setFieldsValue({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    // In dữ liệu để kiểm tra
    console.log("Cart Items in PaymentPage:", cartItems);
    console.log("Total Price in PaymentPage:", totalPrice);
  }, [user, form, cartItems, totalPrice]);

  // Xử lý khi submit form
  const onFinish = async (values) => {
    try {
      if (cartItems.length === 0) {
        message.error("Giỏ hàng trống, không thể thanh toán!");
        return;
      }

      if (paymentMethod === "vnpay") {
        const paymentData = {
          amount: totalPrice,
          name: values.name,
          phone: values.phone,
          address: values.address,
          note: values.note || "",
          orderDescription: `Thanh toán đơn hàng ${new Date().getTime()}`,
          orderType: "billpayment",
          language: "vn",
          cartItems: cartItems.map((item) => ({
            productId: item.productId._id,
            variantId: item.variantId._id,
            quantity: item.quantity,
            price: item.variantId.price,
          })),
        };

        const response = await axiosClient.post(
          "http://localhost:5000/checkout",
          paymentData
        );

        if (response.data.vnpUrl) {
          window.location.href = response.data.vnpUrl;
        } else {
          message.error("Lỗi khi tạo URL thanh toán VNPAY!");
        }
      } else if (paymentMethod === "cod") {
        message.success(
          "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng."
        );
        // Gửi yêu cầu lưu đơn hàng COD tới backend nếu cần
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-center text-3xl font-bold mb-8">
        Thanh Toán Đơn Hàng
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">
          Giỏ hàng của bạn đang trống.
        </p>
      ) : (
        <div className="flex flex-col md:flex-row gap-5">
          {/* Cột bên trái: Thông tin giao hàng và phương thức thanh toán */}
          <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Thông Tin Giao Hàng</h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: user?.name || "",
                phone: user?.phone || "",
                address: user?.address || "",
              }}
            >
              <Form.Item
                label="Họ và Tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" className="w-full" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại phải là 10 chữ số!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" className="w-full" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ giao hàng",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập địa chỉ giao hàng"
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea
                  rows={2}
                  placeholder="Ghi chú (nếu có)"
                  className="w-full"
                />
              </Form.Item>
            </Form>

            <Divider />

            <h3 className="text-lg font-semibold mb-4">
              Phương Thức Thanh Toán
            </h3>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <Radio value="vnpay" className="block mb-2">
                Thanh toán qua VNPAY
              </Radio>
              <Radio value="cod" className="block">
                Thanh toán khi nhận hàng (COD)
              </Radio>
            </Radio.Group>
          </div>

          {/* Cột bên phải: Tóm tắt đơn hàng */}
          <div className="w-full md:w-96 bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Tóm Tắt Đơn Hàng</h3>
            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="w-10 h-10 object-cover rounded-md mr-2"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/40")
                      } // Hình ảnh dự phòng
                    />
                    <div>
                      <span className="font-medium">{item.productId.name}</span>
                      <div className="text-sm text-gray-500">
                        {item.variantId.attributes.map((attr) => (
                          <span key={attr._id}>
                            {attr.attributeId.name}: {attr.valueId.name}{" "}
                          </span>
                        ))}
                        (x{item.quantity})
                      </div>
                    </div>
                  </div>
                  <span>
                    {(item.variantId.price * item.quantity).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </span>
                </List.Item>
              )}
            />
            <Divider />
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng tiền:</span>
              <span className="text-red-500">
                {totalPrice.toLocaleString("vi-VN")} VND
              </span>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => form.submit()}
              className="w-full mt-5 h-12 bg-blue-600 hover:bg-blue-700"
            >
              {paymentMethod === "vnpay" ? "Thanh Toán Qua VNPAY" : "Đặt Hàng"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
