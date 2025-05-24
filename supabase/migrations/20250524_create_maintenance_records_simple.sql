
-- Create maintenance_records table structure if it doesn't exist
-- This is a simplified version without RLS for test accounts

-- Add completion tracking fields to existing tables
ALTER TABLE public.service_bookings 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completion_notes TEXT,
ADD COLUMN IF NOT EXISTS parts_used TEXT,
ADD COLUMN IF NOT EXISTS labor_hours NUMERIC;

ALTER TABLE public.custom_offers 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completion_notes TEXT,
ADD COLUMN IF NOT EXISTS parts_used TEXT,
ADD COLUMN IF NOT EXISTS labor_hours NUMERIC;

-- Ensure maintenance_records table has all necessary columns
-- (This table already exists but we're making sure it has the right structure)
