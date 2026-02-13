import React, { useEffect, useRef } from 'react'

export default function Login() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const logoutHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const logoutHeader = logoutHeaderRef.current;

    if (iframe) {
      const handleIframeLoad = () => {
        try {
          const currentUrl = iframe.contentWindow?.location.href;
          if (logoutHeader) {
            logoutHeader.remove();
          }
          if (currentUrl) {
            // If we're still on the ssoconnect endpoint, redirect to home
            let redirectUrl = currentUrl;
            if (currentUrl.includes('/ssoconnect') || currentUrl.includes('/api/ssoconnect')) {
              redirectUrl = window.location.origin + '/';
            }
            
            // Update the parent window URL
            window.history.replaceState({}, '', redirectUrl);
            window.location.href = redirectUrl;
            console.log('Iframe loaded new URL:', currentUrl);
            console.log('Detected SSO finished, redirecting to:', redirectUrl);
          }
        } catch(e) {
          console.log('Cross-origin, cannot access URL');
        }
      };

      iframe.addEventListener('load', handleIframeLoad);

      // Cleanup event listener on component unmount
      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
  }, []);

  return (
    <div>
        <div id="logout_header" ref={logoutHeaderRef}>Login</div>
        <iframe 
          id="sso_connect" 
          ref={iframeRef}
          className="content_filled" 
          src="/api/ssoconnect"
        ></iframe>
    </div>
  )
}