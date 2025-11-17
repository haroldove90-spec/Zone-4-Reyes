
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('/sw.js', window.location.origin)).then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // This fires when the service worker controlling this page changes.
      // We should reload the page to let the new service worker take control.
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });

      // This logic checks for updates to the service worker.
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated precached content has been fetched,
                // but the old service worker will still serve the older
                // content until all client tabs are closed. We can prompt the user to refresh.
                console.log('New content is available and will be used when all tabs for this page are closed.');
                // We dispatch a custom event that the React app can listen for.
                const event = new CustomEvent('swUpdate', { detail: registration });
                window.dispatchEvent(event);
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is cached for offline use.');
              }
            }
          };
        }
      };
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);