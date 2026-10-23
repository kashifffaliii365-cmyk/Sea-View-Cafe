import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, ProductVariant, ProductExtra } from '../../types';
import { formatEUR } from '../../lib/order-pricing';
import { useStore } from '../../context/StoreContext';

interface ProductCustomizeModalProps {
  product: Product | null;
  onClose: () => void;
  onAdded?: () => void;
}

export const ProductCustomizeModal: React.FC<ProductCustomizeModalProps> = ({
  product,
  onClose,
  onAdded,
}) => {
  const { addToCart } = useStore();

  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [itemNotes, setItemNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const basePrice = product.price + (selectedVariant ? selectedVariant.priceDelta : 0);
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleExtra = (extra: ProductExtra) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedExtras, itemNotes.trim() || undefined);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      if (onAdded) onAdded();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B52]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 bg-gray-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('1533089860892')) {
                target.src = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80';
              }
            }}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-serif text-xl font-bold text-[#123B52]">{product.name}</h3>
              <span className="font-bold text-lg text-[#123B52] font-sans">
                {formatEUR(product.price)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{product.description}</p>

            {/* Allergens & Dietary */}
            {(product.dietaryTags?.length || product.allergens?.length) ? (
              <div className="mt-3 text-xs text-[#287D91]">
                {product.dietaryTags && product.dietaryTags.length > 0 && (
                  <span className="font-medium mr-2">{product.dietaryTags.join(' · ')}</span>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <span className="text-gray-500">
                    Allergens: {product.allergens.join(', ')}
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                Choose Size or Option
              </h4>
              <div className="space-y-2">
                {product.variants.map((v) => (
                  <label
                    key={v.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      selectedVariant?.id === v.id
                        ? 'border-[#123B52] bg-[#FAF7F0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="product-variant"
                        checked={selectedVariant?.id === v.id}
                        onChange={() => setSelectedVariant(v)}
                        className="text-[#123B52] focus:ring-[#287D91]"
                      />
                      <span className="font-medium text-gray-800">{v.name}</span>
                    </div>
                    {v.priceDelta !== 0 && (
                      <span className="text-gray-600 font-semibold">
                        +{formatEUR(v.priceDelta)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {product.extras && product.extras.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                Optional Extras & Add-ons
              </h4>
              <div className="space-y-2">
                {product.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <label
                      key={extra.id}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-[#123B52] bg-[#FAF7F0]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleExtra(extra)}
                          className="rounded text-[#123B52] focus:ring-[#287D91]"
                        />
                        <span className="font-medium text-gray-800">{extra.name}</span>
                      </div>
                      <span className="text-gray-600 font-semibold">
                        +{formatEUR(extra.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Instructions */}
          <div className="pt-3 border-t border-gray-100">
            <label
              htmlFor="special-instructions"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-1.5"
            >
              Special Kitchen Instructions (Optional)
            </label>
            <input
              id="special-instructions"
              type="text"
              placeholder="e.g. No onions, sauce on the side, extra hot"
              value={itemNotes}
              onChange={(e) => setItemNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 bg-[#FAF7F0] border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center border border-gray-300 rounded-md bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              success
                ? 'bg-emerald-600 text-white'
                : 'bg-[#123B52] hover:bg-[#287D91] text-white shadow-sm'
            }`}
          >
            {success ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : (
              <span>Add to Bag · {formatEUR(totalPrice)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
