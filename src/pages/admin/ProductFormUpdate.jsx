import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Table,
  message,
  Image,
  Modal,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../redux/action/productAction";
import { fetchProductData } from "../../redux/slice/productDataSlice";
import productApi from "../../api/productApi";
import variantApi from "../../api/variantApi";
import TextArea from "antd/es/input/TextArea";
import Attribute from "../../components/Attribute";

const { Option } = Select;
const { confirm } = Modal;

const ProductUpdateForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brands, categories, valueAttributes, attributes } = useSelector(
    (state) => state.productData
  );

  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState({ url: null, option: "keep" });
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newVariant, setNewVariant] = useState({
    price: 0,
    stock: 0,
    attributes: [],
  });
  const [form] = Form.useForm();

  useEffect(() => {
    if (
      brands.length === 0 ||
      categories.length === 0 ||
      attributes.length === 0 ||
      valueAttributes.length === 0
    ) {
      dispatch(fetchProductData());
    }
  }, [
    dispatch,
    brands.length,
    categories.length,
    attributes.length,
    valueAttributes.length,
  ]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await productApi.getById(id);
          setProduct(data);
          setThumbnail({ url: data.imageUrl, option: "keep" });
          form.setFieldsValue({
            name: data.name,
            description: data.description,
            brandId: data.brandId?._id,
            categoryId: data.categoryId?._id,
            sex: data.sex,
            stock: data.variants?.reduce((sum, v) => sum + (v.stock || 0), 0),
            basePrice:
              Math.min(...data.variants.map((v) => v.price), Infinity) || 0,
          });
        } catch (error) {
          message.error("Lỗi khi lấy dữ liệu sản phẩm!");
        }
      })();
    }
  }, [id, form]);

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setThumbnail((prev) => ({ ...prev, url: data.secure_url }));
      return data.secure_url;
    } catch (error) {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const showDeleteConfirm = (variantId) => {
    confirm({
      title: "Bạn có thực sự muốn xóa biến thể này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDeleteVariant(variantId);
      },
    });
  };

  const handleDeleteVariant = async (variantId) => {
    if (!variantId) {
      message.error("Lỗi: ID biến thể không hợp lệ!");
      return;
    }
    try {
      await variantApi.delete(variantId);

      setProduct((prevProduct) => ({
        ...prevProduct,
        variants: prevProduct.variants.filter(
          (variant) => variant._id !== variantId
        ),
      }));

      message.success("Xóa biến thể thành công!");
    } catch (error) {
      message.error("Lỗi khi xóa biến thể!");
    }
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    setProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };
      return { ...prevProduct, variants: updatedVariants };
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (
      !newVariant.price ||
      !newVariant.stock ||
      newVariant.attributes.length === 0
    ) {
      message.error("Vui lòng điền đầy đủ thông tin biến thể!");
      return;
    }

    const variantWithAttributes = {
      ...newVariant,
      productId: id,
      attributes: newVariant.attributes.map((attr) => ({
        attributeId: attr.attributeId._id || attr.attributeId,
        valueId: attr.valueId._id || attr.valueId,
      })),
    };

    try {
      const { data } = await variantApi.create(variantWithAttributes);
      console.log(data);
      setProduct((prevProduct) => ({
        ...prevProduct,
        variants: [...prevProduct.variants, data.variant],
      }));
      console.log(product.variants);

      message.success("Thêm biến thể thành công!");

      setIsModalVisible(false);
      setNewVariant({ price: 0, stock: 0, attributes: [] });
    } catch (error) {
      message.error("Lỗi khi lưu biến thể!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewVariant({ price: 0, stock: 0, attributes: [] });
  };

  const onSubmit = async (values) => {
    try {
      if (product.variants.length === 0) {
        message.error("Vui lòng thêm ít nhất một biến thể!");
        return;
      }

      let updatedProduct = {
        ...values,
        variants: product.variants.map((variant) => ({
          ...variant,
          attributes: variant.attributes.map((attr) => ({
            attributeId: attr.attributeId._id || attr.attributeId,
            valueId: attr.valueId._id || attr.valueId,
          })),
        })),
      };

      if (thumbnail.option === "upload") {
        updatedProduct.imageUrl = thumbnail.url;
      } else if (thumbnail.option === "keep") {
        delete updatedProduct.thumbnail;
      }

      await dispatch(updateProduct({ id, updatedProduct }));
      message.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  if (!product) return <p>Đang tải dữ liệu...</p>;

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    {
      title: "Màu sắc",
      dataIndex: "attributesColor",
      key: "color",
      render: (attributes) => {
        const colorAttribute = attributes.find(
          (attr) => attr.attributeId.name === "Color"
        );
        if (!colorAttribute) return "Không có";
        return colorAttribute.valueId.name;
      },
    },
    {
      title: "Size",
      dataIndex: "attributesSize",
      key: "size",
      render: (attributes) => {
        const sizeAttribute = attributes.find(
          (attr) => attr.attributeId.name === "Size"
        );
        if (!sizeAttribute) return "Không có";
        return sizeAttribute.valueId.name;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.price}
          onChange={(e) => handleInputChange(e, index, "price")}
        />
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.stock}
          onChange={(e) => handleInputChange(e, index, "stock")}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => showDeleteConfirm(record._id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const dataSource = product.variants.map((variant) => ({
    key: variant._id,
    price: variant.price,
    stock: variant.stock,
    attributesColor: variant.attributes,
    attributesSize: variant.attributes,
    _id: variant._id,
  }));

  const totalStock = product.variants.reduce(
    (sum, variant) => sum + (Number(variant.stock) || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Cập Nhật Sản Phẩm
        </h1>

        <Form.Item label="Ảnh Sản Phẩm">
          <Select
            value={thumbnail.option}
            onChange={(value) =>
              setThumbnail((prev) => ({ ...prev, option: value }))
            }
          >
            <Option value="keep">Giữ nguyên</Option>
            <Option value="upload">Tải lên</Option>
          </Select>
          {thumbnail.option === "upload" && (
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                uploadImage(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
            </Upload>
          )}
          {uploading && <p className="text-blue-500">Đang tải ảnh...</p>}
          {thumbnail.url && <Image src={thumbnail.url} width={120} />}
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên Sản Phẩm"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="brandId"
          label="Thương Hiệu"
          rules={[{ required: true }]}
        >
          <Select>
            {brands.map((brand) => (
              <Option key={brand._id} value={brand._id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Danh Mục"
          rules={[{ required: true }]}
        >
          <Select>
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="sex" label="Giới Tính" rules={[{ required: true }]}>
          <Select>
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="unisex">Unisex</Option>
          </Select>
        </Form.Item>

        <h2 className="text-lg font-semibold mt-6 mb-2">Danh sách biến thể</h2>
        <Button type="primary" onClick={showModal} className="mb-4">
          Thêm Biến Thể
        </Button>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
        />
        <Form.Item label="Tổng số lượng tồn kho">
          <Input value={totalStock} disabled />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-full mt-4">
          Cập Nhật Sản Phẩm
        </Button>
      </Form>

      <Modal
        title="Thêm Biến Thể Mới"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form layout="vertical">
          <Attribute
            attributes={attributes}
            valueAttributes={valueAttributes}
            selectedAttributes={newVariant.attributes}
            setSelectedAttributes={(attributes) =>
              setNewVariant((prev) => ({ ...prev, attributes }))
            }
            handleModelVisible={isModalVisible}
          />
          <Form.Item label="Giá" required>
            <Input
              type="number"
              name="price"
              value={newVariant.price}
              onChange={(e) =>
                setNewVariant({ ...newVariant, price: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Tồn kho" required>
            <Input
              type="number"
              name="stock"
              value={newVariant.stock}
              onChange={(e) =>
                setNewVariant({ ...newVariant, stock: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductUpdateForm;
