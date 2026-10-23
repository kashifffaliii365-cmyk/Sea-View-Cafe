import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductCustomizeModal } from '../components/ui/ProductCustomizeModal';
import { Product } from '../types';

interface MenuPageProps {
  onOpenCart?: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenCart }) => {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const { products, categories } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Determine current active category from URL parameter
  const activeCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((c) => c.slug === categorySlug) || null;
  }, [categorySlug, categories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (activeCategory && product.category !== activeCategory.id) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchAllergen = product.allergens?.some((a) => a.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchAllergen) return false;
        }

        // Dietary filter
        if (selectedDietary !== 'all') {
          if (!product.dietaryTags?.includes(selectedDietary)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [products, activeCategory, searchQuery, selectedDietary, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#123B52]/10 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Sea View Cafe/Bar · Mellieħa, Malta
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          {activeCategory ? activeCategory.name : 'Food & Drinks Menu'}
        </h1>
        <p className="text-sm text-[#202B32]/75 mt-2 max-w-2xl leading-relaxed">
          {activeCategory
            ? activeCategory.description
            : 'Explore our complete selection of freshly cooked seaside breakfasts, Maltese specialities, burgers, toasties, cold Cisk beers and refreshments.'}
        </p>

        {/* Category Navigation Pills (Functional segmented tabs) */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            to="/menu"
            className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              !activeCategory
                ? 'bg-[#123B52] text-white'
                : 'bg-white border border-[#123B52]/15 text-[#123B52] hover:bg-[#FAF7F0]'
            }`}
          >
            All Items ({products.length})
          </Link>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            const isSelected = activeCategory?.id === cat.id;
            return (
              <Link
                key={cat.id}
                to={`/menu/${cat.slug}`}
                className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#123B52] text-white'
                    : 'bg-white border border-[#123B52]/15 text-[#123B52] hover:bg-[#FAF7F0]'
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#123B52]/10 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dishes, drinks, or allergens (e.g. Cisk, Ravioli, Gluten)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
          />
        </div>

        {/* Dietary and Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dietary Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#123B52]"
            >
              <option value="all">All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Pescatarian">Pescatarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#123B52]"
            >
              <option value="default">Default Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 p-8 space-y-3">
          <p className="font-serif text-lg text-gray-800">No dishes match your filter criteria.</p>
          <p className="text-xs text-gray-500">
            Try adjusting your search query, or clear the dietary filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDietary('all');
            }}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#123B52] border border-[#123B52]/20 rounded-md hover:bg-[#FAF7F0]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={(p) => setCustomizingProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Customize Modal */}
      {customizingProduct && (
        <ProductCustomizeModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAdded={onOpenCart}
        />
      )}
    </div>
  );
};
