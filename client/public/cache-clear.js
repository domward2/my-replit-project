// Immediate cache clearing script for desktop browsers
(function() {
  const isDesktop = !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  
  if (isDesktop) {
    console.log('Desktop cache clearing script loaded');
    
    // Clear all possible browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
        console.log('Cleared', names.length, 'cache stores');
      });
    }
    
    // Add cache-busting to current page if needed
    if (window.location.search.indexOf('cb=') === -1) {
      const separator = window.location.search ? '&' : '?';
      const newUrl = window.location.origin + window.location.pathname + separator + 'cb=' + Date.now();
      if (performance.navigation.type !== 1) { // Not a reload
        window.location.replace(newUrl);
      }
    }
  }
})();