import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Phone, MapPin, Store, Truck, ArrowRight, AlertCircle, Bell } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR } from '../lib/order-pricing';
import { Order } from '../types';
import { PushNotificationPrompt } from '../components/common/PushNotificationPrompt';

export const TrackOrderPage: React.FC = () => {
  const { getOrderByNumber, settings } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const found = getOrderByNumber(query.trim());
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const statusLabels: Record<string, string> = {
    pending: 'Order Received (Pending Staff Review)',
    accepted: 'Order Accepted by Café Staff',
    preparing: 'In Preparation in Kitchen & Bar',
    ready_for_pickup: 'Ready for Collection at Counter',
    out_for_delivery: 'Out with Local Courier',
    completed: 'Order Completed',
    cancelled: 'Order Cancelled',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Live Order Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52]">
          Track Your Sea View Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Enter your order reference number (e.g. <span className="font-mono text-gray-800 font-semibold">SV-2026-1042</span>) found on your confirmation receipt to view live kitchen and delivery status.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 pt-4 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. SV-2026-1042"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-300 rounded-md uppercase font-mono tracking-wider focus:outline-none focus:border-[#123B52]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#123B52] hover:bg-[#287D91] text-white text-xs uppercase tracking-wider font-semibold rounded-md transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {/* Push Notifications Prompt */}
      <PushNotificationPrompt order={searchedOrder || undefined} />

      {/* Result Display */}
      {hasSearched && !searchedOrder && (
        <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#123B52]">No Matching Order Found</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We could not find an active order matching "<span className="font-mono">{query}</span>". Please check your reference code or call our Mellieħa team directly.
          </p>
          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#123B52] hover:underline pt-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#E98268]" />
            <span>Call Café: {settings.phone}</span>
          </a>
        </div>
      )}

      {searchedOrder && (
        <div className="space-y-6">
          {/* Status Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Order Reference
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-bold text-[#123B52]">
                  {searchedOrder.orderNumber}
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-500 block">Placed On</span>
                <span className="text-xs font-medium text-gray-800">
                  {new Date(searchedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Malta Time)
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#287D91] block">
                  Current Status
                </span>
                <span className="font-serif text-lg font-bold text-[#123B52]">
                  {statusLabels[searchedOrder.status] || searchedOrder.status}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#123B52] text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Status History Logs */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                Status Timeline
              </h3>
              <div className="space-y-2 border-l-2 border-[#123B52]/20 pl-4 ml-2">
                {searchedOrder.statusHistory.map((event, idx) => (
                  <div key={idx} className="relative text-xs space-y-0.5">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#123B52]" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 capitalize">
                        {event.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {event.note && (
                      <p className="text-gray-600 text-[11px] italic">"{event.note}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fulfillment & Items Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-serif text-base font-bold text-[#123B52] flex items-center gap-2">
                {searchedOrder.orderType === 'pickup' ? (
                  <Store className="w-4 h-4 text-[#287D91]" />
                ) : (
                  <Truck className="w-4 h-4 text-[#287D91]" />
                )}
                <span>Fulfillment Details</span>
              </h3>

              <div className="text-xs text-gray-700 space-y-1.5">
                <p>
                  <strong className="text-gray-900">Type:</strong>{' '}
                  <span className="capitalize">{searchedOrder.orderType}</span>
                </p>
                <p>
                  <strong className="text-gray-900">Customer:</strong>{' '}
                  {searchedOrder.customer.fullName}
                </p>
                {searchedOrder.orderType === 'delivery' && (
                  <p>
                    <strong className="text-gray-900">Address:</strong>{' '}
                    {searchedOrder.customer.addressLine1}, {searchedOrder.customer.locality}
                  </p>
                )}
                {searchedOrder.orderType === 'pickup' && (
                  <p>
                    <strong className="text-gray-900">Pickup Counter:</strong>{' '}
                    Triq Salvinu Vella, Il-Mellieħa
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-serif text-base font-bold text-[#123B52]">
                Order Items ({searchedOrder.items.length})
              </h3>

              <div className="space-y-2 text-xs divide-y divide-gray-100">
                {searchedOrder.items.map((item) => (
                  <div key={item.id} className="pt-2 flex justify-between">
                    <div>
                      <span className="font-medium text-gray-900">
                        {item.quantity}x {item.productName}
                      </span>
                      {item.selectedVariant && (
                        <span className="block text-[11px] text-gray-500">
                          {item.selectedVariant.name}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatEUR(item.calculatedItemTotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-xs font-bold text-[#123B52]">
                <span>Total Amount:</span>
                <span>{formatEUR(searchedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
