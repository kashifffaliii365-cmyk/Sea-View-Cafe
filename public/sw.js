// Sea View Cafe/Bar Service Worker for Web Push & Order Updates

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for incoming Web Push events
self.addEventListener('push', (event) => {
  let data = {
    title: 'Sea View Cafe/Bar Update',
    body: 'Your order status has changed.',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge.png',
    tag: 'order-status',
    data: { url: '/track-order' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=192&q=80',
    badge: data.badge || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=96&q=80',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/track-order' },
    tag: data.tag || 'seaview-order',
    renotify: true,
    actions: [
      { action: 'track', title: 'View Order' },
      { action: 'dismiss', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click to navigate to the order tracking / confirmation page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/track-order';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
