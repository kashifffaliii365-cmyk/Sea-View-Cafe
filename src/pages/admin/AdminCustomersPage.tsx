import React, { useState } from 'react';
import { Mail, Phone, Clock, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminCustomersPage: React.FC = () => {
  const { enquiries, markEnquiryRead, orders } = useStore();
  const [tab, setTab] = useState<'enquiries' | 'order_customers'>('enquiries');

  // Derive unique customer list from orders
  const customerMap = new Map<string, { name: string; email: string; phone: string; orderCount: number; lastOrder: string }>();
  orders.forEach((o) => {
    const key = o.customer.email.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
    } else {
      customerMap.set(key, {
        name: o.customer.fullName,
        email: o.customer.email,
        phone: o.customer.phone,
        orderCount: 1,
        lastOrder: o.createdAt,
      });
    }
  });

  const uniqueCustomers = Array.from(customerMap.values());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Customer Inquiries & Contacts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Restricted customer communications and GDPR-compliant order contact logs.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab('enquiries')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === 'enquiries'
                ? 'bg-[#123B52] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            Contact Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setTab('order_customers')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === 'order_customers'
                ? 'bg-[#123B52] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            Order Clients ({uniqueCustomers.length})
          </button>
        </div>
      </div>

      {tab === 'enquiries' ? (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-xs text-gray-400">
              No customer inquiries received yet.
            </div>
          ) : (
            enquiries.map((enq) => (
              <div
                key={enq.id}
                className={`bg-white p-6 rounded-xl border transition-all ${
                  enq.isRead ? 'border-gray-200' : 'border-[#287D91] shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{enq.name}</span>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="font-semibold text-xs text-[#287D91]">{enq.subject}</span>
                    {!enq.isRead && (
                      <span className="bg-[#E98268] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(enq.createdAt).toLocaleString()} (Malta Time)
                  </span>
                </div>

                <p className="text-xs text-gray-700 mt-3 leading-relaxed">"{enq.message}"</p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4 text-gray-600">
                    <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 hover:text-[#123B52]">
                      <Mail className="w-3.5 h-3.5 text-[#287D91]" />
                      <span>{enq.email}</span>
                    </a>
                    {enq.phone && (
                      <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 hover:text-[#123B52]">
                        <Phone className="w-3.5 h-3.5 text-[#E98268]" />
                        <span>{enq.phone}</span>
                      </a>
                    )}
                  </div>

                  {!enq.isRead && (
                    <button
                      onClick={() => markEnquiryRead(enq.id)}
                      className="px-3 py-1 bg-[#123B52] hover:bg-[#287D91] text-white rounded text-xs font-semibold"
                    >
                      Mark as Handled
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Total Orders</th>
                <th className="px-6 py-3">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {uniqueCustomers.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/70">
                  <td className="px-6 py-3.5 font-bold text-gray-900">{c.name}</td>
                  <td className="px-6 py-3.5 text-gray-600">{c.email}</td>
                  <td className="px-6 py-3.5 text-gray-600">{c.phone}</td>
                  <td className="px-6 py-3.5 font-semibold text-[#123B52]">{c.orderCount}</td>
                  <td className="px-6 py-3.5 text-gray-400">
                    {new Date(c.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
