import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { supabase } from './lib/supabase';
import {
  buscarPerfilUsuario,
  usuarioEhAdministrador,
  type UsuarioPerfil,
} from './lib/auth';

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
import Usuarios from './pages/Usuarios';

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

function UsuarioBloqueado() {
  async function sair() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002B49] text-sm font-bold text-white">
          SGO
        </div>

        <h1 className="mt-5 text-xl font-bold text-slate-900">
          Acesso indisponível
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Seu usuário não possui acesso ativo ao SGOF.
          Entre em contato com o administrador do sistema.
        </p>

        <button
          type="button"
          onClick={sair}
          className="mt-6 w-full rounded-xl bg-[#002B49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003d66]"
        >
          Voltar ao login
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function carregarAcesso(
      currentSession: Session | null,
    ) {
      if (!mounted) return;

      setSession(currentSession);

      if (!currentSession?.user) {
        setPerfil(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const perfilUsuario = await buscarPerfilUsuario(
        currentSession.user.id,
      );

      if (!mounted) return;

      setPerfil(perfilUsuario);
      setLoading(false);
    }

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      await carregarAcesso(currentSession);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        void carregarAcesso(currentSession);
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

  if (session && (!perfil || !perfil.ativo)) {
    return <UsuarioBloqueado />;
  }

  const administrador =
    usuarioEhAdministrador(perfil);

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

        {/* Área autenticada */}
        <Route
          path="/*"
          element={
            session && perfil ? (
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

                  {/* Administração */}
                  <Route
                    path="/administracao/usuarios"
                    element={
                      administrador ? (
                        <Usuarios />
                      ) : (
                        <Navigate to="/" replace />
                      )
                    }
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
