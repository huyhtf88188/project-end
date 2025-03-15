import React, { useState, useEffect } from "react";
import { Input } from "antd";

const Attribute = ({
  attributes,
  selectedAttributes,
  setSelectedAttributes,
  price,
  setPrice,
  stock,
  setStock,
  handleModelVisible,
}) => {
  const [selectedValues, setSelectedValues] = useState({});
  // Khởi tạo selectedValues từ selectedAttributes (chỉ chạy một lần khi component mount)
  useEffect(() => {
    const initialValues = {};
    selectedAttributes.forEach((attr) => {
      initialValues[attr.attributeId._id] = {
        valueId: attr.valueId._id,
        valueName: attr.valueId.name,
      };
    });

    setSelectedValues(initialValues);
  }, [handleModelVisible]); // Chỉ chạy một lần khi component mount

  // Hàm xử lý khi chọn giá trị từ dropdown
  const handleValueSelect = (attributeId, valueId, valueName) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attributeId]: { valueId, valueName },
    }));
  };

  // Cập nhật selectedAttributes khi selectedValues thay đổi
  useEffect(() => {
    const filteredAttributes = Object.entries(selectedValues).map(
      ([attributeId, value]) => {
        return {
          attributeId, // Lưu attributeId dưới dạng chuỗi
          valueId: value.valueId, // Lưu valueId dưới dạng chuỗi
          valueName: value.valueName, // Lưu valueName để hiển thị
        };
      }
    );
    setSelectedAttributes(filteredAttributes);
  }, [selectedValues]); // Chỉ chạy khi selectedValues thay đổi

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-4">Thêm Giá Trị Thuộc Tính</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Thuộc tính</th>
            <th className="border border-gray-300 p-2">Giá trị</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attr) => (
            <tr key={attr._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{attr.name}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={selectedValues[attr._id]?.valueId || ""}
                  onChange={(e) => {
                    const selectedValue = attr.values.find(
                      (v) => v._id === e.target.value
                    );
                    if (selectedValue) {
                      handleValueSelect(
                        attr._id,
                        selectedValue._id,
                        selectedValue.name
                      );
                    }
                  }}
                  className="w-full border p-1 rounded-md"
                >
                  <option value="">Chọn giá trị</option>
                  {attr.values.map((value) => (
                    <option key={value._id} value={value._id}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Trường nhập giá và tồn kho */}
      {setPrice && setStock && (
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Giá</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Nhập giá"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tồn kho</label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Nhập tồn kho"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Attribute;
