import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Boxes,
  FileText,
  Info,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Stethoscope,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const exemplos = [
  {
    title: 'Bens e insumos',
    description:
      'Mercadorias e bens em geral, materiais, alimentação e demais aquisições utilizadas nas atividades do HU-UFCAT.',
    icon: Boxes,
  },
  {
    title: 'Produtos farmacêuticos',
    description:
      'Aquisições de produtos farmacêuticos e outros itens abrangidos pelas regras específicas de retenção.',
    icon: PackageCheck,
  },
  {
    title: 'Serviços hospitalares',
    description:
      'Serviços hospitalares e outras prestações relacionadas à atividade assistencial.',
    icon: Stethoscope,
  },
  {
    title: 'Serviços em geral',
    description:
      'Limpeza, vigilância, locação de mão de obra, serviços com emprego de materiais e demais serviços contratados.',
    icon: Wrench,
  },
];

export default function BaseRetencoes() {
  return (
    <div className="space-y-6">
      <section>
        <Link
          to="/base-conhecimento"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Voltar à Base de Conhecimento
        </Link>

        <p className="text-sm font-medium text-blue-600">
          Base de Conhecimento / Retenções
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Retenções Tributárias
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Referência rápida para apoio à análise das retenções
          tributárias incidentes nos pagamentos realizados pela
          SGOF.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <BookOpen
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Escopo da rotina
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              No âmbito da SGOF, esta referência está direcionada às
              retenções relacionadas aos pagamentos decorrentes da
              aquisição de bens, insumos e da prestação de serviços.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O enquadramento deve considerar a natureza do bem
              fornecido ou do serviço prestado e as condições
              específicas da contratação.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Situações encontradas na rotina
          </h2>

          <p className="text-sm text-slate-500">
            Exemplos de aquisições e serviços que podem exigir análise
            quanto às retenções aplicáveis.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {exemplos.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-start gap-3">
          <ReceiptText
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div className="w-full">
            <h2 className="font-semibold text-slate-900">
              Retenções Federais
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              A análise das retenções federais deve observar o
              enquadramento do fornecimento de bens ou da prestação de
              serviços, bem como as hipóteses específicas aplicáveis ao
              fornecedor e à operação.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                title="IR"
                description="Imposto sobre a Renda"
              />

              <InfoCard
                title="CSLL"
                description="Contribuição Social"
              />

              <InfoCard
                title="Cofins"
                description="Contribuição para a Cofins"
              />

              <InfoCard
                title="PIS/Pasep"
                description="Contribuição para o PIS/Pasep"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#002B49] text-white shadow-sm">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Ferramenta operacional
              </p>

              <h2 className="mt-1 text-xl font-bold">
                SIRT — Sistema Inteligente de Retenções Tributárias
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Para realizar o enquadramento e apoiar o cálculo das
                retenções tributárias, utilize o SIRT. A Base de
                Conhecimento permanece como referência de consulta,
                enquanto a análise operacional é realizada na
                ferramenta específica.
              </p>

              <a
                href="https://sirt-web.hatchable.site/login"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#002B49] transition hover:bg-slate-100"
              >
                Acessar SIRT
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <FileText
              size={20}
              className="mt-0.5 shrink-0 text-blue-700"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Referências
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A análise das retenções federais deve considerar a
                legislação aplicável, incluindo a IN RFB nº
                1.234/2012 e suas alterações.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A rotina também utiliza informações de natureza de
                rendimento e códigos de receita associados à
                EFD-Reinf.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <Info
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Atenção
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                A natureza da despesa, a descrição do item ou o NCM
                podem auxiliar na análise, mas não devem ser utilizados
                isoladamente para determinar a retenção tributária.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Confirme sempre o fornecedor, o objeto contratado, os
                documentos fiscais e as condições da operação.
              </p>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        Base de Conhecimento • SGOF • HU-UFCAT
      </p>
    </div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
