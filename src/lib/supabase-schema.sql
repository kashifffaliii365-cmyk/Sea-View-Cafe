-- ==============================================================================
-- SEA VIEW CAFE/BAR MALTA — SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- Triq Salvinu Vella, Il-Mellieħa, Malta
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & STAFF ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'kitchen_staff', 'courier')),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    preparation_minutes INT DEFAULT 15,
    dietary_tags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS & EXTRAS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.product_extras (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0)
);

-- 5. DELIVERY ZONES & SERVICE AREAS
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    postal_prefix TEXT NOT NULL,
    min_order NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
    fee NUMERIC(10, 2) NOT NULL DEFAULT 2.50,
    estimated_minutes TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUSINESS SETTINGS & OPENING HOURS
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    business_name TEXT NOT NULL DEFAULT 'Sea View Cafe/Bar',
    address TEXT NOT NULL DEFAULT 'Triq Salvinu Vella',
    locality TEXT NOT NULL DEFAULT 'Il-Mellieħa',
    country TEXT NOT NULL DEFAULT 'Malta',
    phone TEXT NOT NULL DEFAULT '+356 2704 2230',
    email TEXT NOT NULL DEFAULT 'info@seaviewmalta.com',
    currency TEXT NOT NULL DEFAULT 'EUR',
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    order_acceptance_enabled BOOLEAN DEFAULT TRUE,
    pickup_enabled BOOLEAN DEFAULT TRUE,
    delivery_enabled BOOLEAN DEFAULT TRUE,
    opening_hours JSONB NOT NULL,
    social_links JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    guest_access_token UUID DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('pickup', 'delivery')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'cancelled')),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT,
    delivery_locality TEXT,
    delivery_postal_code TEXT,
    order_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    scheduled_time TEXT NOT NULL DEFAULT 'asap',
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS (Preserves immutable historical pricing & names)
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    variant_name TEXT,
    extras JSONB DEFAULT '[]',
    quantity INT NOT NULL CHECK (quantity > 0),
    item_notes TEXT,
    calculated_total NUMERIC(10, 2) NOT NULL
);

-- 9. ORDER STATUS EVENTS
CREATE TABLE IF NOT EXISTS public.order_status_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. OFFERS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.offers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    description TEXT NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('coastal_views', 'seating', 'food', 'drinks')),
    image_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    is_authentic_mellieha BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CONTACT ENQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has staff role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff_roles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read for published menu & gallery
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read offers" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (true);

-- Public creation of orders and inquiries
CREATE POLICY "Public create order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order by guest token" ON public.orders FOR SELECT USING (
  guest_access_token::text = current_setting('request.jwt.claim.order_token', true)
  OR user_id = auth.uid()
  OR public.is_staff()
);
CREATE POLICY "Public create enquiry" ON public.contact_enquiries FOR INSERT WITH CHECK (true);

-- Staff permissions
CREATE POLICY "Staff manage products" ON public.products FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage categories" ON public.categories FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage orders" ON public.orders FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage offers" ON public.offers FOR ALL USING (public.is_staff());
CREATE POLICY "Staff manage gallery" ON public.gallery_images FOR ALL USING (public.is_staff());
CREATE POLICY "Staff view enquiries" ON public.contact_enquiries FOR ALL USING (public.is_staff());
