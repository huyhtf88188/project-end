import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import authApi from "../../api/authApi";
import { useAuth } from "../../context/AuContext";

const UserProfilePage = () => {
  const { user, fetchUser } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      await authApi.updateProfile(values);
      message.success("Cập nhật thông tin thành công!");
      fetchUser();
    } catch (error) {
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Thông Tin Cá Nhân</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateProfile}
        initialValues={{
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        }}
      >
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email của bạn" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại của bạn" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfilePage;
