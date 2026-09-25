import {
  Calculator,
  FileCheck2,
  FileText,
  Landmark,
  Library,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const tools = [
  {
    title: 'Notas Fiscais',
    description: 'Consulte NF-e, importe XML e gere DANFE.',
    icon: ReceiptText,
    path: '/notas-fiscais',
  },
  {
    title: 'Regularidade',
    description: 'Consulte certidões e situação de fornecedores.',
    icon: ShieldCheck,
    path: '/certidoes',
  },
  {
    title: 'Retenções',
    description: 'Analise tributos e retenções na fonte.',
    icon: Calculator,
    path: '/retencoes',
  },
  {
    title: 'Calculadoras',
    description: 'Ferramentas para cálculos orçamentários e financeiros.',
    icon: Sparkles,
    path: '/calculadoras',
  },
  {
    title: 'Documentos',
    description: 'Gere relatórios, análises e documentos em PDF.',
    icon: FileText,
    path: '/documentos',
  },
  {
    title: 'SIAFI',
    description: 'Rotinas, códigos e consultas de apoio.',
    icon: Landmark,
    path: '/siafi',
  },
  {
    title: 'Base de Conhecimento',
    description: 'Legislação, manuais e procedimentos.',
    icon: Library,
    path: '/legislacao',
  },
  {
    title: 'Checklist',
    description: 'Conferência e instrução dos processos.',
    icon: FileCheck2,
    path: '/checklist',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-medium text-blue-600">
          Visão geral
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Central de Gestão Orçamentária
        </h1>

        <p className="mt-2 text-slate-500">
          Ferramentas para apoiar suas rotinas orçamentárias,
          financeiras e fiscais.
        </p>
      </section>

      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Pesquisar ferramenta, fornecedor, norma..."
          className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Ferramentas
            </h2>

            <p className="text-sm text-slate-500">
              Acesse rapidamente suas principais rotinas.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  {tool.title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {tool.description}
                </p>
              </button>
            );
          })}

        </div>
      </section>

    </div>
  );
}
