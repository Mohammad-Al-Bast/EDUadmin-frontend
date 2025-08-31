import { z } from "zod";

// Validation schema for email
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Validation schema for adding a user email
export const addUserEmailSchema = z.object({
  email: emailSchema,
});

export type AddUserEmailFormData = z.infer<typeof addUserEmailSchema>;