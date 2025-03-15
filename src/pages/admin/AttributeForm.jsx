import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import attributeApi from "../../api/attributeApi";
import valueAttributeApi from "../../api/valueAttributeApi";

const { Option } = Select;

const AttributeForm = () => {
  const [attributes, setAttributes] = useState([]); // Danh sách thuộc tính (Color, Size)
  const [selectedAttribute, setSelectedAttribute] = useState(null); // Thuộc tính đang chọn
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal thêm mới
  const [formAdd] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttributes();
  }, []);

  // Lấy danh sách thuộc tính (Color, Size)
  const fetchAttributes = async () => {
    try {
      const { data } = await attributeApi.getAll();
      setAttributes(data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách thuộc tính!");
    }
  };

  // Chọn `Color` hoặc `Size` để hiển thị bảng
  const handleSelectAttribute = (attributeName) => {
    const attribute = attributes.find(
      (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
    );
    setSelectedAttribute(attribute || null);
  };

  // Mở Modal "Thêm Giá Trị"
  const showAddModal = () => {
    formAdd.resetFields();
    setIsAddModalOpen(true);
  };

  // Đóng Modal
  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    formAdd.resetFields();
  };

  // Xử lý thêm giá trị biến thể
  const handleAddSave = async (values) => {
    try {
      const attributeId = values.attributeId;
      if (!attributeId) {
        message.error("Vui lòng chọn thuộc tính!");
        return;
      }

      console.log(
        `🆕 Tạo ValueAttribute "${values.name}" cho Attribute ID: ${attributeId}`
      );

      // ✅ Gọi API `createValueAttribute`
      const response = await valueAttributeApi.create({
        id: attributeId,
        name: values.name,
      });

      message.success("Thêm giá trị mới thành công!");

      // ✅ Cập nhật `state` ngay lập tức thay vì gọi API lại
      setAttributes((prevAttributes) =>
        prevAttributes.map((attr) =>
          attr._id === attributeId
            ? { ...attr, values: [...attr.values, response.data.value] }
            : attr
        )
      );

      // ✅ Nếu đang xem bảng của thuộc tính vừa cập nhật, cũng cập nhật ngay
      if (selectedAttribute?._id === attributeId) {
        setSelectedAttribute((prev) => ({
          ...prev,
          values: [...prev.values, response.data.value],
        }));
      }

      handleAddCancel();
    } catch (error) {
      message.error("Lỗi khi thêm giá trị biến thể!");
    }
  };

  // Xóa giá trị biến thể
  const handleDelete = async (valueId) => {
    try {
      if (!selectedAttribute) {
        message.error("Vui lòng chọn thuộc tính trước khi xóa!");
        return;
      }

      const attributeId = selectedAttribute._id;
      console.log("🗑️ Gửi yêu cầu xóa với dữ liệu:", { valueId, attributeId });

      await valueAttributeApi.delete(valueId, attributeId);
      message.success("Xóa giá trị biến thể thành công!");

      // ✅ Cập nhật `state` ngay lập tức thay vì gọi API lại
      setAttributes((prevAttributes) =>
        prevAttributes.map((attr) =>
          attr._id === attributeId
            ? { ...attr, values: attr.values.filter((v) => v._id !== valueId) }
            : attr
        )
      );

      // ✅ Nếu đang xem bảng của thuộc tính vừa cập nhật, cũng cập nhật ngay
      if (selectedAttribute?._id === attributeId) {
        setSelectedAttribute((prev) => ({
          ...prev,
          values: prev.values.filter((v) => v._id !== valueId),
        }));
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa giá trị biến thể:", error);
      message.error("Lỗi khi xóa giá trị biến thể!");
    }
  };

  return (
    <div>
      {/* Header - 3 Nút Chức Năng */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          type={selectedAttribute?.name === "Color" ? "primary" : "default"}
          onClick={() => handleSelectAttribute("Color")}
        >
          Color
        </Button>
        <Button
          type={selectedAttribute?.name === "Size" ? "primary" : "default"}
          onClick={() => handleSelectAttribute("Size")}
        >
          Size
        </Button>
        <Button type="primary" onClick={showAddModal}>
          + Thêm Giá Trị
        </Button>
        <Button onClick={() => navigate("/admin/products")}>Quay lại</Button>
      </Space>

      {/* Hiển thị bảng giá trị nếu có thuộc tính được chọn */}
      {selectedAttribute ? (
        <>
          <Table
            columns={[
              {
                title: "STT",
                dataIndex: "stt",
                key: "stt",
                render: (_, __, index) => index + 1,
              },
              { title: "Tên giá trị", dataIndex: "name", key: "name" },
              {
                title: "Hành động",
                key: "action",
                render: (_, record) => (
                  <Space>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa?"
                      onConfirm={() => handleDelete(record._id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button danger>Xóa</Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            dataSource={selectedAttribute.values}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </>
      ) : (
        <p>Vui lòng chọn "Color" hoặc "Size" để hiển thị danh sách.</p>
      )}

      {/* Modal "Thêm Giá Trị" */}
      <Modal
        title="Thêm Giá Trị Mới"
        open={isAddModalOpen}
        onCancel={handleAddCancel}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAddSave}>
          <Form.Item
            name="attributeId"
            label="Chọn Thuộc Tính"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn thuộc tính">
              {attributes.map((attr) => (
                <Option key={attr._id} value={attr._id}>
                  {attr.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên Giá Trị"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập giá trị biến thể" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttributeForm;
