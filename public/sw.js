self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  console.log('Push notification received', event);
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // 既に開いているウィンドウがあるか確認
    let matchingClient = windowClients.find((windowClient) => {
      return windowClient.url === urlToOpen;
    });

    if (matchingClient) {
      return matchingClient.focus();
    }
    
    return clients.openWindow(urlToOpen);
  });

  event.waitUntil(promiseChain);
});