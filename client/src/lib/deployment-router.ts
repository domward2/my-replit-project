// Deployment-specific routing that handles different environments
export function isDeploymentEnvironment(): boolean {
  // Check if we're in a deployment environment vs development
  return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
}

export function handlePostLoginRedirect(): void {
  const isDeployed = isDeploymentEnvironment();
  
  if (isDeployed) {
    // For deployment environments, use aggressive cache-busting reload
    console.log('Deployment environment detected - using cache-busting reload');
    
    // Clear all possible cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Force immediate cache-busting reload with multiple methods
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    
    // Method 1: Replace with cache-busting query params and force reload
    window.location.replace(`/?cb=${timestamp}&r=${randomId}&force_reload=1`);
    
  } else {
    // For development, use standard methods
    console.log('Development environment - using standard navigation');
    window.location.href = '/';
  }
}

export function initializeDeploymentRouter(): void {
  // Listen for hash changes to handle deployment routing
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#dashboard') {
      // Force a page reload when hash changes to dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  });
}