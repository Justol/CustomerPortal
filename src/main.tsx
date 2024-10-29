import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/lib/auth-context';
import { Providers } from '@/lib/providers';
import { Toaster } from '@/components/ui/toaster';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </Providers>
  </StrictMode>
);