import {
  ArrowLeft,
  BookOpen,
  Boxes,
  CircleDollarSign,
  Landmark,
  Layers3,
  Network,
  Tag,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const items = [
  {
    sigla: 'PTRES',
    nome: 'Programa de Trabalho Resumido',
    descricao:
      'Identifica de forma resumida a programação orçamentária utilizada na execução da despesa.',
    dica:
      'É um dos dados utilizados para identificar de qual programação o recurso será executado.',
    icon: Layers3,
  },
  {
    sigla: 'Fonte',
    nome: 'Fonte de Recursos',
    descricao:
      'Identifica a origem ou a destinação dos recursos utilizados para financiar a despesa.',
    dica:
      'Deve ser conferida junto aos demais componentes da célula orçamentária.',
    icon: CircleDollarSign,
  },
  {
    sigla: 'ND',
    nome: 'Natureza da Despesa',
    descricao:
      'Classifica economicamente a despesa e identifica características do gasto realizado.',
    dica:
      'A classificação deve ser compatível com o objeto da despesa.',
    icon: Tag,
  },
  {
    sigla: 'UGR',
    nome: 'Unidade Gestora Responsável',
    descricao:
      'Identifica, quando utilizada, a unidade responsável pela execução ou acompanhamento de determinada programação.',
    dica:
      'Nem toda operação exige o preenchimento de UGR.',
    icon: Landmark,
  },
  {
    sigla: 'PI',
    nome: 'Plano Interno',
    descricao:
      'Instrumento utilizado para detalhar e acompanhar internamente a execução de determinadas ações orçamentárias.',
    dica:
      'O PI complementa a identificação da destinação do recurso quando aplicável.',
    icon: Network,
  },
];

export default function EstruturaOrcamentaria() {
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
          Base de Conhecimento / Orçamento e SIAFI
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Estrutura Orçamentária
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Referência rápida sobre alguns dos principais elementos
          utilizados na identificação e execução do crédito
          orçamentário.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <BookOpen
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Entendendo a estrutura
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Na execução orçamentária, diferentes classificadores
              trabalham em conjunto para identificar corretamente o
              crédito utilizado. Por isso, a conferência não deve se
              limitar a apenas um campo.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Principais elementos
          </h2>

          <p className="text-sm text-slate-500">
            Consulte rapidamente o significado de cada informação.
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.sigla}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[#002B49] px-2.5 py-1 text-xs font-bold text-white">
                        {item.sigla}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {item.nome}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.descricao}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Atenção
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {item.dica}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Boxes
            size={21}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Visão conjunta
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              PTRES, Fonte, Natureza da Despesa, UGR e Plano Interno
              podem compor, conforme a operação, informações utilizadas
              para identificar o crédito e sua destinação. Antes de
              registrar uma operação, confira os dados com a
              documentação orçamentária correspondente.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-semibold text-slate-900">
          Importante
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Esta página funciona como referência rápida. Os códigos e
          classificações efetivamente utilizados devem ser conferidos
          no processo, no SIAFI e nos documentos orçamentários
          aplicáveis.
        </p>
      </section>

      <p className="text-center text-xs text-slate-400">
        Base de Conhecimento • SGOF • HU-UFCAT
      </p>
    </div>
  );
}
