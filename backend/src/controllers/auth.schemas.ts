import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const emailSchema = z.string().email().min(1).max(255);
const nameSchema = z.string().min(4).max(255);
const passwordSchema = z.string().min(6).max(255);
const profileSchema = z.object({
  picture: z.string(),
  fullname: z.string(),
  phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
  gender: z.string(),
  dateOfBirth: z.string(),
  idNumber: z.number(),
  address: z.object({
    street: z.string().optional(),
    village: z.string().optional(),
    subDistrict: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
});
const roleSchema = z
  .enum(["user", "operator", "superadmin", "admin", "operator_voucher", "operator_gelang"])
  .default("user");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const transactionSchema = z.object({
  tickets: z
    .array(
      z.object({
        ticketId: z.string().refine((id) => objectIdRegex.test(id), {
          message: "Invalid ObjectId format",
        }),
        quantity: z.preprocess((arg) => Number(arg), z.number().min(1).max(4)),
      })
    )
    .min(1, "At least one ticket is required"),
  totalTicket: z.preprocess((arg) => Number(arg), z.number().min(1, "Total ticket must be at least 1")),
  totalPrice: z.preprocess((arg) => Number(arg), z.number().min(0, "Total price must be at least 0")),
  status: z.enum(["pending", "paid", "cancelled"]).default("pending"),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(255),
    name: nameSchema,
    profile: profileSchema.omit({ fullname: true }),
    idNumber: z.number().min(16).max(16),
    role: roleSchema,
    historyTransaction: z.array(transactionSchema).optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do Not Match",
    path: ["Confirm Password"],
  })
  .transform((data) => ({
    ...data,
    name: data.name || "",
    profile: {
      ...data.profile,
      fullname: data.name
    },
    historyTransaction: data.historyTransaction || []
  })
);
