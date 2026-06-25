import '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from './components/ui/sonner';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 phút
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <React.Suspense>
        <App />
        <Toaster position='top-right' expand richColors />
      </React.Suspense>
    </QueryClientProvider>
  </BrowserRouter>
  // </StrictMode>
);
