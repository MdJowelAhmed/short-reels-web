import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [showFallback, setShowFallback] = useState(false);
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    // Get video ID from URL path
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    setVideoId(id);

    // Custom scheme URL for the app
    const appSchemeUrl = 'creepyshorts://shorts/' + id;

    // Store URLs
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.victorsaulmendozamena.creepyshorts';
    const appStoreUrl = 'https://apps.apple.com/app/idYOUR_APP_STORE_ID';

    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // Try to open app with custom scheme
    const tryOpenApp = () => {
      const startTime = Date.now();

      // Create hidden iframe to attempt app open (for older browsers)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appSchemeUrl;
      document.body.appendChild(iframe);

      // Also try direct location change (for newer browsers)
      setTimeout(() => {
        window.location.href = appSchemeUrl;
      }, 100);

      // Check if app opened (if still on page after delay, app didn't open)
      setTimeout(() => {
        const elapsed = Date.now() - startTime;

        // If we're still here after 2.5 seconds, the app probably didn't open
        if (elapsed < 3000) {
          // Show download buttons
          setShowFallback(true);

          // Auto-redirect to store based on platform
          if (isAndroid) {
            // For Android, try intent URL first
            window.location.href = 'intent://shorts/' + id +
              '#Intent;scheme=creepyshorts;package=com.victorsaulmendozamena.creepyshorts;' +
              'S.browser_fallback_url=' + encodeURIComponent(playStoreUrl) + ';end';
          }
          // iOS will handle via Smart App Banner or manual click
        }
      }, 2500);
    };

    // Start app open attempt
    tryOpenApp();
  }, []);

  return (
    <div className="container">
      {/* Logo */}
      <div className="logo">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      <h1>Creepy Shorts</h1>
      <p className="subtitle">Opening the video in Creepy Shorts app...</p>

      {/* Loading indicator */}
      <div className={`loading ${showFallback ? 'hidden' : ''}`} id="loading">
        <div className="spinner"></div>
        <span>Redirecting to app...</span>
      </div>

      {/* Fallback content (shows if app redirect fails) */}
      <div
        id="fallback-content"
        className={`fallback-content ${showFallback ? 'show' : ''}`}
      >
        <div className="or-divider">App not installed?</div>

        <div className="store-buttons">
          <a
            href="https://play.google.com/store/apps/details?id=com.victorsaulmendozamena.creepyshorts"
            className="store-btn android"
            id="playstore-btn"
          >
            <svg viewBox="0 0 24 24">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            Download from Play Store
          </a>

          <a
            href="https://apps.apple.com/app/idYOUR_APP_STORE_ID"
            className="store-btn ios"
            id="appstore-btn"
          >
            <svg viewBox="0 0 24 24">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
            </svg>
            Download from App Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
