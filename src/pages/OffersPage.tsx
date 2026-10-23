import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Copy, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR } from '../lib/order-pricing';

export const OffersPage: React.FC = () => {
  const { offers } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeOffers = offers.filter((o) => o.isActive);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Current Promotions
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52]">
          Special Offers & Meal Combos
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Active promotions approved by Sea View Cafe/Bar. Apply the promotional codes during online checkout.
        </p>
      </div>

      {activeOffers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <Tag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#123B52]">No Active Offers at Present</h3>
          <p className="text-xs text-gray-500 mt-1">
            Check back soon or follow our verified Facebook and Instagram pages for upcoming seasonal promotions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#287D91] uppercase tracking-wider">
                    {offer.discountType === 'percentage'
                      ? `${offer.discountValue}% OFF`
                      : `${formatEUR(offer.discountValue)} OFF`}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#123B52]">{offer.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{offer.description}</p>

                {offer.minSpend ? (
                  <p className="text-[11px] text-gray-500">
                    Minimum order spend: <strong>{formatEUR(offer.minSpend)}</strong>
                  </p>
                ) : null}
              </div>

              {/* Promo Code Box */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-[#FAF7F0] p-3 rounded-lg">
                <div className="font-mono text-sm font-bold text-[#123B52] tracking-wider">
                  {offer.code}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <Link
                  to="/menu"
                  className="w-full py-2.5 bg-[#123B52] hover:bg-[#287D91] text-white text-xs uppercase tracking-wider font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Order and Apply Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
