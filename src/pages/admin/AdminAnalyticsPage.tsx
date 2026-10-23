import React, { useState } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Store, Truck, Calendar } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatEUR } from '../../lib/order-pricing';

export const AdminAnalyticsPage: React.FC = () => {
  const { orders } = useStore();
  const [timeframe, setTimeframe] = useState<'all' | 'today' | 'week'>('all');

  const now = new Date();
  const filteredOrders = orders.filter((o) => {
    if (o.status === 'cancelled') return false;
    const orderDate = new Date(o.createdAt);
    if (timeframe === 'today') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (timeframe === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= sevenDaysAgo;
    }
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const pickupCount = filteredOrders.filter((o) => o.orderType === 'pickup').length;
  const deliveryCount = filteredOrders.filter((o) => o.orderType === 'delivery').length;

  // Item popularity frequency calculated from real order items
  const itemCounts = new Map<string, { name: string; count: number; revenue: number }>();
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemCounts.get(item.productId);
      if (existing) {
        existing.count += item.quantity;
        existing.revenue += item.calculatedItemTotal;
      } else {
        itemCounts.set(item.productId, {
          name: item.productName,
          count: item.quantity,
          revenue: item.calculatedItemTotal,
        });
      }
    });
  });

  const topItems = Array.from(itemCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Sales & Order Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Calculated strictly from genuine customer order records in the database.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200">
          {(['all', 'week', 'today'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                timeframe === t
                  ? 'bg-[#123B52] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t === 'all' ? 'All Time' : t === 'week' ? 'Past 7 Days' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {totalOrders === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-xs text-gray-400">
          No orders recorded within this timeframe.
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 block">Total Revenue</span>
              <div className="text-2xl font-bold text-[#123B52] font-mono">
                {formatEUR(totalRevenue)}
              </div>
              <div className="text-[11px] text-gray-400">Taxes & fees included</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 block">Total Orders</span>
              <div className="text-2xl font-bold text-[#123B52] font-mono">
                {totalOrders}
              </div>
              <div className="text-[11px] text-gray-400">Excludes cancelled</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 block">Average Order Value</span>
              <div className="text-2xl font-bold text-[#123B52] font-mono">
                {formatEUR(averageOrderValue)}
              </div>
              <div className="text-[11px] text-gray-400">Per customer order</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 block">Fulfillment Ratio</span>
              <div className="text-base font-bold text-gray-800">
                {pickupCount} Pickup · {deliveryCount} Delivery
              </div>
              <div className="text-[11px] text-gray-400">
                {totalOrders > 0
                  ? `${Math.round((pickupCount / totalOrders) * 100)}% counter collection`
                  : ''}
              </div>
            </div>
          </div>

          {/* Breakdown: Top Items & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Items Table */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-serif text-base font-bold text-[#123B52]">
                Most Ordered Dishes & Beverages
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-y border-gray-100">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty Sold</th>
                      <th className="py-2.5 px-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topItems.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/70">
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#123B52]">
                          {item.count}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-gray-700 font-sans">
                          {formatEUR(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-serif text-base font-bold text-[#123B52]">
                Payment Methods Distribution
              </h2>

              <div className="space-y-3 pt-2 text-xs">
                {['test_card', 'pay_at_pickup', 'pay_on_delivery'].map((method) => {
                  const count = filteredOrders.filter((o) => o.paymentMethod === method).length;
                  const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                  const labels: Record<string, string> = {
                    test_card: 'Online Card Payment',
                    pay_at_pickup: 'Pay at Counter (Collection)',
                    pay_on_delivery: 'Pay on Doorstep Delivery',
                  };

                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex justify-between font-medium text-gray-700">
                        <span>{labels[method]}</span>
                        <span>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#123B52] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
