
-- Allow null user_id for VIN lookup subscribers (users who don't need to create accounts)
ALTER TABLE public.subscribers 
ALTER COLUMN user_id DROP NOT NULL;

-- Update the policy to allow insertions with null user_id
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Update select policy to allow viewing subscriptions by email for non-authenticated users
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email() OR user_id IS NULL);
