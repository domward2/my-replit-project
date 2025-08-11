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
    
    // Force immediate cache bypass for desktop
    const hasTimestamp = window.location.search.indexOf('t=') !== -1;
    if (!hasTimestamp) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const newUrl = `${window.location.origin}${window.location.pathname}?t=${timestamp}&r=${random}&desktop=1`;
      console.log('Desktop cache bypass redirect to:', newUrl);
      window.location.replace(newUrl);
    }
  }
})();