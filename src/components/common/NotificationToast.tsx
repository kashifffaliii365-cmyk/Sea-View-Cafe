import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, ArrowRight, CheckCircle2, Clock, Truck, Store } from 'lucide-react';
import { AppNotification } from '../../lib/pushNotifications';

interface NotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const navigate = useNavigate();

  if (!notification) return null;

  const handleClick = () => {
    onClose();
    if (notification.url) {
      navigate(notification.url);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'preparing':
        return <Clock className="w-5 h-5 text-[#A9D6D5]" />;
      case 'ready_for_pickup':
        return <Store className="w-5 h-5 text-[#E98268]" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-[#E98268]" />;
      default:
        return <Bell className="w-5 h-5 text-[#A9D6D5]" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#123B52] text-white rounded-xl shadow-2xl border border-[#287D91]/40 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <div className="p-4 flex items-start gap-3">
        <div className="p-2 bg-[#287D91]/30 rounded-lg shrink-0 mt-0.5">
          {getStatusIcon(notification.status)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#A9D6D5] font-semibold">
              Live Order Update
            </span>
            <span className="text-[10px] text-[#FAF7F0]/60">Just now</span>
          </div>

          <h4 className="font-serif text-sm font-bold text-white mt-0.5 truncate">
            {notification.title}
          </h4>

          <p className="text-xs text-[#FAF7F0]/85 mt-1 leading-snug">
            {notification.body}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#287D91]/30">
            <button
              onClick={handleClick}
              className="text-xs font-semibold text-[#A9D6D5] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Order Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="text-[11px] text-[#FAF7F0]/60 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle animated timer bar */}
      <div className="h-0.5 bg-[#E98268] w-full" />
    </div>
  );
};
