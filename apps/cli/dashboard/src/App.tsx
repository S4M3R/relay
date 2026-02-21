import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import StatusPage from './pages/StatusPage';
import InstancesPage from './pages/InstancesPage';
import InstanceDetailPage from './pages/InstanceDetailPage';
import CreateInstancePage from './pages/CreateInstancePage';
import TranscriptPage from './pages/TranscriptPage';

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-mono text-white/80">{name}</h1>
        <p className="text-white/40 mt-2 font-mono text-sm">Coming soon</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<StatusPage />} />
        <Route path="/instances" element={<InstancesPage />} />
        <Route path="/instances/new" element={<CreateInstancePage />} />
        <Route path="/instances/:id" element={<InstanceDetailPage />} />
        <Route path="/instances/:id/transcript" element={<TranscriptPage />} />
        <Route path="/login" element={<Placeholder name="Login" />} />
        <Route path="/config" element={<Placeholder name="Config" />} />
        <Route path="/call" element={<Placeholder name="Call" />} />
      </Route>
    </Routes>
  );
}
