import {
  BookOpen,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Calculator,
  FileText,
  Library,
  ClipboardCheck,
  Settings,
  FileSignature,
  FolderOpen,
  ExternalLink,
  Landmark,
} from 'lucide-react';

import { useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Visão Geral', icon: LayoutDashboard, path: '/' },
  { label: 'Notas Fiscais', icon: ReceiptText, path: '/notas-fiscais' },
  { label: 'Regularidade', icon: ShieldCheck, path: '/regularidade' },
  { label: 'Retenções', icon: Calculator, path: '/retencoes' },
  { label: 'Calculadoras', icon: Calculator, path: '/calculadoras' },
  { label: 'Documentos', icon: FileText, path: '/documentos' },
 {
  label: 'Base de Conhecimento',
  icon: BookOpen,
  path: '/base-conhecimento',
},
  { label: 'Guia Operacional', icon: ClipboardCheck, path: '/checklist' },
];

const quickLinks = [
  {
    label: 'SIAFI',
    icon: Landmark,
    url: 'https://siafi.tesouro.gov.br',
  },
  {
    label: 'Contratos.gov.br',
    icon: FileSignature,
    url: 'https://contratos.gov.br',
  },
  {
    label: 'SEI • UFCAT',
    icon: FolderOpen,
    url: 'https://sei.ufcat.edu.br',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

      {/* Identidade */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002B49] text-sm font-bold text-white">
          SGO
        </div>

        <div>
          <h1 className="font-bold text-slate-900">
            SGO
          </h1>

          <p className="text-xs text-slate-500">
            HU-UFCAT
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto p-3">

        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Gestão
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <a
                key={item.label}
                href={item.path}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Acesso rápido */}
        <div className="mt-6 border-t border-slate-100 pt-5">

          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Acesso rápido
          </p>

          <div className="space-y-1">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon size={19} />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  <ExternalLink
                    size={14}
                    className="text-slate-300 transition group-hover:text-blue-500"
                  />
                </a>
              );
            })}
          </div>

        </div>

      </nav>

      {/* Configurações */}
      <div className="border-t border-slate-100 p-3">

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Settings size={19} />
          Configurações
        </button>

      </div>

    </aside>
  );
}
