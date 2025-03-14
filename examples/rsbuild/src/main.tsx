import { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Page from './page';
import 'maplibre-gl/dist/maplibre-gl.css';
import './_global.css';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
);
