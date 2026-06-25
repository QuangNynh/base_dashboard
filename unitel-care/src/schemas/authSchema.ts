import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  // .min(1, 'Email hoặc số điện thoại là bắt buộc')
  // .refine(
  //   (value) => {
  //     // Check if it's a valid email or phone number
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     const phoneRegex = /^[0-9]{10,11}$/;
  //     return emailRegex.test(value) || phoneRegex.test(value);
  //   },
  //   {
  //     message: 'Email hoặc số điện thoại không hợp lệ',
  //   }
  // ),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
