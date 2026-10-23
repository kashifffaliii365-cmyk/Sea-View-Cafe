import { CartItem, Product, DeliveryZone, Offer } from '../types';

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('en-MT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface PricingCalculationResult {
  isValid: boolean;
  validationError?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxAmount: number; // Included VAT breakdown
  total: number;
}

export function calculateOrderTotals(
  cartItems: CartItem[],
  canonicalProducts: Product[],
  orderType: 'pickup' | 'delivery',
  selectedZone: DeliveryZone | null,
  appliedOffer: Offer | null,
  taxRatePercent: number = 18.0
): PricingCalculationResult {
  if (!cartItems || cartItems.length === 0) {
    return {
      isValid: false,
      validationError: 'Cart is empty',
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      taxAmount: 0,
      total: 0,
    };
  }

  let subtotal = 0;
  const verifiedItems: CartItem[] = [];

  for (const item of cartItems) {
    const product = canonicalProducts.find((p) => p.id === item.productId);
    if (!product) {
      return {
        isValid: false,
        validationError: `Product "${item.productName}" is no longer available on our menu.`,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        taxAmount: 0,
        total: 0,
      };
    }

    if (!product.isAvailable) {
      return {
        isValid: false,
        validationError: `"${product.name}" is currently sold out. Please remove it from your cart.`,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        taxAmount: 0,
        total: 0,
      };
    }

    let unitPrice = product.price;

    // Check variant
    if (item.selectedVariant) {
      const canonicalVariant = product.variants?.find((v) => v.id === item.selectedVariant?.id);
      if (canonicalVariant) {
        unitPrice += canonicalVariant.priceDelta;
      }
    }

    // Check extras
    let extrasTotal = 0;
    const verifiedExtras = [];
    if (item.selectedExtras && item.selectedExtras.length > 0) {
      for (const extra of item.selectedExtras) {
        const canonicalExtra = product.extras?.find((e) => e.id === extra.id);
        if (canonicalExtra) {
          extrasTotal += canonicalExtra.price;
          verifiedExtras.push(canonicalExtra);
        }
      }
    }

    const itemTotal = (unitPrice + extrasTotal) * item.quantity;
    subtotal += itemTotal;

    verifiedItems.push({
      ...item,
      unitPrice,
      selectedExtras: verifiedExtras,
      calculatedItemTotal: Number(itemTotal.toFixed(2)),
    });
  }

  subtotal = Number(subtotal.toFixed(2));

  // Check delivery minimum spend
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    if (!selectedZone) {
      return {
        isValid: false,
        validationError: 'Please select a valid delivery zone.',
        items: verifiedItems,
        subtotal,
        deliveryFee: 0,
        discount: 0,
        taxAmount: 0,
        total: subtotal,
      };
    }

    if (subtotal < selectedZone.minOrder) {
      return {
        isValid: false,
        validationError: `Minimum order for ${selectedZone.name} is ${formatEUR(selectedZone.minOrder)}. Current subtotal: ${formatEUR(subtotal)}.`,
        items: verifiedItems,
        subtotal,
        deliveryFee: selectedZone.fee,
        discount: 0,
        taxAmount: 0,
        total: subtotal + selectedZone.fee,
      };
    }

    deliveryFee = selectedZone.fee;
  }

  // Calculate discount
  let discount = 0;
  if (appliedOffer && appliedOffer.isActive) {
    if (!appliedOffer.minSpend || subtotal >= appliedOffer.minSpend) {
      if (appliedOffer.discountType === 'percentage') {
        discount = Number(((subtotal * appliedOffer.discountValue) / 100).toFixed(2));
      } else {
        discount = Math.min(appliedOffer.discountValue, subtotal);
      }
    }
  }

  const taxableTotal = Math.max(0, subtotal - discount + deliveryFee);
  // In Malta, food & catering is VAT inclusive. Extract the VAT portion for receipt clarity:
  const taxRate = taxRatePercent / 100;
  const taxAmount = Number(((taxableTotal * taxRate) / (1 + taxRate)).toFixed(2));
  const finalTotal = Number(taxableTotal.toFixed(2));

  return {
    isValid: true,
    items: verifiedItems,
    subtotal,
    deliveryFee,
    discount,
    taxAmount,
    total: finalTotal,
  };
}
