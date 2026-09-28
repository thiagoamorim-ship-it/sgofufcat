import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Info,
  Search,
  ShieldCheck,
} from 'lucide-react';

type Categoria = {
  id: string;
  titulo: string;
  descricao: string;
  termos: string[];
};

const categorias: Categoria[] = [
  {
    id: 'aquisicao',
    titulo: 'Aquisição de bens',
    descricao:
      'Referências para análise de retenções em aquisições de materiais e bens.',
    termos: [
      'aquisição',
      'bens',
      'material',
      'produto',
      'mercadoria',
    ],
  },
  {
    id: 'servicos',
    titulo: 'Prestação de serviços',
    descricao:
      'Referências para análise de retenções relacionadas à prestação de serviços.',
    termos: [
      'serviço',
      'serviços',
      'prestação',
      'contratação',
    ],
  },
  {
    id: 'simples',
    titulo: 'Simples Nacional',
    descricao:
      'Pontos de atenção quando o fornecedor é optante pelo Simples Nacional.',
    termos: [
      'simples',
      'simples nacional',
      'optante',
      'mei',
    ],
  },
  {
    id: 'ir',
    titulo: 'Imposto de Renda — IR',
    descricao:
      'Consulta rápida para situações que exigem análise de retenção do Imposto de Renda.',
    termos: [
      'ir',
      'irrf',
      'imposto de renda',
    ],
  },
  {
    id: 'contribuicoes',
    titulo: 'PIS/Pasep, Cofins e CSLL',
    descricao:
      'Referências para análise das contribuições sociais sujeitas à retenção.',
    termos: [
      'pis',
      'pasep',
      'cofins',
      'csll',
      'contribuições',
    ],
  },
  {
    id: 'inss',
    titulo: 'INSS',
    descricao:
      'Pontos de atenção para serviços sujeitos à análise de retenção previdenciária.',
    termos: [
      'inss',
      'previdência',
      'previdenciária',
      'mão de obra',
      'cessão',
    ],
  },
  {
    id: 'iss',
    titulo: 'ISS',
    descricao:
      'Referências para conferência do Imposto Sobre Serviços nas contratações.',
    termos: [
      'iss',
      'issqn',
      'municipal',
      'município',
    ],
  },
];

export default function TabelaRetencoes() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] =
    useState('');

  const categoriasFiltradas =
    useMemo(() => {
      const termo = pesquisa
        .trim()
        .toLowerCase();

      if (!termo) {
        return categorias;
      }

      return categorias.filter(
        (categoria) =>
          categoria.titulo
            .toLowerCase()
            .includes(termo) ||
          categoria.descricao
            .toLowerCase()
            .includes(termo) ||
          categoria.termos.some(
            (item) =>
              item
                .toLowerCase()
                .includes(termo),
          ),
      );
    }, [pesquisa]);

  return (
    <div className="space-y-6">
      <section>
        <button
          type="button"
          onClick={() =>
            navigate('/retencoes')
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Voltar para Retenções
        </button>

        <p className="text-sm font-medium text-blue-600">
          Gestão / Retenções / Tabela de bolso
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Tabela de bolso
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Consulta rápida de apoio à
          conferência das retenções
          tributárias nas rotinas do SGOF.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Material de apoio
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              A tabela de bolso auxilia na
              identificação dos pontos que
              precisam ser conferidos. A
              análise tributária e o cálculo
              das retenções permanecem no
              SIRT.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label
          htmlFor="pesquisa-retencoes"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Pesquisar
        </label>

        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="pesquisa-retencoes"
            type="text"
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(
                event.target.value,
              )
            }
            placeholder="Ex.: Simples Nacional, INSS, Cofins, serviços..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Pesquise pelo tributo, tipo de
          contratação ou situação do
          fornecedor.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Consultas rápidas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecione o assunto que deseja
              consultar.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {categoriasFiltradas.length}{' '}
            resultado
            {categoriasFiltradas.length === 1
              ? ''
              : 's'}
          </span>
        </div>

        {categoriasFiltradas.length >
        0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categoriasFiltradas.map(
              (categoria) => (
                <article
                  key={categoria.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <BookOpen size={20} />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {categoria.titulo}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {
                      categoria.descricao
                    }
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                      <Info size={12} />
                      Conteúdo em preparação
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <Search
              size={28}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-700">
              Nenhum resultado encontrado
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Tente pesquisar por outro
              tributo ou situação.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <Calculator
            size={20}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Próxima etapa
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              As regras, alíquotas, hipóteses
              de retenção, exceções e bases
              legais serão incluídas somente
              após validação das referências
              utilizadas nas rotinas do
              HU-UFCAT.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
