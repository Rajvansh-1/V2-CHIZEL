// src/utils/analytics.js

// Pageview tracker (already there)
export const trackPageview = (path) => {
  if (window.gtag) {
    window.gtag("config", "G-1GTSN1KFY1", {
      page_path: path,
    });
  }
};

// ✅ Event tracker
export const trackEvent = (action, category, label, value) => {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
