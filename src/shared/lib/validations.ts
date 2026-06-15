import { z } from 'zod';

// Reusable validation schemas for forms
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const nameSchema = z
  .string()
  .min(1, 'Required')
  .max(100, 'Too long')
  .trim();
