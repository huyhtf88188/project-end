// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Spin } from "antd";
import { useAuth } from "../../context/AuContext";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userApi.getProfile();
        const profileData = response.data || {};
        console.log("Profile data from API:", profileData);
        setUser(profileData);
        form.setFieldsValue({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
        });
        message.success("Tải hồ sơ thành công!");
      } catch (error) {
        console.error("Fetch profile error:", error.response?.data || error);
        if (error.response?.status === 401) {
          message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
        } else if (error.response?.status === 404) {
          message.error("Không tìm thấy thông tin hồ sơ!");
        } else {
          message.error(`Không thể tải thông tin hồ sơ: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form, setUser, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.updateProfile(values);
      setUser(response.data);
      message.success("Cập nhật hồ sơ thành công!");
      setEditMode(false);
    } catch (error) {
      console.error("Update profile error:", error.response?.data || error);
      if (error.response?.status === 404) {
        message.error("Không tìm thấy người dùng để cập nhật!");
      } else if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        message.error("Cập nhật hồ sơ thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-center text-3xl font-bold mb-8">Hồ Sơ Người Dùng</h1>
      {loading ? (
        <div className="text-center">
          <Spin tip="Đang tải..." />
        </div>
      ) : (
        <Card className="shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: user?.name || "",
              email: user?.email || "",
              phone: user?.phone || "",
              address: user?.address || "",
            }}
          >
            <Form.Item
              label="Họ và Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input
                placeholder="Nhập họ và tên"
                disabled={!editMode}
                className="w-full"
              />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input placeholder="Nhập email" disabled className="w-full" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải là 10 chữ số!",
                },
              ]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                disabled={!editMode}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input
                placeholder="Nhập địa chỉ"
                disabled={!editMode}
                className="w-full"
              />
            </Form.Item>

            <div className="flex justify-end gap-4">
              {editMode ? (
                <>
                  <Button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="bg-blue-600"
                  >
                    Lưu
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600"
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
