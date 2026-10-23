import React from 'react';
import { Truck, MapPin, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';

export const DeliveryPolicyPage: React.FC = () => {
  const { deliveryZones, settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Malta Delivery Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Delivery Policy & Service Zones
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Sea View Cafe/Bar · Triq Salvinu Vella, Il-Mellieħa, Malta
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">1. Delivery Coverage Area</h2>
          <p>
            To ensure your food arrives hot, fresh, and properly insulated, we operate delivery within defined geographic zones in northern Malta.
          </p>

          <div className="space-y-3 pt-2">
            {deliveryZones.map((zone) => (
              <div
                key={zone.id}
                className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div>
                  <h3 className="font-serif font-bold text-[#123B52] text-sm">{zone.name}</h3>
                  <p className="text-xs text-gray-600">
                    Postal Area: {zone.postalPrefix} · Estimated Delivery: {zone.estimatedMinutes}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-bold text-[#123B52] block text-sm">
                    Fee: {formatEUR(zone.fee)}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Min. Order: {formatEUR(zone.minOrder)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2 pt-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">2. Handover & Drop-off Procedure</h2>
          <p>
            Our drivers deliver directly to the building exterior, door, or hotel reception. If you reside in an apartment complex, please specify your block, floor, or buzzer code in the delivery instructions box during checkout.
          </p>
        </section>

        <section className="space-y-2 pt-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">3. Delivery Delays & Weather</h2>
          <p>
            During peak Maltese summer tourism periods, seasonal festivities, or inclement maritime weather, delivery transit times may vary slightly. If a delay exceeding 20 minutes is anticipated, our staff will contact you via telephone.
          </p>
        </section>
      </div>
    </div>
  );
};
