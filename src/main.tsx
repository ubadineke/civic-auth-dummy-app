import { Buffer } from 'buffer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import App from './App.tsx';
import { config } from './wagmi.ts';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homeview from './HomeView.tsx';
import('./App.css');

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/home', element: <Homeview /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* <App /> */}
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
