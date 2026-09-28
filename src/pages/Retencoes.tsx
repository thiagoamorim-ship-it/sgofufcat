import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileText,
  ShieldCheck,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const SIRT_URL =
  'https://sirt-web.hatchable.site/login';

export default function Retencoes() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Retenções
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Retenções Tributárias
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Consulte ferramentas, legislação e procedimentos
          de apoio à análise e conferência das retenções
          tributárias.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex max-w-3xl gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Calculator size={27} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    SIRT
                  </h2>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Sistema externo
                  </span>
                </div>

                <p className="mt-1 font-medium text-slate-700">
                  Sistema Inteligente de Retenções
                  Tributárias
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Ferramenta externa complementar para
                  apoio às análises de retenções
                  tributárias.
                </p>
              </div>
            </div>

            <a
              href={SIRT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Acessar SIRT
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ExternalLink size={16} />

            <span>
              O SIRT será aberto em uma nova aba.
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Apoio às retenções
          </h2>

          <p className="text-sm text-slate-500">
            Utilize os recursos do SGOF para apoiar a
            identificação, conferência e fundamentação das
            retenções.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SupportCard
            icon={BookOpen}
            title="Tabela de bolso"
            description="Assistente para consulta de códigos, alíquotas e enquadramentos das retenções federais."
            status="Disponível"
            onClick={() =>
              navigate('/retencoes/tabela-de-bolso')
            }
          />

          <SupportCard
            icon={FileText}
            title="Legislação"
            description="Principais normativos utilizados como referência nas análises de retenções."
            status="Disponível"
            onClick={() =>
              navigate('/retencoes/legislacao')
            }
          />

          <SupportCard
            icon={CheckCircle2}
            title="Procedimentos"
            description="Roteiro de apoio para conferência das retenções e instrução da análise."
            status="Disponível"
            onClick={() =>
              navigate('/retencoes/procedimentos')
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Apoio à análise tributária
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              O SGOF reúne recursos de apoio à análise das
              retenções, incluindo consulta de códigos e
              alíquotas, referências normativas e roteiro de
              conferência. O SIRT permanece disponível como
              ferramenta externa complementar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SupportCard({
  icon: Icon,
  title,
  description,
  status,
  onClick,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  status: 'Disponível' | 'Em preparação';
  onClick?: () => void;
}) {
  const disponivel =
    status === 'Disponível';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
        disponivel
          ? 'border-slate-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md'
          : 'cursor-default border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon size={20} />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            disponivel
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {description}
      </p>

      {disponivel && (
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-700">
          Consultar

          <ArrowRight
            size={15}
            className="transition group-hover:translate-x-1"
          />
        </div>
      )}
    </button>
  );
}
