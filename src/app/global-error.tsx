'use client';

import { useEffect } from 'react';

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our internal error logging API
    fetch('/api/logs/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: { message: error.message, stack: error.stack },
        pageUrl: window.location.href,
        activityContext: 'Global Error Boundary (Root)',
      }),
    }).catch(err => console.error('Failed to log error to backend:', err));
  }, [error]);
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        margin: 0,
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0', color: '#e11d48' }}>
          Something went wrong!
        </h2>
        <p style={{ color: '#a3a3a3', maxWidth: '500px', marginBottom: '20px' }}>
          An unexpected error occurred. Please try reloading the page.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e11d48',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
