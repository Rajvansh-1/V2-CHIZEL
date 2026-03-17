// src/components/ui/OfflineBanner.jsx
import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineBanner() {
  const { isOnline, isSlow } = useNetworkStatus();

  // Show banner if entirely offline, OR if connection is slow
  const shouldShow = !isOnline || isSlow;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        transform: shouldShow ? 'translateY(12px)' : 'translateY(-100px)'
      }}
    >
      <div 
        className="mx-auto px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 border pointer-events-auto"
        style={{
          background: !isOnline 
            ? 'rgba(220, 38, 38, 0.9)'  // Red for offline
            : 'rgba(245, 158, 11, 0.9)', // Amber for slow info
          borderColor: !isOnline ? 'rgba(248, 113, 113, 0.5)' : 'rgba(252, 211, 77, 0.5)'
        }}
      >
        <span className="text-lg">
          {!isOnline ? '⚡' : '🐢'}
        </span>
        <span className="text-white text-xs sm:text-sm font-ui font-black uppercase tracking-widest drop-shadow-md">
          {!isOnline ? 'No Internet — Using Cached Data' : 'Slow Connection Detected'}
        </span>
      </div>
    </div>
  );
}
