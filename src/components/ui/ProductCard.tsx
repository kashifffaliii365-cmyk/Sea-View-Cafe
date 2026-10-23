import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { formatEUR } from '../../lib/order-pricing';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addToCart } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const hasOptions = (product.variants && product.variants.length > 0) || (product.extras && product.extras.length > 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.isAvailable) return;

    if (hasOptions && onOpenQuickView) {
      onOpenQuickView(product);
      return;
    }

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-[#123B52]/10 hover:border-[#287D91]/40 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('1533089860892')) {
              target.src = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80';
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Sold out overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-[#123B52]/80 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="text-white text-xs uppercase tracking-wider font-semibold border border-white/40 px-3 py-1 rounded">
              Currently Sold Out
            </span>
          </div>
        )}

        {/* Popular text tag (unboxed subtle marker) */}
        {product.isPopular && product.isAvailable && (
          <div className="absolute top-3 left-3 bg-[#123B52]/90 text-[#FAF7F0] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur-sm">
            Popular Choice
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Price */}
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="font-serif text-lg font-bold text-[#123B52] group-hover:text-[#287D91] transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <span className="font-bold text-sm text-[#123B52] shrink-0 font-sans">
              {formatEUR(product.price)}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-[#202B32]/75 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Dietary & Allergens: Zero-Pill Typography */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-[#287D91]">
            {product.dietaryTags && product.dietaryTags.length > 0 && (
              <span className="font-medium text-[#287D91]">{product.dietaryTags.join(' · ')}</span>
            )}
            {product.dietaryTags && product.dietaryTags.length > 0 && product.allergens && product.allergens.length > 0 && (
              <span className="text-gray-300">|</span>
            )}
            {product.allergens && product.allergens.length > 0 && (
              <span className="text-gray-500 font-normal">
                Allergens: {product.allergens.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <Link
            to={`/product/${product.slug}`}
            className="text-xs font-semibold text-[#123B52] hover:text-[#287D91] transition-colors"
          >
            {hasOptions ? 'Customize & View' : 'Item Details'}
          </Link>

          {product.isAvailable ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to order`}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#123B52] hover:bg-[#287D91] text-white shadow-sm'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : hasOptions ? (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Choose</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
