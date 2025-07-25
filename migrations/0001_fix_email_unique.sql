-- Migration to fix the schema to use email instead of username
-- This corrects the legacy migration that used username

-- First, add email column if it doesn't exist (it should already exist from Prisma)
-- ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" text;

-- Remove the old username unique constraint if it exists
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_username_unique";

-- Drop username column if it exists (it shouldn't exist in current Prisma schema)
ALTER TABLE "users" DROP COLUMN IF EXISTS "username";

-- Ensure email unique constraint exists (Prisma should have created this)
-- This is safe to run even if constraint already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_email_unique' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
    END IF;
END $$;
