import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Minus, Check, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR } from '../lib/order-pricing';
import { ProductVariant, ProductExtra } from '../types';
import { ProductCard } from '../components/ui/ProductCard';

interface ProductDetailPageProps {
  onOpenCart?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onOpenCart }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, categories, addToCart } = useStore();

  const product = products.find((p) => p.slug === slug);
  const category = categories.find((c) => c.id === product?.category);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [notes, setNotes] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#123B52]">Item Not Found</h1>
        <p className="text-sm text-gray-600">The dish or beverage you requested is not listed on our menu.</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123B52] text-white text-xs font-semibold uppercase tracking-wider rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

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
    if (!product.isAvailable) return;
    addToCart(product, quantity, selectedVariant, selectedExtras, notes.trim() || undefined);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      if (onOpenCart) onOpenCart();
    }, 800);
  };

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#123B52]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/menu" className="hover:text-[#123B52]">Menu</Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to={`/menu/${category.slug}`} className="hover:text-[#123B52]">{category.name}</Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#123B52] font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-2xl border border-[#123B52]/10 shadow-sm">
        {/* Left: Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
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
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-[#123B52]/80 backdrop-blur-[2px] flex items-center justify-center p-4">
              <span className="text-white text-sm uppercase tracking-wider font-bold border border-white/40 px-4 py-2 rounded">
                Currently Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Right: Details & Order Form */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
                  {category?.name || 'Menu Item'}
                </span>
                <h1 className="font-serif text-3xl font-bold text-[#123B52] mt-1">
                  {product.name}
                </h1>
              </div>
              <span className="font-serif text-2xl font-bold text-[#123B52] font-sans">
                {formatEUR(product.price)}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Preparation time & diet */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
              {product.preparationMinutes && (
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4 text-[#287D91]" />
                  <span>Est. Prep: {product.preparationMinutes} mins</span>
                </span>
              )}
              {product.dietaryTags && product.dietaryTags.length > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="font-medium text-[#287D91]">
                    {product.dietaryTags.join(', ')}
                  </span>
                </>
              )}
            </div>

            {/* Allergens Notice */}
            <div className="p-3.5 bg-[#FAF7F0] rounded-lg border border-[#123B52]/10 text-xs">
              <span className="font-semibold text-[#123B52] block mb-1">
                Verified Allergen Information
              </span>
              {product.allergens && product.allergens.length > 0 ? (
                <span className="text-gray-700">Contains: {product.allergens.join(', ')}.</span>
              ) : (
                <span className="text-gray-700">No common declared allergens in base recipe.</span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Select Size / Style
                </label>
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
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="detail-variant"
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
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Optional Additions & Sides
                </label>
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
                        <div className="flex items-center gap-2">
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

            {/* Special Instructions */}
            <div className="pt-2">
              <label
                htmlFor="instructions-field"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-1"
              >
                Special Kitchen Instructions (Optional)
              </label>
              <input
                id="instructions-field"
                type="text"
                placeholder="e.g. Extra hot, dressing on the side"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
              />
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 text-gray-600 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 text-gray-600 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={!product.isAvailable}
              onClick={handleAddToCart}
              className={`flex-1 w-full py-3 px-6 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                !product.isAvailable
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#123B52] hover:bg-[#287D91] text-white shadow-md'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Order</span>
                </>
              ) : !product.isAvailable ? (
                <span>Currently Unavailable</span>
              ) : (
                <span>Add to Order · {formatEUR(totalPrice)}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex justify-between items-end">
            <h2 className="font-serif text-2xl font-bold text-[#123B52]">
              More from {category?.name || 'our Kitchen'}
            </h2>
            <Link
              to={`/menu/${category?.slug || ''}`}
              className="text-xs font-semibold uppercase tracking-wider text-[#123B52] hover:text-[#287D91]"
            >
              View Category
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
