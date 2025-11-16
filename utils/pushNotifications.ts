
import { supabase } from '../services/supabaseClient';

// This is a VAPID public key. In a real application, this should be
// stored securely and likely fetched from an environment variable.
const VAPID_PUBLIC_KEY = 'BEH_Qz5D2cQ1pW-R2-oSTJk1tC5PajpJVj5sCv4JEv5sL7t1p-7DR22pLGTQ3Wf4w_h513b_xBls15lwy2-E1L4';

// This function is needed to convert the VAPID public key string into a format
// that the push manager can use.
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribes the user to push notifications and saves the subscription to the backend.
 * NOTE: This requires a `push_subscriptions` table in Supabase with at least
 * `user_id` (UUID, foreign key to profiles.id) and `subscription_object` (JSONB) columns.
 * You will need to set up this table and its policies in your Supabase project.
 */
export async function subscribeUser(userId: string) {
  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (subscription === null) {
      console.log('No subscription found, creating new one.');
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send to server (Supabase)
      const { error } = await supabase.from('push_subscriptions').insert({
        user_id: userId,
        subscription_object: newSubscription,
      });

      if (error) {
          throw new Error('Failed to save push subscription: ' + error.message);
      }
      console.log('New push subscription saved.');

    } else {
      console.log('User is already subscribed.');
      // Optional: You could add logic here to re-sync the subscription with your backend if needed.
    }
  } catch (err) {
    console.error('Failed to subscribe the user for push notifications: ', err);
  }
}
