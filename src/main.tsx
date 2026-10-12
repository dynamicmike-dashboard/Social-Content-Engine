import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import App from './App.tsx';
import './index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn('VITE_CLERK_PUBLISHABLE_KEY not configured. Authentication will not work.');
}

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={publishableKey || ''}>
    <App />
  </ClerkProvider>
);
