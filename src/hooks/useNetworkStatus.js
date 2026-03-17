// src/hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to track internet connectivity and speed (2G / slow connection).
 * Fully respects browser limitations and degrades gracefully.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    // 1. Basic Online/Offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Advanced Network Information API (Chrome/Edge/Android only)
    let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const checkConnectionSpeed = () => {
      if (!connection) return;
      // 'effectiveType' indicates the measured connection quality (4g, 3g, 2g, slow-2g)
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        setIsSlow(true);
      } else {
        setIsSlow(false);
      }
    };

    if (connection) {
      checkConnectionSpeed();
      connection.addEventListener('change', checkConnectionSpeed);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', checkConnectionSpeed);
      }
    };
  }, []);

  return { isOnline, isSlow };
}
