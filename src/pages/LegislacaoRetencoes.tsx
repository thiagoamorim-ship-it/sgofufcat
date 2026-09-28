import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Building2,
  FileText,
  Landmark,
  Scale,
  ShieldCheck,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const normas = [
  {
    titulo: 'IN RFB nº 1.234/2012',
    categoria: 'Retenções Federais',
    destaque: 'Norma principal',
    descricao:
      'Disciplina a retenção de tributos incidentes sobre pagamentos efetuados a pessoas jurídicas pelo fornecimento de bens ou prestação de serviços nas hipóteses abrangidas pela norma.',
    assuntos: [
      'Imposto de Renda — IR',
      'CSLL',
      'Cofins',
      'PIS/Pasep',
      'Hipóteses de não retenção',
      'Tratamentos específicos',
      'Anexo I — códigos e alíquotas',
    ],
    url:
      'https://normas.receita.fazenda.gov.br/sijut2consulta/consulta.action?termoBusca=IN%20RFB%201234',
    icon: Landmark,
  },

  {
    titulo: 'Anexo I — IN RFB nº 1.234/2012',
    categoria: 'Tabela de Retenções',
    destaque: 'Tabela de bolso',
    descricao:
      'Tabela de referência utilizada no SGOF para relacionar a natureza do bem ou serviço às alíquotas de IR, CSLL, Cofins e PIS/Pasep, ao percentual total e ao código da receita.',
    assuntos: [
      '6147 — 5,85%',
      '9060 — 4,89%',
      '8739 — 1,24%',
      '8767 — 2,20%',
      '6175 — 7,05%',
      '8850 — 3,40%',
      '8863 — 4,65%',
      '6188 — 7,05%',
      '6190 — 9,45%',
    ],
    url:
      'https://normas.receita.fazenda.gov.br/sijut2consulta/consulta.action?termoBusca=IN%20RFB%201234',
    icon: FileText,
  },

  {
    titulo: 'IN RFB nº 2.110/2022',
    categoria: 'Retenção Previdenciária',
    destaque: 'INSS',
    descricao:
      'Consolida normas de tributação previdenciária e contém as regras aplicáveis à retenção em serviços executados mediante cessão de mão de obra ou empreitada.',
    assuntos: [
      'Cessão de mão de obra',
      'Empreitada',
      'Retenção de 11%',
      'Serviços sujeitos à retenção',
      'Casos não sujeitos à retenção',
      'Base de cálculo',
      'Construção civil',
    ],
    url:
      'https://normas.receita.fazenda.gov.br/sijut2consulta/consulta/link.action?idAto=126687',
    icon: ShieldCheck,
  },

  {
    titulo: 'Lei Complementar nº 116/2003',
    categoria: 'ISS',
    destaque: 'Legislação Nacional',
    descricao:
      'Dispõe sobre o Imposto Sobre Serviços de Qualquer Natureza — ISS, de competência dos Municípios e do Distrito Federal.',
    assuntos: [
      'Fato gerador',
      'Lista de serviços',
      'Local de incidência',
      'Responsabilidade tributária',
      'Regras gerais do ISS',
      'Legislação municipal',
    ],
    url:
      'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
    icon: Building2,
  },

  {
    titulo: 'Lei nº 9.430/1996',
    categoria: 'Retenções Federais',
    destaque: 'Base legal',
    descricao:
      'Integra a base legal das regras de retenção tributária federal aplicáveis aos pagamentos efetuados pelas entidades abrangidas pela legislação.',
    assuntos: [
      'Retenção na fonte',
      'Pagamentos',
      'Tributos federais',
      'Fundamentação legal',
    ],
    url:
      'https://www.planalto.gov.br/ccivil_03/leis/l9430.htm',
    icon: Scale,
  },
];

export default function LegislacaoRetencoes() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section>
        <button
          type="button"
          onClick={() => navigate('/retencoes')}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Voltar para Retenções
        </button>

        <p className="text-sm font-medium text-blue-600">
          Gestão / Retenções / Legislação
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Legislação de Retenções
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Consulte os principais normativos utilizados como
          referência nas análises de retenções tributárias.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <BookOpen
            size={21}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Consulte a redação vigente
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Os normativos podem sofrer alterações.
              Os links abaixo direcionam às fontes oficiais
              para consulta da redação vigente antes da
              conclusão de situações tributárias específicas.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Normativos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Referências organizadas por assunto.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {normas.map((norma) => {
            const Icon = norma.icon;

            return (
              <article
                key={norma.titulo}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {norma.titulo}
                      </h3>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        {norma.destaque}
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {norma.categoria}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {norma.descricao}
                </p>

                <div className="mt-5 flex-1 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Principais assuntos
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {norma.assuntos.map((assunto) => (
                      <span
                        key={assunto}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {assunto}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={norma.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Consultar fonte oficial
                  <ArrowUpRight size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Referência normativa
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              O conteúdo desta página funciona como índice
              de apoio. Em caso de divergência, prevalece
              a redação vigente publicada na fonte oficial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
