import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';

export const AdminOffersPage: React.FC = () => {
  const { offers, addOffer, toggleOffer, deleteOffer } = useStore();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minSpend, setMinSpend] = useState('20.00');
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    addOffer({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minSpend: minSpend ? parseFloat(minSpend) : undefined,
      description: description.trim(),
      validUntil,
      isActive: true,
    });

    setTitle('');
    setCode('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Promotions & Offer Codes
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage promotional discounts applied during customer checkout.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'New Promotion'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-[#123B52]">Create New Promo Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mellieħa Sunrise Special"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="SUNRISE10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-2 border border-gray-200 rounded uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full p-2 border border-gray-200 rounded bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Discount Value</label>
              <input
                type="number"
                step="0.5"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Min Spend (EUR)</label>
              <input
                type="number"
                step="1"
                placeholder="20.00"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Valid Until</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="Short description displayed to customer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold rounded text-xs"
            >
              Save Promotion
            </button>
          </div>
        </form>
      )}

      {/* Offers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Min Spend</th>
              <th className="px-6 py-3">Expiry</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50/70">
                <td className="px-6 py-4 font-mono font-bold text-[#123B52]">{offer.code}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{offer.title}</td>
                <td className="px-6 py-4 font-medium text-emerald-700">
                  {offer.discountType === 'percentage'
                    ? `${offer.discountValue}%`
                    : formatEUR(offer.discountValue)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {offer.minSpend ? formatEUR(offer.minSpend) : 'No Min'}
                </td>
                <td className="px-6 py-4 text-gray-500">{offer.validUntil}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleOffer(offer.id)}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                      offer.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 border border-gray-200 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
