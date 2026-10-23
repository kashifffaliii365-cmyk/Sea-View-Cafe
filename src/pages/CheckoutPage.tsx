import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, Banknote, Clock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatEUR, calculateOrderTotals } from '../lib/order-pricing';
import { PaymentMethod, OrderCustomerInfo } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    products,
    orderType,
    selectedZone,
    appliedOffer,
    settings,
    createOrder,
  } = useStore();

  const pricing = calculateOrderTotals(
    cart,
    products,
    orderType,
    selectedZone,
    appliedOffer,
    settings.taxRatePercent
  );

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+356 ');
  const [addressLine1, setAddressLine1] = useState('');
  const [locality, setLocality] = useState(selectedZone?.name || 'Il-Mellieħa');
  const [postalCode, setPostalCode] = useState('MLH ');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduledTime, setScheduledTime] = useState('asap');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    orderType === 'pickup' ? 'pay_at_pickup' : 'test_card'
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#123B52]">No Items to Checkout</h1>
        <p className="text-xs text-gray-600">Your shopping cart is currently empty.</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123B52] text-white text-xs font-semibold uppercase tracking-wider rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Form Validations
    if (!fullName.trim() || !email.trim() || !phone.trim() || phone.trim() === '+356') {
      setSubmitError('Please complete all contact details (Full Name, Email, and Phone number).');
      return;
    }

    if (orderType === 'delivery') {
      if (!addressLine1.trim() || !locality.trim()) {
        setSubmitError('Please provide a complete street delivery address.');
        return;
      }
    }

    if (!acceptedTerms) {
      setSubmitError('Please confirm acceptance of our customer terms and cancellation policy.');
      return;
    }

    if (!pricing.isValid) {
      setSubmitError(pricing.validationError || 'Order pricing verification failed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate real server verification delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const customer: OrderCustomerInfo = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
        addressLine1: orderType === 'delivery' ? addressLine1.trim() : undefined,
        locality: orderType === 'delivery' ? locality.trim() : undefined,
        postalCode: orderType === 'delivery' ? postalCode.trim() : undefined,
        deliveryInstructions: orderType === 'delivery' ? deliveryInstructions.trim() : undefined,
      };

      const result = createOrder(customer, paymentMethod, scheduledTime);

      if (!result.success || !result.orderId) {
        setSubmitError(result.error || 'Failed to submit order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Navigate to genuine order confirmation page
      navigate(`/order-confirmation/${result.orderId}`);
    } catch {
      setSubmitError('A network error occurred while submitting your order. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Sea View Cafe/Bar · Secure Checkout
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#123B52] mt-1">
          Complete Your {orderType === 'pickup' ? 'Collection' : 'Delivery'} Order
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          Review your order details and choose your preferred payment method.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Customer Contact Details */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Vella"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address (For Order Receipt) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="maria@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Maltese Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+356 7912 3456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Used by our staff or delivery courier if there is an update regarding your order.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address (if Delivery) */}
          {orderType === 'delivery' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
                2. Delivery Address (Malta)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street Address & Apartment / Door Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 3, Sunrise Court, Triq il-Kbira"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Locality / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Malta Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="MLH 1045"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md uppercase focus:outline-none focus:border-[#123B52]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Courier Drop-off Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring buzzer for 3rd floor, leave in porch"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Timing & Kitchen Notes */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
              {orderType === 'pickup' ? '2. Collection Timing' : '3. Delivery Timing'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Preparation Timing
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#123B52]"
                >
                  <option value="asap">
                    ASAP (Kitchen preparing in ~{settings.estimatedPrepMinutes} mins)
                  </option>
                  <option value="later_today_1">In 45 Minutes</option>
                  <option value="later_today_2">In 1 Hour 30 Minutes</option>
                  <option value="later_today_3">This Evening (18:30)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  General Order Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please include extra napkins, cutlery"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>{orderType === 'pickup' ? '3. Payment Method' : '4. Payment Method'}</span>
              <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                256-bit SSL Protected
              </span>
            </h2>

            <div className="space-y-3">
              {/* Option: Test Mode Card */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'test_card'
                    ? 'border-[#123B52] bg-[#FAF7F0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'test_card'}
                  onChange={() => setPaymentMethod('test_card')}
                  className="mt-1 text-[#123B52] focus:ring-[#287D91]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#123B52]" />
                      Online Payment (Stripe EUR Test Simulation)
                    </span>
                    <span className="text-[10px] bg-[#123B52]/10 text-[#123B52] font-semibold px-2 py-0.5 rounded">
                      Instant Confirmation
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Simulates instant server-side payment verification in development mode without charging a real bank card.
                  </p>
                </div>
              </label>

              {/* Option: Pay at Pickup */}
              {orderType === 'pickup' && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'pay_at_pickup'
                      ? 'border-[#123B52] bg-[#FAF7F0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'pay_at_pickup'}
                    onChange={() => setPaymentMethod('pay_at_pickup')}
                    className="mt-1 text-[#123B52] focus:ring-[#287D91]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#287D91]" />
                        Pay at Counter Upon Collection
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Pay using cash, Apple Pay, Google Pay, or contactless credit/debit card at our Mellieħa café counter.
                    </p>
                  </div>
                </label>
              )}

              {/* Option: Pay on Delivery */}
              {orderType === 'delivery' && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'pay_on_delivery'
                      ? 'border-[#123B52] bg-[#FAF7F0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'pay_on_delivery'}
                    onChange={() => setPaymentMethod('pay_on_delivery')}
                    className="mt-1 text-[#123B52] focus:ring-[#287D91]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#287D91]" />
                        Pay on Doorstep Delivery
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Pay our driver in exact EUR cash or mobile payment upon handover.
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Submission */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Order Breakdown
            </h3>

            {/* Items list summary */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {pricing.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs text-gray-700">
                  <div className="pr-2">
                    <span className="font-medium text-gray-900">{item.quantity}x {item.productName}</span>
                    {item.selectedVariant && (
                      <span className="block text-[11px] text-gray-500">{item.selectedVariant.name}</span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0 font-sans">
                    {formatEUR(item.calculatedItemTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatEUR(pricing.subtotal)}</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery ({selectedZone?.name})</span>
                  <span>+{formatEUR(pricing.deliveryFee)}</span>
                </div>
              )}

              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedOffer?.code})</span>
                  <span>-{formatEUR(pricing.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100 text-[11px]">
                <span>Included VAT ({settings.taxRatePercent}%)</span>
                <span>{formatEUR(pricing.taxAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#123B52] pt-2 border-t border-gray-200">
                <span>Final Total (EUR)</span>
                <span>{formatEUR(pricing.total)}</span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#123B52] focus:ring-[#287D91]"
                />
                <span>
                  I accept the{' '}
                  <Link to="/terms-and-conditions" target="_blank" className="underline text-[#287D91]">
                    Terms
                  </Link>{' '}
                  and understand the{' '}
                  <Link to="/refund-and-cancellation" target="_blank" className="underline text-[#287D91]">
                    Cancellation Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !pricing.isValid}
              className={`w-full py-3.5 px-4 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isSubmitting || !pricing.isValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#123B52] hover:bg-[#287D91] text-white shadow-md'
              }`}
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order · {formatEUR(pricing.total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#287D91]" />
              <span>Sea View Cafe/Bar · Triq Salvinu Vella</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
