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

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<StatusPage />} />
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
