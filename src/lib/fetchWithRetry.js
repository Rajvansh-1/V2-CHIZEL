// src/lib/fetchWithRetry.js

/**
 * A custom fetch wrapper that adds:
 * 1. Exponential backoff retries on network failures
 * 2. Timeout aborts (so slow connections don't hang indefinitely)
 * 3. Instant fail if `navigator.onLine` is false
 */
export async function fetchWithRetry(url, options = {}, retries = 3) {
  const timeoutMs = 12000; // 12 seconds per attempt
  
  for (let i = 0; i <= retries; i++) {
    // If we're strictly offline, don't even try, fail fast
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('Offline');
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(id);

      // We only retry on 5xx errors (server) or 429 (rate limit)
      // Normal 4xx errors (unauthorized, not found) should just return immediately
      if (!response.ok && (response.status >= 500 || response.status === 429)) {
        throw new Error(`Server Error: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(id);
      
      const isConfigError = error.message.includes('Offline') || error.name === 'AbortError' || error.message.includes('Server Error');
      
      // If it's the last attempt, or it's a non-retryable error, throw
      if (i === retries || (!isConfigError && error.name !== 'TypeError')) {
        throw error; // TypeError is usually "Failed to fetch" (network down)
      }

      // Exponential backoff: 500ms, 1000ms, 2000ms
      const delay = Math.pow(2, i) * 500;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}
