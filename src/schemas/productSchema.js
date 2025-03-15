import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm không được để trống" }),
  description: z
    .string()
    .min(10, { message: "Mô tả sản phẩm phải có ít nhất 10 ký tự" })
    .optional(),
  basePrice: z
    .number()
    .min(1000, { message: "Giá sản phẩm phải lớn hơn 1,000" }),
  stock: z
    .number()
    .min(0, { message: "Số lượng không hợp lệ, phải từ 0 trở lên" }),
  brandId: z.string().min(1, { message: "Vui lòng chọn thương hiệu" }),
  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
  sex: z.enum(["male", "female", "unisex"], {
    message: "Vui lòng chọn giới tính hợp lệ",
  }),
  thumbnail: z.string().optional(),
});

export default productSchema;
