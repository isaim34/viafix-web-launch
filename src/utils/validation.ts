
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');
export const zipCodeSchema = z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code');
export const nameSchema = z.string().min(1, 'Name is required').max(50, 'Name is too long');

// Sanitization functions
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters
    .slice(0, 1000); // Limit length
};

export const sanitizeHtml = (html: string): string => {
  // Simple HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validateAndSanitize = {
  email: (email: string) => {
    const sanitized = sanitizeString(email);
    const result = emailSchema.safeParse(sanitized);
    return { 
      value: sanitized, 
      isValid: result.success, 
      error: result.success ? null : result.error.issues[0]?.message 
    };
  },
  
  phone: (phone: string) => {
    const sanitized = sanitizeString(phone);
    const result = phoneSchema.safeParse(sanitized);
    return { 
      value: sanitized, 
      isValid: result.success, 
      error: result.success ? null : result.error.issues[0]?.message 
    };
  },
  
  zipCode: (zipCode: string) => {
    const sanitized = sanitizeString(zipCode);
    const result = zipCodeSchema.safeParse(sanitized);
    return { 
      value: sanitized, 
      isValid: result.success, 
      error: result.success ? null : result.error.issues[0]?.message 
    };
  },
  
  name: (name: string) => {
    const sanitized = sanitizeString(name);
    const result = nameSchema.safeParse(sanitized);
    return { 
      value: sanitized, 
      isValid: result.success, 
      error: result.success ? null : result.error.issues[0]?.message 
    };
  }
};

// Rate limiting utility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
};
