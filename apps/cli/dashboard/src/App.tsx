import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import StatusPage from './pages/StatusPage';
import InstancesPage from './pages/InstancesPage';
import InstanceDetailPage from './pages/InstanceDetailPage';
import CreateInstancePage from './pages/CreateInstancePage';
import TranscriptPage from './pages/TranscriptPage';
import LoginPage from './pages/LoginPage';
import ConfigPage from './pages/ConfigPage';
import CallPage from './pages/CallPage';
import TelegramLoginPage from './pages/TelegramLoginPage';
import ContactsPage from './pages/ContactsPage';
import ContactDetailPage from './pages/ContactDetailPage';
import { setOnUnauthorized } from './lib/api';

function UnauthorizedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="max-w-md w-full rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-semibold text-white mb-2">Session Expired</h1>
        <p className="text-white/50 mb-6">
          Your dashboard token is invalid or has expired. Run the following command to open a new session:
        </p>
        <div className="rounded-lg bg-black/50 border border-white/10 p-4 mb-6">
          <code className="text-cyan-400 font-mono text-sm">relay dashboard</code>
        </div>
        <p className="text-white/30 text-xs">
          This generates a new auth token and opens the dashboard in your browser.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    // Check if we have a token at all on mount
    const hasToken =
      sessionStorage.getItem('relay-dashboard-token') ||
      document.cookie.match(/(?:^|; )relay-token=([^;]+)/);
    if (!hasToken) {
      setUnauthorized(true);
    }

    // Listen for 401s from API calls
    setOnUnauthorized(() => setUnauthorized(true));
    return () => setOnUnauthorized(null);
  }, []);

  if (unauthorized) {
    return <UnauthorizedScreen />;
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<StatusPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/contacts/:id" element={<ContactDetailPage />} />
        <Route path="/instances" element={<InstancesPage />} />
        <Route path="/instances/new" element={<CreateInstancePage />} />
        <Route path="/instances/:id" element={<InstanceDetailPage />} />
        <Route path="/instances/:id/transcript" element={<TranscriptPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/telegram-login" element={<TelegramLoginPage />} />
      </Route>
    </Routes>
  );
}
