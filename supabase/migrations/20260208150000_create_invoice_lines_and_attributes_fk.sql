-- ==============================================================================
-- PHASE 1 SCHEMA MIGRATION: INVOICE LINE ITEMS & PRODUCT VARIANT CONSTRAINTS
-- Execute this script in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Create table public.invoice_lines if not already present
CREATE TABLE IF NOT EXISTS public.invoice_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
    description text NOT NULL,
    quantity numeric DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    amount numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) on invoice_lines
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view invoice lines for invoices they own
CREATE POLICY "Users can view their own invoice lines" ON public.invoice_lines
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices i
            JOIN public.customers c ON i.customer_id = c.id
            WHERE i.id = public.invoice_lines.invoice_id
            AND (c.profile_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'internal')
            ))
        )
    );

-- Allow admins/internal users to manage invoice lines
CREATE POLICY "Admins and internal users can manage invoice lines" ON public.invoice_lines
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin', 'internal')
        )
    );

-- 2. Ensure public.product_attributes has product_id foreign key constraint
DO $$ 
BEGIN
    -- Check if column product_id exists; if not, add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'product_attributes' 
        AND column_name = 'product_id'
    ) THEN
        ALTER TABLE public.product_attributes ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE CASCADE;
    ELSE
        -- If column exists but foreign key constraint is missing, add constraint safely
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name = 'product_attributes'
            AND ccu.column_name = 'product_id'
        ) THEN
            ALTER TABLE public.product_attributes 
            ADD CONSTRAINT fk_product_attributes_product 
            FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 3. Verify structures
SELECT 'invoice_lines table verified:' AS status, count(*) FROM information_schema.columns WHERE table_name = 'invoice_lines';
SELECT 'product_attributes product_id verified:' AS status, count(*) FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'product_id';
