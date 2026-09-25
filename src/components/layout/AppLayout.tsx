import { Bell, Menu, Search } from 'lucide-react';
import Sidebar from './Sidebar';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">

            <div className="flex items-center gap-3">

              <button
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
                className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-500 transition hover:bg-slate-50 md:flex"
                aria-label="Pesquisar"
              >
                <Search size={17} />
                Pesquisar
              </button>

              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Notificações"
              >
                <Bell size={18} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#002B49] text-sm font-bold text-white">
                HU
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
