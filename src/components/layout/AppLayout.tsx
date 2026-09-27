import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import Sidebar from './Sidebar';

import { supabase } from '../../lib/supabase';
import {
  buscarPerfilUsuario,
  type UsuarioPerfil,
} from '../../lib/auth';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [perfil, setPerfil] =
    useState<UsuarioPerfil | null>(null);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [saindo, setSaindo] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function carregarPerfil() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !mounted) {
        return;
      }

      const perfilUsuario =
        await buscarPerfilUsuario(user.id);

      if (mounted) {
        setPerfil(perfilUsuario);
      }
    }

    void carregarPerfil();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  async function handleLogout() {
    setSaindo(true);

    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = '/login';
    }
  }

  function obterIniciais() {
    if (perfil?.nome) {
      const partes = perfil.nome
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      if (partes.length >= 2) {
        return `${partes[0][0]}${
          partes[partes.length - 1][0]
        }`.toUpperCase();
      }

      return partes[0]?.slice(0, 2).toUpperCase() || 'HU';
    }

    return 'HU';
  }

  const nomeExibicao =
    perfil?.nome || 'Usuário SGOF';

  const perfilExibicao =
    perfil?.perfil === 'administrador'
      ? 'Administrador'
      : 'Usuário';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  SGO • HU-UFCAT
                </p>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Gestão Orçamentária e Financeira
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-500 transition hover:bg-slate-50 md:flex"
                aria-label="Pesquisar"
              >
                <Search size={17} />
                Pesquisar
              </button>

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Notificações"
              >
                <Bell size={18} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {/* Usuário */}
              <div
                ref={userMenuRef}
                className="relative ml-1"
              >
                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(
                      (current) => !current,
                    )
                  }
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pr-2 transition hover:bg-slate-50"
                  aria-label="Menu do usuário"
                  aria-expanded={userMenuOpen}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#002B49] text-xs font-bold text-white">
                    {obterIniciais()}
                  </div>

                  <div className="hidden max-w-36 text-left xl:block">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {nomeExibicao}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {perfilExibicao}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`hidden text-slate-400 transition-transform sm:block ${
                      userMenuOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#002B49] text-sm font-bold text-white">
                          {obterIniciais()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {nomeExibicao}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {perfil?.email || ''}
                          </p>

                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                            {perfil?.perfil ===
                            'administrador' ? (
                              <ShieldCheck
                                size={12}
                              />
                            ) : (
                              <UserRound
                                size={12}
                              />
                            )}

                            {perfilExibicao}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() =>
                          void handleLogout()
                        }
                        disabled={saindo}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <LogOut size={17} />

                        {saindo
                          ? 'Saindo...'
                          : 'Sair do SGOF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

          <footer className="border-t border-slate-200 bg-white px-6 py-4">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-1 text-xs text-slate-400 sm:flex-row">
              <span>
                SGO • Sistema de Gestão Orçamentária
              </span>

              <span>
                HU-UFCAT
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
