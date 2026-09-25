import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenCheck,
  CheckCircle2,
  CircleDollarSign,
  FileSignature,
  Landmark,
  LockKeyhole,
} from 'lucide-react';

import { Link } from 'react-router-dom';

type Guide = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: typeof Landmark;
  available: boolean;
  detail: string;
  path?: string;
};

const guides: Guide[] = [
  {
    id: 'disponibilidade',
    number: '01',
    title: 'Disponibilidade Orçamentária',
    description:
      'Verificação do orçamento, concessão do CDO e detalhamento do crédito.',
    icon: Landmark,
    available: true,
    detail: 'POP disponível',
    path: '/checklist/disponibilidade',
  },
  {
  id: 'empenho',
  number: '02',
  title: 'Empenho',
  description:
    'Conferências prévias, minuta, célula orçamentária e emissão do empenho.',
  icon: FileSignature,
  available: true,
  detail: 'POP disponível',
  path: '/checklist/empenho',
  },
  {
    id: 'liquidacao',
    number: '03',
    title: 'Liquidação',
    description:
      'Procedimentos para conferência e liquidação da despesa.',
    icon: CheckCircle2,
    available: false,
    detail: 'Aguardando POP',
  },
  {
    id: 'pagamento',
    number: '04',
    title: 'Pagamento',
    description:
      'Procedimentos para preparação, conferência e efetivação do pagamento.',
    icon: CircleDollarSign,
    available: false,
    detail: 'Aguardando POP',
  },
];

export default function Checklist() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Guia Operacional
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Guia Operacional
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Guia de bolso das rotinas orçamentárias e financeiras da
          SGOF, estruturado a partir dos Procedimentos Operacionais
          Padrão do setor.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <BookOpenCheck
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Como utilizar este guia
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Selecione uma etapa para consultar o passo a passo,
              orientações, pontos de conferência e telas dos sistemas
              utilizados durante a execução do procedimento.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Fluxo da despesa
          </h2>

          <p className="text-sm text-slate-500">
            Selecione a etapa que deseja consultar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon;

            const cardContent = (
              <>
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      guide.available
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Icon size={23} />
                  </div>

                  <span className="text-3xl font-bold text-slate-100">
                    {guide.number}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {guide.title}
                  </h3>

                  {!guide.available && (
                    <LockKeyhole
                      size={15}
                      className="text-slate-400"
                    />
                  )}
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {guide.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span
                    className={`text-xs font-semibold ${
                      guide.available
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {guide.detail}
                  </span>

                  {guide.available && guide.path && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-blue-700">
                      Abrir guia

                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  )}

                  {guide.available && !guide.path && (
                    <span className="text-xs font-medium text-slate-400">
                      Em preparação
                    </span>
                  )}
                </div>
              </>
            );

            if (guide.available && guide.path) {
              return (
                <Link
                  key={guide.id}
                  to={guide.path}
                  className="group block rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={guide.id}
                className={`relative rounded-2xl border p-6 text-left shadow-sm ${
                  guide.available
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <BadgeDollarSign size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Fluxo orçamentário e financeiro
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <FlowItem
                number="1"
                label="Disponibilidade"
                active
              />

              <ArrowRight
                size={15}
                className="text-slate-300"
              />

              <FlowItem
                number="2"
                label="Empenho"
                active
              />

              <ArrowRight
                size={15}
                className="text-slate-300"
              />

              <FlowItem
                number="3"
                label="Liquidação"
              />

              <ArrowRight
                size={15}
                className="text-slate-300"
              />

              <FlowItem
                number="4"
                label="Pagamento"
              />
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        O Guia Operacional é um recurso de apoio. Os POPs vigentes
        permanecem como referência para execução dos procedimentos.
      </p>
    </div>
  );
}

function FlowItem({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-2 ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'bg-slate-100 text-slate-400'
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
          active
            ? 'bg-blue-600 text-white'
            : 'bg-slate-300 text-white'
        }`}
      >
        {number}
      </span>

      <span className="font-medium">
        {label}
      </span>
    </div>
  );
}
