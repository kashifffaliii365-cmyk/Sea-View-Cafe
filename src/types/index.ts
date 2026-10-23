export type OrderType = 'pickup' | 'delivery';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'test_card' | 'pay_at_pickup' | 'pay_on_delivery';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Allergen {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number; // e.g. +1.50 EUR
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number; // e.g. 1.00 EUR
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number; // EUR
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  dietaryTags?: string[]; // e.g., 'Vegetarian', 'Gluten-Free'
  allergens?: string[];   // e.g., 'Gluten', 'Dairy', 'Nuts'
  variants?: ProductVariant[];
  extras?: ProductExtra[];
  preparationMinutes?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface CartItem {
  id: string; // unique item instance id in cart
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  unitPrice: number;
  selectedVariant?: ProductVariant;
  selectedExtras: ProductExtra[];
  quantity: number;
  itemNotes?: string;
  calculatedItemTotal: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  postalPrefix: string;
  minOrder: number;
  fee: number;
  estimatedMinutes: string;
  isActive: boolean;
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  // Delivery specific
  addressLine1?: string;
  locality?: string;
  postalCode?: string;
  deliveryInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SV-2026-1042
  createdAt: string;
  orderType: OrderType;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  scheduledTime: string; // "asap" or ISO/time string
  cancellationReason?: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  description: string;
  validUntil: string;
  isActive: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'coastal_views' | 'seating' | 'food' | 'drinks';
  imageUrl: string;
  caption: string;
  isAuthenticMellieha: boolean;
}

export interface BusinessSettings {
  businessName: string;
  address: string;
  locality: string;
  country: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleRating: number;
  googleReviewCount: number;
  orderAcceptanceEnabled: boolean;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  openingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  currency: string;
  taxRatePercent: number; // e.g. 18% VAT or 7% catering rate (configurable)
  estimatedPrepMinutes: number;
  stripeTestMode: boolean;
  stripePublishableKeyConfigured: boolean;
  socialLinks: {
    facebook: string;
    instagram: string;
  };
}

export interface ContactEnquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
}
