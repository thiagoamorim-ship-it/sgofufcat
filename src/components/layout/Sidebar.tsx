import {
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Calculator,
  FileText,
  Landmark,
  Library,
  ClipboardCheck,
  Settings,
} from 'lucide-react';

const menuItems = [
  { label: 'Visão Geral', icon: LayoutDashboard },
  { label: 'Notas Fiscais', icon: ReceiptText },
  { label: 'Regularidade', icon: ShieldCheck },
  { label: 'Retenções', icon: Calculator },
  { label: 'Calculadoras', icon: Calculator },
  { label: 'Documentos', icon: FileText },
  { label: 'SIAFI', icon: Landmark },
  { label: 'Base de Conhecimento', icon: Library },
  { label: 'Checklist', icon: ClipboardCheck },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002B49] text-sm font-bold text-white">
          SGO
        </div>

        <div>
          <h1 className="font-bold text-slate-900">SGO</h1>
          <p className="text-xs text-slate-500">HU-UFCAT</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Gestão
        </p>

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                index === 0
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Settings size={19} />
          Configurações
        </button>
      </div>
    </aside>
  );
}
