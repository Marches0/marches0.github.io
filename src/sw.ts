import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute((self as any).__WB_MANIFEST);


/* async function registerPeriodicNewsCheck() {
    const registration = await navigator.serviceWorker.ready;
    try {
      await registration.periodicSync.register('get-latest-news', {
        minInterval: 24 * 60 * 60 * 1000,
      });
    } catch {
      console.log('Periodic Sync could not be registered!');
    }
  } */