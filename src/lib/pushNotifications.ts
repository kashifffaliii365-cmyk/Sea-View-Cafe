import { Order, OrderStatus } from '../types';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export interface AppNotification {
  id: string;
  orderId: string;
  orderNumber: string;
  title: string;
  body: string;
  status: OrderStatus;
  timestamp: string;
  url: string;
  isRead: boolean;
}

// Synthesise an elegant notification chime using the Web Audio API
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell chime: two frequencies (E5 and B5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(987.77, now); // B5

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.85);
    osc2.stop(now + 0.85);
  } catch {
    // Audio context might be restricted before user gesture
  }
}

// Register service worker if available
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch (error) {
    console.warn('Service worker registration error:', error);
    return null;
  }
}

// Get current permission status
export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Request permission from the user
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerServiceWorker();
      playNotificationSound();
    }
    return permission;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return Notification.permission;
  }
}

// Format status title & message
export function getStatusNotificationContent(order: Order, newStatus: OrderStatus): { title: string; body: string } {
  switch (newStatus) {
    case 'accepted':
      return {
        title: `Order Accepted · ${order.orderNumber}`,
        body: 'Sea View Cafe/Bar staff accepted your order. Getting ready for the kitchen.',
      };
    case 'preparing':
      return {
        title: `Kitchen Preparing · ${order.orderNumber}`,
        body: 'Your meals and drinks are now on the grill and bar in Mellieħa.',
      };
    case 'ready_for_pickup':
      return {
        title: `Ready for Collection! · ${order.orderNumber}`,
        body: 'Your order is hot, packed, and waiting at our counter in Triq Salvinu Vella.',
      };
    case 'out_for_delivery':
      return {
        title: `Out for Delivery! · ${order.orderNumber}`,
        body: `Our local courier is on the way with your order to ${order.customer.locality || 'your address'}.`,
      };
    case 'completed':
      return {
        title: `Order Completed · ${order.orderNumber}`,
        body: 'Thank you for ordering with Sea View Cafe/Bar. Enjoy your meal!',
      };
    case 'cancelled':
      return {
        title: `Order Cancelled · ${order.orderNumber}`,
        body: order.cancellationReason
          ? `Order cancelled: ${order.cancellationReason}`
          : 'Your order has been cancelled. Please contact the café for details.',
      };
    default:
      return {
        title: `Order Update · ${order.orderNumber}`,
        body: `Your order status changed to ${newStatus.replace(/_/g, ' ')}.`,
      };
  }
}

// Trigger Web Push and In-App alert
export async function dispatchOrderStatusNotification(
  order: Order,
  newStatus: OrderStatus
): Promise<AppNotification> {
  const { title, body } = getStatusNotificationContent(order, newStatus);
  const targetUrl = `/order-confirmation/${order.id}`;

  const notificationItem: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    title,
    body,
    status: newStatus,
    timestamp: new Date().toISOString(),
    url: targetUrl,
    isRead: false,
  };

  // 1. Play sound
  playNotificationSound();

  // 2. Save to localStorage notifications feed
  try {
    const raw = localStorage.getItem('seaview_notifications');
    const existing: AppNotification[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(
      'seaview_notifications',
      JSON.stringify([notificationItem, ...existing.slice(0, 49)])
    );
  } catch {
    // Ignore storage quota
  }

  // 3. Native Browser Notification (if permission granted)
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && 'showNotification' in reg) {
          await reg.showNotification(title, {
            body,
            icon: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=192&q=80',
            badge: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=96&q=80',
            data: { url: targetUrl },
            tag: `order-${order.id}`,
          } as any);
          return notificationItem;
        }
      }
      // Direct Notification fallback if serviceWorker.ready is unavailable
      new Notification(title, {
        body,
        icon: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=192&q=80',
      });
    } catch (err) {
      console.warn('Native notification display failed (may be restricted in iframe):', err);
    }
  }

  return notificationItem;
}
