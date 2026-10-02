import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(15, "Name must be at most 15 characters"),

    email: zod
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: zod
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must be 8+ chars, with letters, numbers & special character (@$!%*#?&)"
      ),

    rePassword: zod
      .string()
      .min(1, "Password confirmation is required"),

    phone: zod
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Must be a valid Egyptian phone number (e.g. 01012345678)"),
  })
  .refine((obj) => obj.password === obj.rePassword, {
    message: "Password and Confirm Password do not match",
    path: ["rePassword"],
  });حح