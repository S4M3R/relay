import { Routes, Route } from 'react-router-dom';

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-mono text-white/80">{name}</h1>
        <p className="text-white/40 mt-2">Coming soon</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Relay Dashboard" />} />
    </Routes>
  );
}
