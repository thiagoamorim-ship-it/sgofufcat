import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import NotasFiscais from './pages/NotasFiscais';
import Regularidade from './pages/Regularidade';
import Retencoes from './pages/Retencoes';
import Calculadoras from './pages/Calculadoras';
import AcrescimoSupressao from './pages/AcrescimoSupressao';
import BaseConhecimento from './pages/BaseConhecimento';
import EstruturaOrcamentaria from './pages/EstruturaOrcamentaria';
import BaseRetencoes from './pages/BaseRetencoes';
import TiposEmpenho from './pages/TiposEmpenho';
import ClassificadorOrcamentario from './pages/ClassificadorOrcamentario';
import Checklist from './pages/Checklist';
import DisponibilidadeOrcamentaria from './pages/DisponibilidadeOrcamentaria';
import Empenho from './pages/Empenho';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notas-fiscais" element={<NotasFiscais />} />
          <Route path="/regularidade" element={<Regularidade />} />
          <Route path="/retencoes" element={<Retencoes />} />

          <Route path="/calculadoras" element={<Calculadoras />} />
          <Route
            path="/calculadoras/acrescimo-supressao"
            element={<AcrescimoSupressao />}
          />

          <Route
            path="/base-conhecimento"
            element={<BaseConhecimento />}
          />

          <Route
            path="/base-conhecimento/estrutura-orcamentaria"
            element={<EstruturaOrcamentaria />}
          />

          <Route
            path="/base-conhecimento/retencoes"
            element={<BaseRetencoes />}
          />

          <Route
            path="/base-conhecimento/tipos-empenho"
            element={<TiposEmpenho />}
          />

          <Route
            path="/base-conhecimento/classificador-orcamentario"
            element={<ClassificadorOrcamentario />}
          />

          <Route path="/checklist" element={<Checklist />} />

          <Route
            path="/checklist/disponibilidade"
            element={<DisponibilidadeOrcamentaria />}
          />

          <Route
            path="/checklist/empenho"
            element={<Empenho />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
