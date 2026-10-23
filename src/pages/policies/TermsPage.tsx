import React from 'react';
import { useStore } from '../../context/StoreContext';

export const TermsPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Customer Terms of Service
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Applicable to Orders at Sea View Cafe/Bar, Mellieħa, Malta
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">1. Introduction & Order Acceptance</h2>
          <p>
            These Terms govern your use of the website and online ordering facilities provided by Sea View Cafe/Bar. When you place an order, you submit an offer to purchase the selected food and beverage items. Orders are subject to kitchen capacity and ingredient availability. An order is confirmed when you receive an online confirmation code and our kitchen begins preparation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">2. Pricing & Currency</h2>
          <p>
            All prices are stated in Euros (EUR €) and include applicable Maltese Value Added Tax (VAT). Delivery charges, where applicable, are calculated and displayed prior to order confirmation based on your selected delivery zone in Malta.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">3. Food Safety, Ingredients & Allergens</h2>
          <p>
            We list known allergens for menu items based on current supplier data. Due to the presence of ingredients containing gluten, dairy, nuts, eggs, and fish in our commercial kitchen, cross-contact may occasionally occur. If you have a severe food allergy or celiac condition, you must contact our café staff directly at {settings.phone} prior to placing an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">4. Collection & Delivery Timings</h2>
          <p>
            Estimated preparation and delivery times are guidelines. Adverse weather, heavy traffic along northern Maltese coastal roads, or unexpected kitchen volume may affect delivery times. We make every reasonable effort to keep customers informed via telephone or email.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">5. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by the laws of Malta. Any disputes arising in connection with orders shall be subject to the jurisdiction of the Maltese courts.
          </p>
        </section>
      </div>
    </div>
  );
};
