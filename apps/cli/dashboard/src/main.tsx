import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Extract token from URL and store in both sessionStorage and cookie
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
  sessionStorage.setItem('relay-dashboard-token', token);
  document.cookie = `relay-token=${token}; path=/dashboard; SameSite=Strict`;
  // Remove token from URL for cleanliness
  const url = new URL(window.location.href);
  url.searchParams.delete('token');
  window.history.replaceState({}, '', url.toString());
} else {
  // Try restoring from cookie if sessionStorage is empty
  const stored = sessionStorage.getItem('relay-dashboard-token');
  if (!stored) {
    const match = document.cookie.match(/(?:^|; )relay-token=([^;]+)/);
    if (match) {
      sessionStorage.setItem('relay-dashboard-token', match[1]);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dashboard">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
