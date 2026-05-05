import React from 'react';
import ReactDOM from 'react-dom/client';
import './browser';
import App from './App';

// Initialize React
function initReact() {
  try {
    console.log('🚀 Starting MeshVault React initialization...');
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error('❌ Root element (#root) not found!');
      document.body.innerHTML = '<div style="padding: 2rem; font-family: sans-serif; text-align: center;"><h1>❌ Error</h1><p>Root element not found. Check index.html</p></div>';
      return;
    }

    console.log('✅ Root element found, rendering React...');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ React app rendered successfully!');
  } catch (error) {
    console.error('❌ React initialization error:', error);
    document.body.innerHTML = `<div style="padding: 2rem; font-family: sans-serif;"><h1>❌ Error</h1><p>${error.message}</p></div>`;
  }
}

// Initialize React immediately (don't wait for browser.js)
console.log('📄 index.jsx loaded, scheduling React init...');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReact);
} else {
  // DOM already loaded
  initReact();
}
