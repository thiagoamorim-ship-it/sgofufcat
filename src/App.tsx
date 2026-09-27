import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { supabase } from './lib/supabase';

import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import RedefinirSenha from './pages/RedefinirSenha';
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

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002B49] text-sm font-bold text-white shadow-sm">
          SGO
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-700">
          SGOF • HU-UFCAT
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Verificando acesso...
        </p>

        <div className="mx-auto mt-4 h-1 w-28 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(currentSession);
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas públicas */}
        <Route
          path="/login"
          element={
            session ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/redefinir-senha"
          element={<RedefinirSenha />}
        />

        {/* Área protegida */}
        <Route
          path="/*"
          element={
            session ? (
              <AppLayout>
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/notas-fiscais"
                    element={<NotasFiscais />}
                  />

                  <Route
                    path="/regularidade"
                    element={<Regularidade />}
                  />

                  <Route
                    path="/retencoes"
                    element={<Retencoes />}
                  />

                  <Route
                    path="/calculadoras"
                    element={<Calculadoras />}
                  />

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

                  <Route
                    path="/checklist"
                    element={<Checklist />}
                  />

                  <Route
                    path="/checklist/disponibilidade"
                    element={<DisponibilidadeOrcamentaria />}
                  />

                  <Route
                    path="/checklist/empenho"
                    element={<Empenho />}
                  />

                  <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                  />
                </Routes>
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
