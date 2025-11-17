
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Register the service worker for Progressive Web App functionality.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered successfully:', registration);

      // This logic listens for a new service worker being installed.
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // A new SW is installed and waiting to take control.
                // We dispatch a custom event that the App component can listen for.
                console.log('New content is available; please refresh.');
                const event = new CustomEvent('swUpdate', { detail: registration });
                window.dispatchEvent(event);
              } else {
                // Everything has been precached.
                console.log('Content is cached for offline use.');
              }
            }
          };
        }
      };
    }).catch(registrationError => {
      console.error('SW registration failed: ', registrationError);
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