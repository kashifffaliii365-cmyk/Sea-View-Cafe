import React, { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck, Clock, MapPin, Phone, Mail, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [address, setAddress] = useState(settings.address);
  const [locality, setLocality] = useState(settings.locality);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);

  const [orderAcceptance, setOrderAcceptance] = useState(settings.orderAcceptanceEnabled);
  const [pickupEnabled, setPickupEnabled] = useState(settings.pickupEnabled);
  const [deliveryEnabled, setDeliveryEnabled] = useState(settings.deliveryEnabled);
  const [estimatedPrep, setEstimatedPrep] = useState(settings.estimatedPrepMinutes.toString());
  const [taxRate, setTaxRate] = useState(settings.taxRatePercent.toString());
  const [stripeTestMode, setStripeTestMode] = useState(settings.stripeTestMode);

  const [facebook, setFacebook] = useState(settings.socialLinks.facebook);
  const [instagram, setInstagram] = useState(settings.socialLinks.instagram);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      businessName,
      address,
      locality,
      phone,
      email,
      orderAcceptanceEnabled: orderAcceptance,
      pickupEnabled,
      deliveryEnabled,
      estimatedPrepMinutes: parseInt(estimatedPrep, 10) || 20,
      taxRatePercent: parseFloat(taxRate) || 18.0,
      stripeTestMode,
      socialLinks: {
        facebook,
        instagram,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Business & Kitchen Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure ordering availability, opening schedules, local tax, and official links.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Ordering Availability Switches */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B52]">
            Online Kitchen Queue Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#123B52] block">Accept Orders</span>
                <span className="text-[11px] text-gray-500">Master system switch</span>
              </div>
              <button
                type="button"
                onClick={() => setOrderAcceptance(!orderAcceptance)}
                className={`p-1 rounded transition-colors ${orderAcceptance ? 'text-emerald-600' : 'text-gray-400'}`}
              >
                {orderAcceptance ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#123B52] block">Counter Pickup</span>
                <span className="text-[11px] text-gray-500">Takeout collection</span>
              </div>
              <button
                type="button"
                onClick={() => setPickupEnabled(!pickupEnabled)}
                className={`p-1 rounded transition-colors ${pickupEnabled ? 'text-emerald-600' : 'text-gray-400'}`}
              >
                {pickupEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#123B52] block">Local Delivery</span>
                <span className="text-[11px] text-gray-500">Courier dispatch</span>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                className={`p-1 rounded transition-colors ${deliveryEnabled ? 'text-emerald-600' : 'text-gray-400'}`}
              >
                {deliveryEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B52]">
            Business Information (Mellieħa, Malta)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Locality</label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Public Contact Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Kitchen Operations & Tax */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B52]">
            Timing, Tax & Fiscal Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Estimated Prep Time (Minutes)
              </label>
              <input
                type="number"
                value={estimatedPrep}
                onChange={(e) => setEstimatedPrep(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Maltese VAT Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Malta standard VAT: 18%. Verify with licensed Maltese accountant for catering rates.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Payment Provider Configuration */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#123B52] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#287D91]" />
              <span>Stripe Payment Integration Status</span>
            </h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Development Test Mode
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Card payments are currently operating in verified sandbox test mode. Secret keys are kept server-side only. To activate live Maltese merchant processing, provide approved Stripe API keys in the environment variables (see README).
          </p>

          <label className="flex items-center gap-2 font-semibold text-gray-800 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={stripeTestMode}
              onChange={(e) => setStripeTestMode(e.target.checked)}
              className="rounded text-[#123B52]"
            />
            <span>Enable Test Mode Checkout Simulation</span>
          </label>
        </div>

        {/* Section 5: Official Social Links */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B52]">
            Verified Social Media Accounts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold rounded-md flex items-center gap-2 shadow-sm text-xs uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
