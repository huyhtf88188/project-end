import * as z from "zod";

export const productSchema = z.object({
  size: z.number(),
  price: z.number().positive("Giá phải là số dương"),
  stock: z.number().int().min(0, "Tồn kho không được âm"),
});
