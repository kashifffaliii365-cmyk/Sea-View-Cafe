import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Phone, Mail, MapPin, Store, Truck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';
import { OrderStatus } from '../../types';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useStore();

  const order = getOrderById(id || '');

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#123B52]">Order Not Found</h2>
        <Link to="/admin/orders" className="text-xs text-[#287D91] underline">
          Return to orders list
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCancelOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    updateOrderStatus(order.id, 'cancelled', cancelReason.trim());
    setCancelModalOpen(false);
  };

  const nextStatuses: Record<OrderStatus, OrderStatus | null> = {
    pending: 'accepted',
    accepted: 'preparing',
    preparing: order.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery',
    ready_for_pickup: 'completed',
    out_for_delivery: 'completed',
    completed: null,
    cancelled: null,
  };

  const nextStatus = nextStatuses[order.status];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-2xl font-bold text-[#123B52]">{order.orderNumber}</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#123B52]/10 text-[#123B52]">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()} (Malta Time)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Docket</span>
          </button>

          {nextStatus && (
            <button
              onClick={() => updateOrderStatus(order.id, nextStatus, `Updated by staff to ${nextStatus}`)}
              className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Advance to {nextStatus.replace(/_/g, ' ')}</span>
            </button>
          )}

          {order.status !== 'cancelled' && order.status !== 'completed' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-md transition-colors border border-red-200"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Items & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Kitchen Items ({order.items.length})
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">
                      {item.quantity}x {item.productName}
                    </span>
                    {item.selectedVariant && (
                      <span className="block text-[#287D91] font-medium mt-0.5">
                        Size/Style: {item.selectedVariant.name}
                      </span>
                    )}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <span className="block text-gray-500 mt-0.5">
                        Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                      </span>
                    )}
                    {item.itemNotes && (
                      <div className="mt-1 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 font-medium">
                        Kitchen Note: "{item.itemNotes}"
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-gray-900 text-sm font-sans">
                    {formatEUR(item.calculatedItemTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatEUR(order.subtotal)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>+{formatEUR(order.deliveryFee)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promotional Discount:</span>
                  <span>-{formatEUR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#123B52] pt-2 border-t border-gray-200">
                <span>Total EUR:</span>
                <span>{formatEUR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status Progression Log */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Status Event History
            </h2>

            <div className="space-y-3 border-l-2 border-[#123B52]/20 pl-4 ml-2 text-xs">
              {order.statusHistory.map((ev, i) => (
                <div key={i} className="relative space-y-0.5">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#123B52]" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 capitalize">
                      {ev.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-400">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {ev.note && <p className="text-gray-600 italic">"{ev.note}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Fulfillment info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Customer Details
            </h3>

            <div className="space-y-2.5">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Name</span>
                <span className="font-semibold text-gray-900 text-sm">{order.customer.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Phone</span>
                <a href={`tel:${order.customer.phone}`} className="text-[#123B52] font-semibold hover:underline flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E98268]" />
                  <span>{order.customer.phone}</span>
                </a>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Email</span>
                <a href={`mailto:${order.customer.email}`} className="text-gray-700 hover:underline flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#287D91]" />
                  <span>{order.customer.email}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Fulfillment Info
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Mode:</span>
                <span className="font-bold uppercase text-[#123B52]">{order.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled:</span>
                <span className="font-medium text-gray-800">{order.scheduledTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="font-medium capitalize">{order.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-bold text-emerald-700 uppercase">{order.paymentStatus}</span>
              </div>

              {order.orderType === 'delivery' && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">
                    Delivery Address
                  </span>
                  <p className="text-gray-800 font-medium">{order.customer.addressLine1}</p>
                  <p className="text-gray-800">{order.customer.locality} {order.customer.postalCode}</p>
                  {order.customer.deliveryInstructions && (
                    <p className="text-gray-500 italic mt-1">
                      Instructions: "{order.customer.deliveryInstructions}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#123B52]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#123B52]">
              Cancel Order {order.orderNumber}
            </h3>
            <p className="text-xs text-gray-600">
              Please enter the reason for cancellation (e.g. customer requested, item out of stock, closed kitchen).
            </p>
            <form onSubmit={handleCancelOrder} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="Reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-[#123B52]"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
