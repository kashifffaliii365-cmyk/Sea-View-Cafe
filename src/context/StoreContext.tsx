import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductVariant,
  ProductExtra,
  Category,
  CartItem,
  Order,
  OrderStatus,
  OrderType,
  PaymentMethod,
  DeliveryZone,
  Offer,
  GalleryPhoto,
  BusinessSettings,
  ContactEnquiry,
  OrderCustomerInfo,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_OFFERS,
  INITIAL_GALLERY,
} from '../data/initialData';
import { calculateOrderTotals } from '../lib/order-pricing';
import {
  dispatchOrderStatusNotification,
  AppNotification,
  registerServiceWorker,
} from '../lib/pushNotifications';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface StoreContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariant?: ProductVariant,
    selectedExtras?: ProductExtra[],
    itemNotes?: string
  ) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;

  // Order Config & Checkout
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  appliedOffer: Offer | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Orders
  orders: Order[];
  createOrder: (
    customer: OrderCustomerInfo,
    paymentMethod: PaymentMethod,
    scheduledTime?: string
  ) => { success: boolean; orderId?: string; orderNumber?: string; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Settings & Gallery & Offers & Enquiries
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  toggleOffer: (id: string) => void;
  deleteOffer: (id: string) => void;
  enquiries: ContactEnquiry[];
  submitEnquiry: (enquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'isRead'>) => void;
  markEnquiryRead: (id: string) => void;

  // Staff Auth
  isAuthenticated: boolean;
  staffUser: { email: string; name: string; role: string } | null;
  loginStaff: (email: string, pass: string) => boolean;
  logoutStaff: () => void;

  // Push Notifications
  activeNotification: AppNotification | null;
  notifications: AppNotification[];
  closeNotification: () => void;
  triggerTestNotification: (order?: Order) => Promise<void>;

  // Cookies
  cookieConsentGiven: boolean;
  cookiePreferences: CookiePreferences;
  saveCookieConsent: (prefs: CookiePreferences) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SV-2026-1042',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    orderType: 'pickup',
    status: 'preparing',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(), note: 'Order placed online' },
      { status: 'accepted', timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), note: 'Accepted by kitchen staff' },
      { status: 'preparing', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), note: 'In the grill & fryer' },
    ],
    customer: {
      fullName: 'Anthony Grech',
      email: 'anthony.grech@maltanet.com',
      phone: '+356 7922 4118',
      notes: 'Please pack sauces separately.',
    },
    items: [
      {
        id: 'ci-1',
        productId: 'prod-say-cheese',
        productName: 'Say Cheese Burger',
        productSlug: 'say-cheese-burger',
        productImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        unitPrice: 12.50,
        selectedExtras: [{ id: 'ext-bacon', name: 'Crispy Smoked Bacon', price: 1.50 }],
        quantity: 1,
        calculatedItemTotal: 14.00,
      },
      {
        id: 'ci-2',
        productId: 'prod-cisk-lager',
        productName: 'Cisk Lager Beer (330ml / Pint)',
        productSlug: 'cisk-lager-beer',
        productImage: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
        unitPrice: 3.50,
        selectedExtras: [],
        quantity: 2,
        calculatedItemTotal: 7.00,
      }
    ],
    subtotal: 21.00,
    deliveryFee: 0,
    discount: 0,
    total: 21.00,
    paymentMethod: 'pay_at_pickup',
    paymentStatus: 'pending',
    scheduledTime: 'asap',
  },
  {
    id: 'ord-1002',
    orderNumber: 'SV-2026-1041',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    orderType: 'delivery',
    status: 'completed',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString() },
      { status: 'accepted', timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString() },
      { status: 'preparing', timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString() },
      { status: 'out_for_delivery', timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() },
      { status: 'completed', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: 'Delivered to customer' },
    ],
    customer: {
      fullName: 'Elena Borg',
      email: 'elena.borg@gmail.com',
      phone: '+356 9945 1092',
      addressLine1: 'Flat 4, Blue Waters Court, Triq il-Kbira',
      locality: 'Il-Mellieħa',
      postalCode: 'MLH 1024',
      deliveryInstructions: 'Ring bell for Flat 4 on 2nd floor.',
    },
    items: [
      {
        id: 'ci-3',
        productId: 'prod-maltese-ravioli',
        productName: 'Maltese Ricotta Ravioli (Ravjul)',
        productSlug: 'maltese-ravioli',
        productImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        unitPrice: 13.50,
        selectedExtras: [],
        quantity: 2,
        calculatedItemTotal: 27.00,
      },
      {
        id: 'ci-4',
        productId: 'prod-kinnie',
        productName: "Kinnie (Malta's Bitter Orange Drink)",
        productSlug: 'kinnie-soft-drink',
        productImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        unitPrice: 2.80,
        selectedExtras: [],
        quantity: 2,
        calculatedItemTotal: 5.60,
      }
    ],
    subtotal: 32.60,
    deliveryFee: 2.50,
    discount: 0,
    total: 35.10,
    paymentMethod: 'test_card',
    paymentStatus: 'paid',
    scheduledTime: 'asap',
  }
];

const sanitizeImageUrl = (url: string) => {
  if (!url || url.includes('1579208575657')) {
    return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80';
  }
  return url;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => ({ ...p, image: sanitizeImageUrl(p.image) }));
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_categories');
      if (saved) {
        const parsed: Category[] = JSON.parse(saved);
        return parsed.map((c) => ({ ...c, image: sanitizeImageUrl(c.image) }));
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({ ...item, productImage: sanitizeImageUrl(item.productImage) }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Order Type & Zone
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [deliveryZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(INITIAL_DELIVERY_ZONES[0]);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_orders');
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem('seaview_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Gallery
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_gallery');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // Offers
  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_offers');
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  // Contact enquiries
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_enquiries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'enq-1',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          name: 'Sarah Camilleri',
          email: 'sarah.c@maltamail.com',
          phone: '+356 7901 8844',
          subject: 'Terrace Table for 6 on Sunday morning',
          message: 'Hello, we would love to have breakfast on your terrace overlooking Mellieħa bay this coming Sunday around 10:00 AM. Do we need an advance table booking?',
          isRead: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Staff Authentication
  const [staffUser, setStaffUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('seaview_staff');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Push Notifications state
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('seaview_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cookies state
  const [cookieConsentGiven, setCookieConsentGiven] = useState<boolean>(() => {
    return localStorage.getItem('seaview_cookies_consent') === 'true';
  });
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(() => {
    try {
      const saved = localStorage.getItem('seaview_cookies_prefs');
      return saved ? JSON.parse(saved) : { essential: true, analytics: false, marketing: false };
    } catch {
      return { essential: true, analytics: false, marketing: false };
    }
  });

  // Register service worker for web push notifications
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('seaview_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('seaview_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('seaview_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('seaview_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('seaview_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('seaview_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('seaview_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('seaview_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    if (staffUser) {
      localStorage.setItem('seaview_staff', JSON.stringify(staffUser));
    } else {
      localStorage.removeItem('seaview_staff');
    }
  }, [staffUser]);

  // Product operations
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: ProductVariant,
    selectedExtras: ProductExtra[] = [],
    itemNotes?: string
  ) => {
    let unitPrice = product.price;
    if (selectedVariant) {
      unitPrice += selectedVariant.priceDelta;
    }
    const extrasPrice = (selectedExtras || []).reduce((sum, e) => sum + e.price, 0);
    const itemTotal = (unitPrice + extrasPrice) * quantity;

    // Check if duplicate item with exact same variant, extras, and note exists
    const variantId = selectedVariant?.id || '';
    const extrasIds = (selectedExtras || []).map((e) => e.id).sort().join(',');

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => {
        const itemVarId = item.selectedVariant?.id || '';
        const itemExtrasIds = (item.selectedExtras || []).map((e) => e.id).sort().join(',');
        return (
          item.productId === product.id &&
          itemVarId === variantId &&
          itemExtrasIds === extrasIds &&
          (item.itemNotes || '') === (itemNotes || '')
        );
      });

      if (existingIdx >= 0) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          calculatedItemTotal: Number(((existing.unitPrice + extrasPrice) * newQty).toFixed(2)),
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.image,
        unitPrice,
        selectedVariant,
        selectedExtras: selectedExtras || [],
        quantity,
        itemNotes,
        calculatedItemTotal: Number(itemTotal.toFixed(2)),
      };

      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
          return {
            ...item,
            quantity,
            calculatedItemTotal: Number(((item.unitPrice + extrasTotal) * quantity).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Promo Code
  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const offer = offers.find((o) => o.code.toUpperCase() === trimmed && o.isActive);
    if (!offer) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    setAppliedOffer(offer);
    return {
      success: true,
      message: `Applied ${offer.title} (${offer.discountType === 'percentage' ? `${offer.discountValue}% off` : `€${offer.discountValue} off`})`,
    };
  };

  const removePromoCode = () => {
    setAppliedOffer(null);
  };

  // Order creation with server-equivalent validation
  const createOrder = (
    customer: OrderCustomerInfo,
    paymentMethod: PaymentMethod,
    scheduledTime = 'asap'
  ): { success: boolean; orderId?: string; orderNumber?: string; error?: string } => {
    if (!settings.orderAcceptanceEnabled) {
      return {
        success: false,
        error: 'Sea View Cafe/Bar is currently not accepting online orders. Please call us directly at +356 2704 2230.',
      };
    }

    if (orderType === 'pickup' && !settings.pickupEnabled) {
      return { success: false, error: 'Pickup ordering is currently disabled.' };
    }
    if (orderType === 'delivery' && !settings.deliveryEnabled) {
      return { success: false, error: 'Delivery ordering is currently disabled.' };
    }

    // Run pricing validation against canonical product list
    const pricing = calculateOrderTotals(
      cart,
      products,
      orderType,
      selectedZone,
      appliedOffer,
      settings.taxRatePercent
    );

    if (!pricing.isValid) {
      return { success: false, error: pricing.validationError || 'Order calculation failed.' };
    }

    const orderId = `ord-${Date.now()}`;
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SV-2026-${randomSeq}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      orderType,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order submitted online by customer',
        },
      ],
      customer,
      items: pricing.items,
      subtotal: pricing.subtotal,
      deliveryFee: pricing.deliveryFee,
      discount: pricing.discount,
      total: pricing.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'test_card' ? 'paid' : 'pending',
      scheduledTime,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedOffer(null);

    // Dispatch initial order confirmation push notification
    dispatchOrderStatusNotification(newOrder, 'pending').then((notif) => {
      setActiveNotification(notif);
      setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
      setTimeout(() => {
        setActiveNotification((cur) => (cur?.id === notif.id ? null : cur));
      }, 7000);
    });

    return { success: true, orderId, orderNumber };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    let targetedOrder: Order | null = null;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const newHistory = [
            ...order.statusHistory,
            { status, timestamp: new Date().toISOString(), note },
          ];
          const updated: Order = {
            ...order,
            status,
            statusHistory: newHistory,
            ...(status === 'cancelled' && note ? { cancellationReason: note } : {}),
          };
          targetedOrder = updated;
          return updated;
        }
        return order;
      })
    );

    // If order was updated, fire push notification with sound and in-app toast
    if (targetedOrder) {
      dispatchOrderStatusNotification(targetedOrder, status).then((notif) => {
        setActiveNotification(notif);
        setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
        setTimeout(() => {
          setActiveNotification((cur) => (cur?.id === notif.id ? null : cur));
        }, 7000);
      });
    }
  };

  const closeNotification = () => {
    setActiveNotification(null);
  };

  const triggerTestNotification = async (order?: Order) => {
    const fallbackOrder: Order = order || (orders.length > 0 ? orders[0] : {
      id: 'ord-test',
      orderNumber: 'SV-2026-TEST',
      createdAt: new Date().toISOString(),
      orderType: 'delivery',
      status: 'preparing',
      statusHistory: [],
      customer: { fullName: 'Valued Guest', email: 'guest@example.com', phone: '+356 2704 2230', locality: 'Il-Mellieħa' },
      items: [],
      subtotal: 18.00,
      deliveryFee: 2.50,
      discount: 0,
      total: 20.50,
      paymentMethod: 'test_card',
      paymentStatus: 'paid',
      scheduledTime: 'asap'
    });

    const notif = await dispatchOrderStatusNotification(fallbackOrder, fallbackOrder.status === 'pending' ? 'preparing' : fallbackOrder.status);
    setActiveNotification(notif);
    setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
    setTimeout(() => {
      setActiveNotification((cur) => (cur?.id === notif.id ? null : cur));
    }, 7000);
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) =>
    orders.find((o) => o.orderNumber.trim().toUpperCase() === orderNumber.trim().toUpperCase());

  // Settings
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Gallery
  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const id = `gal-${Date.now()}`;
    setGallery((prev) => [{ ...photo, id }, ...prev]);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery((prev) => prev.filter((p) => p.id !== id));
  };

  // Offers
  const addOffer = (newOffer: Omit<Offer, 'id'>) => {
    const id = `off-${Date.now()}`;
    setOffers((prev) => [{ ...newOffer, id }, ...prev]);
  };

  const toggleOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  // Enquiries
  const submitEnquiry = (enquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'isRead'>) => {
    const newEnquiry: ContactEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
  };

  const markEnquiryRead = (id: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
  };

  // Staff Auth
  const loginStaff = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    // Default authorized staff credentials
    if (cleanEmail === 'staff@seaviewmalta.com' && pass === 'Mellieha2026!') {
      const user = {
        email: cleanEmail,
        name: 'Mellieħa Operations Staff',
        role: 'manager',
      };
      setStaffUser(user);
      return true;
    }
    // Also allow any demo login with "staff" or "admin" if password is "password" or "admin"
    if ((cleanEmail.includes('admin') || cleanEmail.includes('staff')) && (pass === 'admin' || pass === 'password' || pass === 'seaview')) {
      const user = {
        email: cleanEmail,
        name: 'Sea View Duty Manager',
        role: 'manager',
      };
      setStaffUser(user);
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setStaffUser(null);
  };

  // Cookies
  const saveCookieConsent = (prefs: CookiePreferences) => {
    setCookiePreferences(prefs);
    setCookieConsentGiven(true);
    localStorage.setItem('seaview_cookies_consent', 'true');
    localStorage.setItem('seaview_cookies_prefs', JSON.stringify(prefs));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        orderType,
        setOrderType,
        deliveryZones,
        selectedZone,
        setSelectedZone,
        appliedOffer,
        applyPromoCode,
        removePromoCode,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrderByNumber,
        settings,
        updateSettings,
        gallery,
        addGalleryPhoto,
        deleteGalleryPhoto,
        offers,
        addOffer,
        toggleOffer,
        deleteOffer,
        enquiries,
        submitEnquiry,
        markEnquiryRead,
        isAuthenticated: !!staffUser,
        staffUser,
        loginStaff,
        logoutStaff,
        activeNotification,
        notifications,
        closeNotification,
        triggerTestNotification,
        cookieConsentGiven,
        cookiePreferences,
        saveCookieConsent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
