import { z } from "zod";

// Validation schema for 8-digit university ID
export const universityIdSchema = z
  .string()
  .regex(/^\d{8}$/, "University ID must be exactly 8 digits")
  .transform((val) => parseInt(val, 10));

// Validation for student ID input
export const studentIdInputSchema = z
  .string()
  .regex(/^\d{0,8}$/, "Only digits allowed, maximum 8 characters");

export type UniversityId = z.infer<typeof universityIdSchema>;