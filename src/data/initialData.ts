import {
  Product,
  Category,
  BusinessSettings,
  DeliveryZone,
  Offer,
  GalleryPhoto
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-breakfast',
    slug: 'breakfast',
    name: 'Breakfast',
    description: 'Traditional cooked breakfasts, morning toasties and eggs served seaside.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
  },
  {
    id: 'cat-coffee',
    slug: 'coffee-and-hot-drinks',
    name: 'Coffee & Hot Drinks',
    description: 'Freshly extracted espresso, Maltese spiced coffee, and herbal infusions.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
  },
  {
    id: 'cat-cold-drinks',
    slug: 'cold-drinks-and-milkshakes',
    name: 'Cold Drinks & Milkshakes',
    description: 'Thick hand-spun milkshakes, iced coffee, smoothies, and Maltese Kinnie.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
  },
  {
    id: 'cat-burgers',
    slug: 'burgers-and-hot-dogs',
    name: 'Burgers & Hot Dogs',
    description: 'Flame-grilled beef burgers, melted cheddar and loaded hot dogs.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
  },
  {
    id: 'cat-wraps',
    slug: 'wraps-and-sandwiches',
    name: 'Wraps & Sandwiches',
    description: 'Toasted wraps and crusty Maltese bread loaded with fresh Mediterranean fillings.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
  },
  {
    id: 'cat-fish',
    slug: 'fish-and-chips',
    name: 'Fish & Chips',
    description: 'Crispy golden battered fish fillet served with chunky potato chips and tartar sauce.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
  },
  {
    id: 'cat-maltese',
    slug: 'maltese-specialities',
    name: 'Maltese Specialities',
    description: 'Authentic local flavours including traditional ricotta ravioli and Ħobż biż-Żejt.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    displayOrder: 7,
  },
  {
    id: 'cat-snacks',
    slug: 'snacks-and-toasties',
    name: 'Snacks & Toasties',
    description: 'Quick bites, golden toasted sandwiches, and light savoury dishes.',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80',
    displayOrder: 8,
  },
  {
    id: 'cat-desserts',
    slug: 'desserts-and-muffins',
    name: 'Desserts & Muffins',
    description: 'Baked pastries, rich chocolate brownies, muffins, and artisan doughnuts.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    displayOrder: 9,
  },
  {
    id: 'cat-beer',
    slug: 'beer-and-alcoholic-drinks',
    name: 'Beer & Alcoholic Drinks',
    description: 'Cold Maltese Cisk lager on draught, bottled international beers and ciders.',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
    displayOrder: 10,
  },
  {
    id: 'cat-cocktails',
    slug: 'cocktails-and-prosecco',
    name: 'Cocktails & Prosecco',
    description: 'Chilled Italian Prosecco by the glass or bottle, Spritz, and Piña Colada.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    displayOrder: 11,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-full-monty',
    slug: 'full-monty-breakfast',
    name: 'Full Monty Breakfast',
    category: 'cat-breakfast',
    price: 11.50,
    description: 'Cumberland pork sausages, grilled back bacon, fried free-range eggs, baked beans, grilled tomato, hash brown, and toasted Maltese bread with butter.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Gluten', 'Eggs', 'Dairy'],
    dietaryTags: [],
    variants: [
      { id: 'var-standard', name: 'Standard', priceDelta: 0 },
      { id: 'var-large', name: 'Hungry Sailor (+ extra sausage & egg)', priceDelta: 2.50 }
    ],
    extras: [
      { id: 'ext-mushrooms', name: 'Garlic Butter Mushrooms', price: 1.50 },
      { id: 'ext-toast', name: 'Extra Slice of Maltese Sourdough', price: 0.90 }
    ],
    preparationMinutes: 15,
  },
  {
    id: 'prod-say-cheese',
    slug: 'say-cheese-burger',
    name: 'Say Cheese Burger',
    category: 'cat-burgers',
    price: 12.50,
    description: 'Prime beef patty, melted mature cheddar cheese, crisp iceberg lettuce, sliced plum tomato, red onion relish, served with a portion of crunchy fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Gluten', 'Dairy', 'Mustard'],
    dietaryTags: [],
    variants: [
      { id: 'var-single', name: 'Single 180g Patty', priceDelta: 0 },
      { id: 'var-double', name: 'Double Patty (+180g)', priceDelta: 3.50 }
    ],
    extras: [
      { id: 'ext-bacon', name: 'Crispy Smoked Bacon', price: 1.50 },
      { id: 'ext-cheese', name: 'Double Cheddar Slice', price: 1.00 }
    ],
    preparationMinutes: 18,
  },
  {
    id: 'prod-maltese-sandwich',
    slug: 'maltese-sandwich',
    name: 'Traditional Maltese Sandwich (Ħobż biż-Żejt)',
    category: 'cat-maltese',
    price: 8.50,
    description: 'Crusty traditional Maltese sourdough bread rubbed with rich kunserva (sweet tomato paste), layered with skipjack tuna, capers, olives, red onion, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Gluten', 'Fish'],
    dietaryTags: ['Pescatarian'],
    extras: [
      { id: 'ext-gbejna', name: 'Add Crumbled Maltese Peppered Ġbejna', price: 1.50 }
    ],
    preparationMinutes: 10,
  },
  {
    id: 'prod-maltese-ravioli',
    slug: 'maltese-ravioli',
    name: 'Maltese Ricotta Ravioli (Ravjul)',
    category: 'cat-maltese',
    price: 13.50,
    description: 'Handmade pasta parcels filled with fresh Gozitan ricotta and parsley, tossed in a slow-simmered Maltese garlic and sweet tomato sauce, finished with grated sheep cheese.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    dietaryTags: ['Vegetarian'],
    extras: [
      { id: 'ext-parm', name: 'Extra Grated Cheese', price: 1.00 }
    ],
    preparationMinutes: 20,
  },
  {
    id: 'prod-fish-and-chips',
    slug: 'fish-and-chips',
    name: 'Classic Fish & Chips',
    category: 'cat-fish',
    price: 14.50,
    description: 'Deep-fried golden battered white cod fillet, served with thick sea-salted chips, garden peas, lemon wedge, and house tartar sauce.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Fish', 'Gluten', 'Eggs'],
    dietaryTags: ['Pescatarian'],
    extras: [
      { id: 'ext-curry', name: 'Side Curry Sauce', price: 1.20 }
    ],
    preparationMinutes: 18,
  },
  {
    id: 'prod-hot-dog',
    slug: 'hot-dog',
    name: 'Café Grilled Hot Dog',
    category: 'cat-burgers',
    price: 7.50,
    description: 'Jumbo grilled frankfurter in a toasted brioche roll, topped with sautéed onions, yellow mustard, and tomato ketchup. Served with salted crisps.',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Gluten', 'Mustard'],
    extras: [
      { id: 'ext-cheese-hd', name: 'Melted Cheddar Sauce', price: 1.00 },
      { id: 'ext-fries', name: 'Upgrade to Hot Chips', price: 2.00 }
    ],
    preparationMinutes: 12,
  },
  {
    id: 'prod-wraps-chicken',
    slug: 'mediterranean-chicken-wrap',
    name: 'Grilled Chicken & Herb Wrap',
    category: 'cat-wraps',
    price: 8.90,
    description: 'Marinated grilled chicken breast slices, mixed salad leaves, sliced cucumber, cherry tomatoes, and garlic herb yogurt dressing folded in a warm flour tortilla.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Gluten', 'Dairy'],
    extras: [
      { id: 'ext-avocado', name: 'Fresh Avocado', price: 1.50 }
    ],
    preparationMinutes: 12,
  },
  {
    id: 'prod-toastie',
    slug: 'ham-and-cheese-toastie',
    name: 'Ham & Melted Cheddar Toastie',
    category: 'cat-snacks',
    price: 5.50,
    description: 'Thick white sliced bread toasted with Wiltshire ham and mature English cheddar cheese. Served with side crisps.',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Gluten', 'Dairy'],
    preparationMinutes: 8,
  },
  {
    id: 'prod-maltese-coffee',
    slug: 'maltese-coffee',
    name: 'Traditional Maltese Coffee (Kafe tal-Istrinġ)',
    category: 'cat-coffee',
    price: 3.80,
    description: 'Hot aromatic coffee brewed with roasted chicory, crushed aniseed and a hint of cloves. Served in a glass cup with brown cane sugar.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: [],
    dietaryTags: ['Vegan', 'Gluten-Free'],
    preparationMinutes: 5,
  },
  {
    id: 'prod-iced-coffee',
    slug: 'iced-coffee',
    name: 'Chilled Iced Coffee',
    category: 'cat-coffee',
    price: 4.00,
    description: 'Double espresso shaken vigorously over ice with whole milk and light sugar syrup.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Dairy'],
    variants: [
      { id: 'var-dairy', name: 'Whole Dairy Milk', priceDelta: 0 },
      { id: 'var-oat', name: 'Oat Milk Alternative', priceDelta: 0.60 }
    ],
    preparationMinutes: 4,
  },
  {
    id: 'prod-cisk-lager',
    slug: 'cisk-lager-beer',
    name: 'Cisk Lager Beer (330ml / Pint)',
    category: 'cat-beer',
    price: 3.50,
    description: "Malta's iconic golden lager brewed by Simonds Farsons Cisk since 1928. Crisp, refreshing, with a distinct bitter hop aroma, best enjoyed seaside.",
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Gluten (Barley)'],
    variants: [
      { id: 'var-bottle', name: '330ml Chilled Bottle', priceDelta: 0 },
      { id: 'var-pint', name: '500ml Draught Pint', priceDelta: 1.50 }
    ],
    preparationMinutes: 2,
  },
  {
    id: 'prod-prosecco',
    slug: 'prosecco-doc',
    name: 'Prosecco DOC Extra Dry',
    category: 'cat-cocktails',
    price: 6.00,
    description: 'Chilled sparkling Italian wine from Veneto with delicate aromas of green apple, wisteria and citrus. Perfect for afternoon coastal drinks.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Sulphites'],
    variants: [
      { id: 'var-glass', name: 'Chilled Flute Glass (150ml)', priceDelta: 0 },
      { id: 'var-bottle-pro', name: 'Full 750ml Bottle on Ice', priceDelta: 18.00 }
    ],
    preparationMinutes: 3,
  },
  {
    id: 'prod-pina-colada',
    slug: 'pina-colada-cocktail',
    name: 'Piña Colada Cocktail',
    category: 'cat-cocktails',
    price: 8.50,
    description: 'White Caribbean rum blended with rich coconut cream and fresh pineapple juice, served over crushed ice with a pineapple wedge and maraschino cherry.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPopular: true,
    allergens: ['Dairy'],
    preparationMinutes: 6,
  },
  {
    id: 'prod-milkshake-toffee',
    slug: 'toffee-milkshake',
    name: 'Toffee Caramel Milkshake',
    category: 'cat-cold-drinks',
    price: 5.50,
    description: 'Artisan vanilla ice cream blended with rich English toffee fudge sauce, fresh cold milk, crowned with whipped dairy cream and caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Dairy'],
    preparationMinutes: 5,
  },
  {
    id: 'prod-milkshake-chocolate',
    slug: 'chocolate-milkshake',
    name: 'Double Belgian Chocolate Milkshake',
    category: 'cat-cold-drinks',
    price: 5.50,
    description: 'Creamy chocolate gelato churned with milk and dark chocolate ganache, topped with whipped cream and chocolate curls.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Dairy'],
    preparationMinutes: 5,
  },
  {
    id: 'prod-brownies',
    slug: 'belgian-chocolate-brownie',
    name: 'Warm Belgian Chocolate Brownie',
    category: 'cat-desserts',
    price: 4.50,
    description: 'Dense dark chocolate brownie baked with chocolate chunks, warmed and dusted with icing sugar. Optional scoop of vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    extras: [
      { id: 'ext-ice-cream', name: 'Scoop of Vanilla Gelato', price: 1.50 }
    ],
    preparationMinutes: 4,
  },
  {
    id: 'prod-lemon-muffin',
    slug: 'lemon-muffin',
    name: 'Citrus Lemon & Poppy Muffin',
    category: 'cat-desserts',
    price: 3.80,
    description: 'Freshly baked zesty Mediterranean lemon muffin with a soft curd center and a crisp sugared crust.',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    preparationMinutes: 2,
  },
  {
    id: 'prod-doughnut',
    slug: 'chocolate-doughnut',
    name: 'Glazed Chocolate Doughnut',
    category: 'cat-desserts',
    price: 3.50,
    description: 'Fluffy yeast ring doughnut coated in glossy dark chocolate glaze and sprinkles.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    preparationMinutes: 2,
  },
  {
    id: 'prod-kinnie',
    slug: 'kinnie-soft-drink',
    name: "Kinnie (Malta's Bitter Orange Drink)",
    category: 'cat-cold-drinks',
    price: 2.80,
    description: "The unique Maltese bittersweet carbonated soft drink brewed with bitter chinotto oranges and aromatic wormwood herbs. Served chilled with a slice of fresh orange.",
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    allergens: [],
    dietaryTags: ['Vegan', 'Gluten-Free'],
    preparationMinutes: 2,
  }
];

export const INITIAL_SETTINGS: BusinessSettings = {
  businessName: 'Sea View Cafe/Bar',
  address: 'Triq Salvinu Vella',
  locality: 'Il-Mellieħa',
  country: 'Malta',
  phone: '+356 2704 2230',
  email: 'info@seaviewmalta.com',
  coordinates: {
    lat: 35.9587,
    lng: 14.3644
  },
  googleRating: 4.5,
  googleReviewCount: 3332,
  orderAcceptanceEnabled: true,
  pickupEnabled: true,
  deliveryEnabled: true,
  openingHours: {
    monday: { open: '08:00', close: '22:00', isOpen: true },
    tuesday: { open: '08:00', close: '22:00', isOpen: true },
    wednesday: { open: '08:00', close: '22:00', isOpen: true },
    thursday: { open: '08:00', close: '22:00', isOpen: true },
    friday: { open: '08:00', close: '23:00', isOpen: true },
    saturday: { open: '08:00', close: '23:00', isOpen: true },
    sunday: { open: '08:00', close: '22:00', isOpen: true },
  },
  currency: 'EUR',
  taxRatePercent: 18.0, // Malta standard VAT
  estimatedPrepMinutes: 20,
  stripeTestMode: true,
  stripePublishableKeyConfigured: false,
  socialLinks: {
    facebook: 'https://www.facebook.com/seaviewcafemellieha',
    instagram: 'https://www.instagram.com/seaviewcafemellieha',
  }
};

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-mellieha',
    name: 'Il-Mellieħa (Village & Mellieħa Bay)',
    postalPrefix: 'MLH',
    minOrder: 15.00,
    fee: 2.50,
    estimatedMinutes: '25–40 mins',
    isActive: true,
  },
  {
    id: 'zone-manikata',
    name: 'Manikata & Golden Bay Area',
    postalPrefix: 'MNK',
    minOrder: 20.00,
    fee: 3.50,
    estimatedMinutes: '35–50 mins',
    isActive: true,
  },
  {
    id: 'zone-xemxija',
    name: 'Xemxija & St. Paul’s Bay Ridge',
    postalPrefix: 'SPB',
    minOrder: 25.00,
    fee: 4.50,
    estimatedMinutes: '40–60 mins',
    isActive: true,
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-morning',
    title: 'Mellieħa Morning Sunrise',
    code: 'SUNRISE10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 20.00,
    description: '10% off any breakfast or morning coffee orders placed before 11:30 AM.',
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'off-seaside',
    title: 'Seaside Family Meal',
    code: 'SEASIDE5',
    discountType: 'fixed',
    discountValue: 5.00,
    minSpend: 40.00,
    description: '€5.00 discount on pickup orders over €40.00.',
    validUntil: '2026-12-31',
    isActive: true,
  }
];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Panoramic Mellieħa Coastline',
    category: 'coastal_views',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    caption: 'Uninterrupted panoramic views across the turquoise Mediterranean waters of northern Malta.',
    isAuthenticMellieha: true,
  },
  {
    id: 'gal-2',
    title: 'Outdoor Terrace Seating',
    category: 'seating',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Open-air shaded terrace overlooking the bay, catching the morning sea breeze.',
    isAuthenticMellieha: true,
  },
  {
    id: 'gal-3',
    title: 'Seaside Breakfast Setup',
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80',
    caption: 'Hearty Full Monty breakfast and warm toasted bread served fresh daily.',
    isAuthenticMellieha: true,
  },
  {
    id: 'gal-4',
    title: 'Chilled Draught Cisk & Cocktails',
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crisp cold drinks and afternoon cocktails under the Maltese sun.',
    isAuthenticMellieha: true,
  },
  {
    id: 'gal-5',
    title: 'Golden Sunset over Triq Salvinu Vella',
    category: 'coastal_views',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Evening amber glow casting across Mellieħa cliffs and waters.',
    isAuthenticMellieha: true,
  },
  {
    id: 'gal-6',
    title: 'Fresh Coffee & Morning Pastries',
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    caption: 'Locally infused Maltese coffee and sweet baked treats.',
    isAuthenticMellieha: true,
  }
];

export const INITIAL_FAQS = [
  {
    question: 'Where is Sea View Cafe/Bar located?',
    answer: 'We are situated along Triq Salvinu Vella in Il-Mellieħa, Malta, offering open panoramic views of the northern Maltese coast.',
    category: 'Location'
  },
  {
    question: 'Do you offer online ordering for pickup and delivery?',
    answer: 'Yes! You can order online directly through this website for quick counter pickup or local delivery to designated Mellieħa, Manikata, and northern bay areas when our kitchen is open.',
    category: 'Orders'
  },
  {
    question: 'How do you handle food allergens?',
    answer: 'Each menu item clearly lists allergens such as Gluten, Dairy, Eggs, Fish, and Mustard. If you have severe allergies or celiac requirements, please add a note in your order or contact our staff directly by phone before ordering.',
    category: 'Food'
  },
  {
    question: 'Can I pay online with a credit card or in cash upon collection?',
    answer: 'We support card payments as well as payment at pickup or upon delivery (cash or contactless card).',
    category: 'Payment'
  },
  {
    question: 'Is there parking available nearby?',
    answer: 'Street parking is accessible along Triq Salvinu Vella and adjoining public bays in Mellieħa.',
    category: 'Location'
  },
  {
    question: 'Are pets allowed on the terrace?',
    answer: 'Well-behaved dogs on leashes are warmly welcomed on our open-air terrace seating area.',
    category: 'Terrace'
  }
];
