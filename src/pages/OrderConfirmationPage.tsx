import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Phone, Printer, ArrowRight, ShieldCheck, Truck, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR } from '../lib/order-pricing';
import { PushNotificationPrompt } from '../components/common/PushNotificationPrompt';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, settings } = useStore();

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#123B52]">Order Not Found</h1>
        <p className="text-xs text-gray-600">
          We could not find the order reference you requested. If you placed an order recently, please check your confirmation email or order number.
        </p>
        <Link
          to="/track-order"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123B52] text-white text-xs font-semibold uppercase tracking-wider rounded-md"
        >
          <span>Track Order by Number</span>
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Received' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Kitchen Preparing' },
    { key: order.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery', label: order.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery' },
    { key: 'completed', label: 'Completed' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === order.status);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Top Success Banner */}
      <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#123B52] mt-1">
            Order Reference: {order.orderNumber}
          </h1>
          <p className="text-xs text-gray-600 mt-2 max-w-lg mx-auto">
            Thank you, {order.customer.fullName}. We have received your order at Sea View Cafe/Bar in Mellieħa.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <Link
            to="/track-order"
            className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
          >
            <span>Live Order Status Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Push Notifications Prompt */}
      <PushNotificationPrompt order={order} />

      {/* Real-Time Status Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#123B52]">Preparation Status</h2>
            <p className="text-xs text-gray-500">Updated in real-time by café staff</p>
          </div>
          <span className="px-3 py-1 bg-[#123B52]/10 text-[#123B52] font-bold text-xs uppercase tracking-wider rounded">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {steps.map((step, idx) => {
            const isDone = currentStepIdx >= idx;
            const isCurrent = currentStepIdx === idx;
            return (
              <div
                key={step.key}
                className={`p-3 rounded-lg border text-center text-xs space-y-1 transition-all ${
                  isCurrent
                    ? 'border-[#123B52] bg-[#FAF7F0] font-bold text-[#123B52]'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider">Step {idx + 1}</div>
                <div className="text-xs leading-tight">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order & Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fulfillment Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B52] flex items-center gap-2">
            {order.orderType === 'pickup' ? (
              <Store className="w-4 h-4 text-[#287D91]" />
            ) : (
              <Truck className="w-4 h-4 text-[#287D91]" />
            )}
            <span>
              {order.orderType === 'pickup' ? 'Collection Details' : 'Delivery Address'}
            </span>
          </h3>

          <div className="space-y-2 text-xs text-gray-700">
            {order.orderType === 'pickup' ? (
              <>
                <p className="font-medium text-gray-900">Sea View Cafe/Bar Collection Counter</p>
                <p>{settings.address}, {settings.locality}, Malta</p>
                <p className="text-gray-500">Contact: {settings.phone}</p>
                <p className="text-[#287D91] font-semibold pt-1">
                  Ready in approx. {settings.estimatedPrepMinutes} minutes
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-900">{order.customer.fullName}</p>
                <p>{order.customer.addressLine1}</p>
                <p>{order.customer.locality} {order.customer.postalCode}</p>
                {order.customer.deliveryInstructions && (
                  <p className="text-gray-500 italic">
                    Note: "{order.customer.deliveryInstructions}"
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B52]">
            Payment & Contact
          </h3>

          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {order.paymentMethod.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-semibold uppercase text-emerald-700">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Customer Phone:</span>
              <span>{order.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Email:</span>
              <span>{order.customer.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Items Receipt */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
          Receipt Items
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-start text-xs">
              <div>
                <span className="font-semibold text-gray-900">
                  {item.quantity}x {item.productName}
                </span>
                {item.selectedVariant && (
                  <span className="block text-gray-500 mt-0.5">{item.selectedVariant.name}</span>
                )}
                {item.selectedExtras && item.selectedExtras.length > 0 && (
                  <span className="block text-gray-500 mt-0.5">
                    Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                  </span>
                )}
                {item.itemNotes && (
                  <span className="block text-gray-500 italic mt-0.5">"{item.itemNotes}"</span>
                )}
              </div>
              <span className="font-bold text-gray-900 font-sans">
                {formatEUR(item.calculatedItemTotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-1.5 text-xs text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatEUR(order.subtotal)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>+{formatEUR(order.deliveryFee)}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promotional Discount</span>
              <span>-{formatEUR(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-[#123B52] pt-2 border-t border-gray-200">
            <span>Total Paid (EUR)</span>
            <span>{formatEUR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Need Help Box */}
      <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-[#E98268]" />
          <span>Questions regarding your order? Contact our café staff directly:</span>
        </div>
        <a
          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
          className="font-bold text-[#123B52] hover:text-[#287D91]"
        >
          {settings.phone}
        </a>
      </div>
    </div>
  );
};
