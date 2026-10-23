import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit2, Trash2, Eye, EyeOff, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';

export const AdminMenuPage: React.FC = () => {
  const { products, categories, toggleProductAvailability, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Menu Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, update prices, toggle availability, and configure options for all food and drink items.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Dish / Drink</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name, ingredients, or allergens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#123B52]"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price (EUR)</th>
                <th className="px-6 py-3">Allergens</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const cat = categories.find((c) => c.id === product.category);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 text-xs sm:text-sm">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-medium">
                      {cat?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-gray-900 font-sans">
                      {formatEUR(product.price)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {product.allergens && product.allergens.length > 0
                        ? product.allergens.join(', ')
                        : 'None'}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleProductAvailability(product.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          product.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {product.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{product.isAvailable ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="inline-block p-1.5 text-gray-500 hover:text-[#123B52] border border-gray-200 rounded"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 border border-gray-200 rounded"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
