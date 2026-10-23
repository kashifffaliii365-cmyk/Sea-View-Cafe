import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Truck, Clock, MapPin, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR } from '../lib/order-pricing';

export const OrderTypeSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    orderType,
    setOrderType,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    settings,
    cart,
  } = useStore();

  const handleProceed = (type: 'pickup' | 'delivery') => {
    setOrderType(type);
    if (cart.length > 0) {
      navigate('/checkout');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Sea View Cafe/Bar Online Ordering
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52]">
          How Would You Like Your Order?
        </h1>
        <p className="text-xs sm:text-sm text-[#202B32]/75 leading-relaxed">
          Order in advance for quick counter collection on Triq Salvinu Vella, or request local delivery across the Mellieħa area.
        </p>
      </div>

      {!settings.orderAcceptanceEnabled && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            Our online kitchen queue is temporarily paused during peak service. Please call us directly at {settings.phone} to check table or takeout availability.
          </span>
        </div>
      )}

      {/* Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Choice */}
        <div
          onClick={() => setSelectedZone(null)}
          className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            orderType === 'pickup'
              ? 'border-[#123B52] bg-white shadow-xl'
              : 'border-gray-200 bg-white/70 hover:border-gray-300'
          }`}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#123B52] text-white flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#123B52]">
                Counter Collection (Pickup)
              </h3>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Collect directly from our counter on Triq Salvinu Vella overlooking Mellieħa bay. Ready in approximately {settings.estimatedPrepMinutes} minutes.
              </p>
            </div>

            <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E98268]" />
                <span>{settings.address}, Il-Mellieħa, Malta</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#287D91]" />
                <span>No minimum order spend</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free collection (No delivery fee)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!settings.pickupEnabled}
            onClick={() => handleProceed('pickup')}
            className="mt-8 w-full py-3 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Select Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Delivery Choice */}
        <div
          className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            orderType === 'delivery'
              ? 'border-[#123B52] bg-white shadow-xl'
              : 'border-gray-200 bg-white/70 hover:border-gray-300'
          }`}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#287D91] text-white flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#123B52]">
                Doorstep Delivery (Local Zones)
              </h3>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Delivered fresh to your home, holiday apartment or hotel in Mellieħa, Manikata, or Xemxija.
              </p>
            </div>

            {/* Delivery Zone Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-800">
                Choose Your Delivery Zone:
              </label>
              <div className="space-y-1.5">
                {deliveryZones.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrderType('delivery');
                      setSelectedZone(zone);
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-colors ${
                      selectedZone?.id === zone.id && orderType === 'delivery'
                        ? 'border-[#287D91] bg-[#FAF7F0] font-semibold text-[#123B52]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div>
                      <span>{zone.name}</span>
                      <span className="block text-[10px] text-gray-500 font-normal">
                        Min. order: {formatEUR(zone.minOrder)} · {zone.estimatedMinutes}
                      </span>
                    </div>
                    <span className="font-bold text-[#123B52]">+{formatEUR(zone.fee)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!settings.deliveryEnabled}
            onClick={() => handleProceed('delivery')}
            className="mt-8 w-full py-3 bg-[#287D91] hover:bg-[#123B52] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Select Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
