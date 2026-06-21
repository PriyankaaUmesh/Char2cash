
-- Create transactions table for the Impact dashboard
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  txn_id TEXT NOT NULL UNIQUE,
  farmer_name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  amount TEXT NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Processing',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Public read access (transparent hub)
CREATE POLICY "Transactions are viewable by everyone"
ON public.transactions
FOR SELECT
USING (true);

-- Insert sample data
INSERT INTO public.transactions (txn_id, farmer_name, type, quantity, amount, transaction_date, status) VALUES
  ('TXN-24891', 'Rajesh Kumar', 'Residue Pickup', '2.5 tons', '₹12,500', '2026-02-14', 'Verified'),
  ('TXN-24890', 'Priya Devi', 'Biochar Purchase', '500 kg', '₹8,200', '2026-02-14', 'Delivered'),
  ('TXN-24889', 'Suresh Yadav', 'Residue Pickup', '4.0 tons', '₹20,000', '2026-02-13', 'Processing'),
  ('TXN-24888', 'Anita Sharma', 'Biochar Purchase', '1 ton', '₹15,800', '2026-02-13', 'Verified'),
  ('TXN-24887', 'Mohan Singh', 'Residue Pickup', '3.2 tons', '₹16,000', '2026-02-12', 'Verified');
