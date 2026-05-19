'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f172a',
          color: '#fff',
          borderRadius: '1rem',
          padding: '1rem 1.5rem',
          fontWeight: 'bold',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
