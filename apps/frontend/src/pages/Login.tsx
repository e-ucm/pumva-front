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
    <div className="min-h-screen w-full flex flex-col">
        <div id="logout_header" ref={logoutHeaderRef} className="text-center py-2 bg-gray-100 text-gray-700 font-medium">
          Login
        </div>
        <iframe 
          id="sso_connect" 
          ref={iframeRef}
          className="flex-1 w-full border-0" 
          src="/api/ssoconnect"
          style={{ height: 'calc(100vh - 60px)' }}
        ></iframe>
    </div>
  )
}