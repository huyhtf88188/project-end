import * as z from "zod";
export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(
      /^(0|\+84)[0-9]{9,10}$/,
      "Số điện thoại phải là của Việt Nam và có 10-11 số"
    ),
  name: z.string().min(1, "Tên không được để trống"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(255),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8).max(255),
});
