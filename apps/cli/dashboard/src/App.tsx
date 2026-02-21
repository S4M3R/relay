import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

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
        <Route path="/" element={<Placeholder name="Status" />} />
        <Route path="/instances" element={<Placeholder name="Instances" />} />
        <Route path="/instances/new" element={<Placeholder name="Create Instance" />} />
        <Route path="/instances/:id" element={<Placeholder name="Instance Detail" />} />
        <Route path="/instances/:id/transcript" element={<Placeholder name="Transcript" />} />
        <Route path="/login" element={<Placeholder name="Login" />} />
        <Route path="/config" element={<Placeholder name="Config" />} />
        <Route path="/call" element={<Placeholder name="Call" />} />
      </Route>
    </Routes>
  );
}
