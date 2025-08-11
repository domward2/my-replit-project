// Deployment-specific routing that handles different environments
export function isDeploymentEnvironment(): boolean {
  // Check if we're in a deployment environment vs development
  return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
}

export function handlePostLoginRedirect(): void {
  const isDeployed = isDeploymentEnvironment();
  
  if (isDeployed) {
    // For deployment environments, use history manipulation + hash
    console.log('Deployment environment detected - using hash navigation');
    
    // Method 1: Use hash-based navigation (works in all deployment environments)
    window.location.hash = '#dashboard';
    
    // Method 2: Force history manipulation
    setTimeout(() => {
      window.history.pushState({}, '', '/');
      window.history.replaceState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 50);
    
    // Method 3: Force page reload with timestamp to bypass cache
    setTimeout(() => {
      const timestamp = Date.now();
      window.location.href = `/?t=${timestamp}`;
    }, 200);
    
    // Method 4: Last resort - full reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
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