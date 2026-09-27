import {
  ArrowRight,
  Calculator,
  FileCheck2,
  FileText,
  Library,
  LockKeyhole,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Link } from 'react-router-dom';

const tools = [
  {
    title: 'Notas Fiscais',
    description:
      'Importe XML, confira os dados da NF-e e gere o DANFE.',
    icon: ReceiptText,
    path: '/notas-fiscais',
    status: 'available',
  },
  {
    title: 'Regularidade',
    description:
      'Centralize consultas de regularidade dos fornecedores.',
    icon: ShieldCheck,
    path: '/regularidade',
    status: 'available',
  },
  {
    title: 'Retenções',
    description:
      'Acesse as ferramentas de apoio às retenções tributárias.',
    icon: Calculator,
    path: '/retencoes',
    status: 'available',
  },
  {
    title: 'Calculadoras',
    description:
      'Ferramentas para cálculos orçamentários e financeiros.',
    icon: Sparkles,
    path: '/calculadoras',
    status: 'available',
  },
  {
    title: 'Base de Conhecimento',
    description:
      'Classificações, legislação, conceitos e procedimentos.',
    icon: Library,
    path: '/base-conhecimento',
    status: 'available',
  },
  {
    title: 'Guia Operacional',
    description:
      'Passo a passo das rotinas de disponibilidade, empenho, liquidação e pagamento.',
    icon: FileCheck2,
    path: '/checklist',
    status: 'available',
  },
  {
    title: 'Documentos',
    description:
      'Modelos, relatórios e documentos de apoio às rotinas do setor.',
    icon: FileText,
    path: '',
    status: 'soon',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Apresentação */}
      <section className="relative overflow-hidden rounded-3xl bg-[#002B49] px-6 py-8 text-white shadow-lg md:px-9 md:py-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20" />
        <div className="absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-cyan-400/10" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
              <LockKeyhole size={14} />
              USO INTERNO • HU-UFCAT
            </span>

            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-100">
              Gestão Orçamentária e Financeira
            </span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
            SGOF • HU-UFCAT
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
            Sistema de Gestão
            <span className="block text-blue-200">
              Orçamentária e Financeira
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
            Ambiente interno de apoio às rotinas orçamentárias,
            financeiras e fiscais do HU-UFCAT, reunindo ferramentas,
            consultas e procedimentos em um único local.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/notas-fiscais"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#002B49] transition hover:bg-blue-50"
            >
              Acessar Notas Fiscais
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/base-conhecimento"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Base de Conhecimento
            </Link>
          </div>
        </div>
      </section>

      {/* Pesquisa */}
      <section>
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Pesquisar ferramenta, fornecedor, norma..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </section>

      {/* Ferramentas */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Central de trabalho
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Ferramentas e módulos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Acesse rapidamente as principais rotinas do SGOF.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {tools.filter((tool) => tool.status === 'available').length}{' '}
            módulos disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;

            if (tool.status === 'soon') {
              return (
                <div
                  key={tool.title}
                  className="relative rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      Em breve
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-600">
                    {tool.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    {tool.description}
                  </p>
                </div>
              );
            }

            return (
              <Link
                key={tool.title}
                to={tool.path}
                className="group flex min-h-[180px] flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h3 className="font-semibold text-slate-900">
                  {tool.title}
                </h3>

                <p className="mt-1 flex-1 text-sm leading-5 text-slate-500">
                  {tool.description}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                  Acessar módulo
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Informações institucionais */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <LockKeyhole size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Sistema de uso interno
            </p>

            <p className="text-xs leading-5 text-slate-500">
              Ambiente de apoio às atividades de Gestão Orçamentária e
              Financeira do HU-UFCAT.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-right">
          <p className="text-xs text-slate-400">
            Desenvolvido por
          </p>

          <p className="text-sm font-semibold text-slate-700">
            Thiago Batista Amorim | Analista Administrativo | SGOF | HU-UFCat
          </p>
        </div>
      </section>
    </div>
  );
}
