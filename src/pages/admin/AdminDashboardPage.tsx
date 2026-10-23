import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  PackageCheck,
  Settings,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';

export const AdminDashboardPage: React.FC = () => {
  const { orders, updateOrderStatus, products } = useStore();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  // Calculate real revenue from actual stored orders
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const soldOutProducts = products.filter((p) => !p.isAvailable);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Operations Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time orders, kitchen throughput, and inventory controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products/new"
            className="px-3.5 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </Link>
          <Link
            to="/admin/inventory"
            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
          >
            <PackageCheck className="w-3.5 h-3.5 text-[#287D91]" />
            <span>Stock Status</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Pending Acceptance</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-[#123B52] font-mono">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-gray-400">
            {pendingOrders.length > 0 ? 'Requires immediate action' : 'Queue clear'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>In Preparation</span>
            <Clock className="w-4 h-4 text-[#287D91]" />
          </div>
          <div className="text-2xl font-bold text-[#123B52] font-mono">
            {preparingOrders.length}
          </div>
          <div className="text-[11px] text-gray-400">On kitchen grill & bar</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-[#123B52] font-mono">
            {completedOrders.length}
          </div>
          <div className="text-[11px] text-gray-400">{totalOrders} total orders placed</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Calculated Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#123B52] font-mono">
            {formatEUR(totalRevenue)}
          </div>
          <div className="text-[11px] text-gray-400">From actual stored records</div>
        </div>
      </div>

      {/* Sold out notice if any */}
      {soldOutProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{soldOutProducts.length} menu items</strong> are currently marked as Sold Out (Unavailable).
            </span>
          </div>
          <Link
            to="/admin/inventory"
            className="text-amber-900 font-semibold underline hover:no-underline shrink-0"
          >
            Manage Stock →
          </Link>
        </div>
      )}

      {/* Live Order Queue Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">
            Recent Orders Queue
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#123B52] hover:text-[#287D91] flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No orders have been placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3">Order Ref</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Fulfillment</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
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
                      <div className="font-medium text-gray-900">{order.customer.fullName}</div>
                      <div className="text-[11px] text-gray-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-medium text-gray-700">
                        {order.orderType}
                      </span>
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
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'accepted', 'Accepted by dashboard staff')}
                          className="px-2.5 py-1 bg-[#123B52] hover:bg-[#287D91] text-white rounded text-[11px] font-semibold"
                        >
                          Accept
                        </button>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing', 'Sent to grill and fryer')}
                          className="px-2.5 py-1 bg-[#287D91] hover:bg-[#123B52] text-white rounded text-[11px] font-semibold"
                        >
                          Start Prep
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              order.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery',
                              'Food ready for customer'
                            )
                          }
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold"
                        >
                          Mark Ready
                        </button>
                      )}
                      {(order.status === 'ready_for_pickup' || order.status === 'out_for_delivery') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed', 'Order completed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Complete
                        </button>
                      )}
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="px-2 py-1 text-gray-500 hover:text-gray-900 border border-gray-200 rounded text-[11px]"
                      >
                        Details
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
