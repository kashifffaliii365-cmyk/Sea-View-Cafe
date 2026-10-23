import React from 'react';
import { useStore } from '../../context/StoreContext';

export const RefundPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Customer Care Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Sea View Cafe/Bar · Triq Salvinu Vella, Il-Mellieħa, Malta
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">1. Order Cancellations</h2>
          <p>
            Because our kitchen begins cooking, grilling, and baking dishes immediately upon receiving your confirmed order, cancellations can only be accommodated if requested before our kitchen commences preparation (typically within 5 minutes of order placement).
          </p>
          <p>
            To request an immediate cancellation, call our duty manager directly at {settings.phone}. Orders already on the grill, in the fryer, or dispatched with a courier cannot be cancelled.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">2. Quality Concerns & Missing Items</h2>
          <p>
            We take pride in the quality of every dish prepared at Sea View Cafe/Bar. If an item in your order is incorrect, missing, or fails to meet our standards, please contact us immediately upon collection or delivery at {settings.phone}.
          </p>
          <p>
            Where a genuine error has occurred, we will promptly offer an immediate replacement dish or issue a full refund for the affected item.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">3. Card Refund Processing</h2>
          <p>
            Approved card refunds are processed through the original payment method and typically reflect in your bank account within 3 to 7 business days, depending on your card issuer.
          </p>
        </section>
      </div>
    </div>
  );
};
