import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';
import { Search, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { products, categories, toggleProductAvailability } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'sold_out'>('all');

  const filtered = products.filter((p) => {
    if (filter === 'available' && !p.isAvailable) return false;
    if (filter === 'sold_out' && p.isAvailable) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const soldOutCount = products.filter((p) => !p.isAvailable).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Kitchen Stock & Availability
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Instantly mark items as sold out to prevent online order placement.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
            {products.length - soldOutCount} Active
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-semibold">
            {soldOutCount} Sold Out
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dish or beverage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'available', 'sold_out'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                filter === mode
                  ? 'bg-[#123B52] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const cat = categories.find((c) => c.id === product.category);
          return (
            <div
              key={product.id}
              className={`p-4 bg-white rounded-xl border transition-all flex items-center justify-between gap-3 ${
                product.isAvailable
                  ? 'border-gray-200 shadow-sm'
                  : 'border-red-200 bg-red-50/20 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-xs truncate">{product.name}</h4>
                  <span className="text-[11px] text-gray-500 block truncate">{cat?.name}</span>
                  <span className="text-xs font-bold text-[#123B52] font-sans">
                    {formatEUR(product.price)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleProductAvailability(product.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                  product.isAvailable
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-red-100 hover:text-red-800'
                    : 'bg-red-100 text-red-800 hover:bg-emerald-100 hover:text-emerald-800'
                }`}
              >
                {product.isAvailable ? 'In Stock' : 'Sold Out'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
