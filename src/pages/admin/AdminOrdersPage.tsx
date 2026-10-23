import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';
import { OrderStatus } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Order Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Accept, track, and update live orders from customer submissions.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ref, customer name, phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready_for_pickup', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-[#123B52] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No orders match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Order Number</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Items Summary</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#123B52]">
                      <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.customer.fullName}</div>
                      <div className="text-[11px] text-gray-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-medium text-gray-700">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                      {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 font-sans">
                      {formatEUR(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'preparing'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted', 'Accepted')}
                            className="px-2.5 py-1 bg-[#123B52] hover:bg-[#287D91] text-white rounded text-[11px] font-semibold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled', 'Kitchen busy')}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[11px] font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing', 'In kitchen')}
                          className="px-2.5 py-1 bg-[#287D91] text-white rounded text-[11px] font-semibold"
                        >
                          Prepare
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              order.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery'
                            )
                          }
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Ready
                        </button>
                      )}
                      {(order.status === 'ready_for_pickup' || order.status === 'out_for_delivery') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed', 'Completed')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                        >
                          Done
                        </button>
                      )}
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="px-2 py-1 text-gray-500 hover:text-gray-900 border border-gray-200 rounded text-[11px]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
