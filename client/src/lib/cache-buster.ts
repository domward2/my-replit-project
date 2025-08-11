// Desktop cache busting utilities
export function forceDesktopRefresh() {
  const isDesktop = !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  
  if (isDesktop) {
    console.log('Desktop detected - applying aggressive cache clearing');
    
    // Clear service worker caches
    if ('serviceWorker' in navigator && 'caches' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({type: 'CLEAR_CACHE'});
      });
      
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Force page reload with cache bypass
    setTimeout(() => {
      window.location.reload(true as any);
    }, 500);
  }
}

export function addCacheBustingHeaders(headers: HeadersInit = {}): HeadersInit {
  return {
    ...headers,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
}