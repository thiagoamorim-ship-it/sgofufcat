import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* Rotas dos módulos serão adicionadas aqui */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
