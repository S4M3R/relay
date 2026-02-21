import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Extract token from URL and store in sessionStorage
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
  sessionStorage.setItem('relay-dashboard-token', token);
  // Remove token from URL for cleanliness
  const url = new URL(window.location.href);
  url.searchParams.delete('token');
  window.history.replaceState({}, '', url.toString());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dashboard">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
