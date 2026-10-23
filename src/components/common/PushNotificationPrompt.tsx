import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  NotificationPermissionState,
} from '../../lib/pushNotifications';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

interface PushNotificationPromptProps {
  order?: Order;
}

export const PushNotificationPrompt: React.FC<PushNotificationPromptProps> = ({ order }) => {
  const [permission, setPermission] = useState<NotificationPermissionState>('default');
  const [testingStatus, setTestingStatus] = useState(false);
  const { triggerTestNotification } = useStore();

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
  };

  const handleTestChime = async () => {
    setTestingStatus(true);
    if (order) {
      await triggerTestNotification(order);
    } else {
      await triggerTestNotification();
    }
    setTimeout(() => setTestingStatus(false), 1000);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              permission === 'granted'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-[#123B52] text-white'
            }`}
          >
            {permission === 'granted' ? (
              <BellRing className="w-5 h-5 text-emerald-600 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5 text-[#A9D6D5]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-[#123B52]">
                Real-Time Order Push Notifications
              </h3>
              {permission === 'granted' && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {permission === 'granted'
                ? "You'll receive instant sound & screen alerts as the kitchen updates your order status."
                : 'Get notified on this device when our kitchen starts preparing your meal or dispatches delivery.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {permission !== 'granted' && permission !== 'unsupported' && (
            <button
              type="button"
              onClick={handleEnable}
              className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Notifications</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTestChime}
            disabled={testingStatus}
            className="px-3.5 py-2 bg-[#FAF7F0] hover:bg-gray-100 border border-[#123B52]/20 text-[#123B52] font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5"
            title="Preview how an order update notification sounds and displays"
          >
            <Send className="w-3.5 h-3.5 text-[#E98268]" />
            <span>{testingStatus ? 'Chiming...' : 'Test Notification'}</span>
          </button>
        </div>
      </div>

      {permission === 'denied' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Notifications are currently blocked in your browser settings. To receive sound alerts, enable notification permissions for this site. In-app alerts will continue to work while this page is open.
          </span>
        </div>
      )}
    </div>
  );
};
