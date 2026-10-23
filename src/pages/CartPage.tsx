import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR, calculateOrderTotals } from '../lib/order-pricing';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    appliedOffer,
    applyPromoCode,
    removePromoCode,
    settings,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Validate calculation using canonical pricing engine
  const pricing = calculateOrderTotals(
    cart,
    products,
    orderType,
    selectedZone,
    appliedOffer,
    settings.taxRatePercent
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#FAF7F0] rounded-full flex items-center justify-center mx-auto text-[#123B52] border border-[#123B52]/10">
          <Tag className="w-8 h-8 opacity-60" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#123B52]">Your Order Bag is Empty</h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          You have not added any items yet. Explore our cooked breakfasts, sandwiches, fish & chips, draught beers, and desserts.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#123B52] hover:bg-[#287D91] text-white text-xs uppercase tracking-wider font-semibold rounded-md transition-colors shadow-sm"
        >
          <span>Explore Full Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
            Sea View Cafe/Bar · Order Review
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#123B52] mt-1">
            Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 transition-colors self-start sm:self-auto font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
            >
              <img
                src={item.productImage}
                alt={item.productName}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('1533089860892')) {
                    target.src = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80';
                  }
                }}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="font-serif text-base font-bold text-[#123B52] hover:text-[#287D91] transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <span className="font-bold text-sm text-[#123B52] font-sans">
                    {formatEUR(item.calculatedItemTotal)}
                  </span>
                </div>

                {item.selectedVariant && (
                  <p className="text-xs text-[#287D91] mt-0.5">
                    Option: {item.selectedVariant.name}
                  </p>
                )}

                {item.selectedExtras && item.selectedExtras.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                  </p>
                )}

                {item.itemNotes && (
                  <p className="text-xs text-gray-500 italic mt-0.5">
                    Note: "{item.itemNotes}"
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#123B52] hover:text-[#287D91]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Adding Items</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Configuration & Summary */}
        <div className="space-y-6">
          {/* Order Type Selector */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#123B52]">
              Fulfillment Method
            </h3>

            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2 rounded-md transition-all ${
                  orderType === 'pickup'
                    ? 'bg-white text-[#123B52] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Collection
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 rounded-md transition-all ${
                  orderType === 'delivery'
                    ? 'bg-white text-[#123B52] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Delivery
              </button>
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700">
                  Select Delivery Zone:
                </label>
                <select
                  value={selectedZone?.id || ''}
                  onChange={(e) => {
                    const zone = deliveryZones.find((z) => z.id === e.target.value) || null;
                    setSelectedZone(zone);
                  }}
                  className="w-full p-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#123B52]"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} (+{formatEUR(z.fee)}, min {formatEUR(z.minOrder)})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Promo Code Box */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#123B52] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#287D91]" />
              <span>Promotional Code</span>
            </h3>

            {appliedOffer ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                <div>
                  <span className="font-bold">{appliedOffer.code}</span> applied: {appliedOffer.title}
                </div>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-emerald-700 hover:text-red-600 underline font-semibold ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SUNRISE10 or SEASIDE5"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-md uppercase focus:outline-none focus:border-[#123B52]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#123B52] text-white text-xs font-semibold rounded-md hover:bg-[#287D91] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {promoMessage && (
              <p className={`text-xs ${promoMessage.isError ? 'text-red-600' : 'text-emerald-600'}`}>
                {promoMessage.text}
              </p>
            )}
          </div>

          {/* Totals Summary */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium">{formatEUR(pricing.subtotal)}</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee ({selectedZone?.name || 'Selected Area'})</span>
                  <span className="font-medium">+{formatEUR(pricing.deliveryFee)}</span>
                </div>
              )}

              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedOffer?.code})</span>
                  <span>-{formatEUR(pricing.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100 text-[11px]">
                <span>Included VAT ({settings.taxRatePercent}%)</span>
                <span>{formatEUR(pricing.taxAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#123B52] pt-2 border-t border-gray-200">
                <span>Total Amount (EUR)</span>
                <span>{formatEUR(pricing.total)}</span>
              </div>
            </div>

            {/* Validation Error if any */}
            {!pricing.isValid && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{pricing.validationError}</span>
              </div>
            )}

            <button
              type="button"
              disabled={!pricing.isValid}
              onClick={() => navigate('/checkout')}
              className={`w-full py-3.5 px-4 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                pricing.isValid
                  ? 'bg-[#123B52] hover:bg-[#287D91] text-white shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#287D91]" />
              <span>Prices verified against live kitchen menu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
