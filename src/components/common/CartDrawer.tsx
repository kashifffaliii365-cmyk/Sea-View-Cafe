import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, orderType, setOrderType } = useStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.calculatedItemTotal, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#123B52]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#123B52]" />
              <h3 className="font-serif text-lg font-bold text-[#123B52]">Your Order Bag</h3>
              <span className="text-xs text-gray-500 font-medium">({cart.length} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pickup / Delivery Segmented Control */}
          <div className="px-5 py-3 border-b border-gray-100 bg-white">
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-1.5 rounded-md transition-all ${
                  orderType === 'pickup'
                    ? 'bg-white text-[#123B52] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Collection (Pickup)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-1.5 rounded-md transition-all ${
                  orderType === 'delivery'
                    ? 'bg-white text-[#123B52] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Local Delivery
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-4">
                <div className="w-16 h-16 bg-[#FAF7F0] rounded-full flex items-center justify-center text-[#287D91]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-gray-900">Your bag is empty</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Explore our seaside breakfast, burger, fish & chips, and Maltese specialities to add items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/menu');
                  }}
                  className="px-4 py-2 bg-[#123B52] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#287D91] transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#FAF7F0]/60 rounded-lg border border-gray-100 flex gap-3 text-sm"
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
                    className="w-16 h-16 rounded object-cover shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#287D91] mt-0.5">
                        {item.selectedVariant.name}
                      </p>
                    )}

                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        + {item.selectedExtras.map((e) => e.name).join(', ')}
                      </p>
                    )}

                    {item.itemNotes && (
                      <p className="text-[11px] text-gray-500 italic mt-0.5 truncate">
                        Note: {item.itemNotes}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-xs text-[#123B52]">
                        {formatEUR(item.calculatedItemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & CTAs */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-[#FAF7F0] space-y-3">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Subtotal (EUR)</span>
                <span className="font-bold text-[#123B52] text-base">{formatEUR(subtotal)}</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Taxes included. Delivery fees & promotional discounts calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="py-2.5 px-3 border border-[#123B52]/30 text-[#123B52] font-semibold text-xs rounded-md hover:bg-white transition-colors"
                >
                  View Full Cart
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="py-2.5 px-3 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
