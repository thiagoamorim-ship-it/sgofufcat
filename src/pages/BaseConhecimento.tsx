import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Landmark,
  ReceiptText,
  Scale,
  Search,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Category =
  | 'Todos'
  | 'Orçamento e SIAFI'
  | 'Empenho'
  | 'Liquidação e Pagamento'
  | 'Regularidade'
  | 'Retenções'
  | 'Legislação';

type Article = {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'Todos'>;
  tags: string[];
  icon: typeof BookOpen;
  path?: string;
};

const categories: Category[] = [
  'Todos',
  'Orçamento e SIAFI',
  'Empenho',
  'Liquidação e Pagamento',
  'Regularidade',
  'Retenções',
  'Legislação',
];

const articles: Article[] = [
  {
    id: 'estrutura-orcamentaria',
    title: 'Estrutura Orçamentária',
    description:
      'Consulta rápida sobre PTRES, fonte, natureza da despesa, UGR e plano interno.',
    category: 'Orçamento e SIAFI',
    tags: ['SIAFI', 'PTRES', 'Fonte', 'ND', 'PI'],
    icon: Landmark,
    path: '/base-conhecimento/estrutura-orcamentaria',
  },
  {
    id: 'tipos-empenho',
    title: 'Tipos de Empenho',
    description:
      'Entenda as diferenças entre empenho ordinário, estimativo e global.',
    category: 'Empenho',
    tags: ['Empenho', 'Ordinário', 'Estimativo', 'Global'],
    icon: FileText,
  },
  {
    id: 'celula-orcamentaria',
    title: 'Célula Orçamentária',
    description:
      'Entenda os principais elementos utilizados na identificação do crédito orçamentário.',
    category: 'Orçamento e SIAFI',
    tags: ['SIAFI', 'Crédito', 'Orçamento'],
    icon: WalletCards,
  },
  {
    id: 'liquidacao-despesa',
    title: 'Liquidação da Despesa',
    description:
      'Conceitos e pontos de atenção relacionados à etapa de liquidação da despesa.',
    category: 'Liquidação e Pagamento',
    tags: ['Liquidação', 'Despesa', 'Documento Fiscal'],
    icon: CheckCircle2,
  },
  {
    id: 'sicaf-cadin',
    title: 'SICAF e CADIN',
    description:
      'Referência rápida sobre consultas de regularidade utilizadas nas rotinas da SGOF.',
    category: 'Regularidade',
    tags: ['SICAF', 'CADIN', 'Regularidade'],
    icon: ShieldCheck,
  },
  {
    id: 'regularidade-fiscal',
    title: 'Regularidade Fiscal',
    description:
      'Organize as principais consultas e certidões utilizadas na conferência de fornecedores.',
    category: 'Regularidade',
    tags: ['CND', 'FGTS', 'CNDT', 'Fornecedor'],
    icon: ShieldCheck,
  },
  {
    id: 'retencoes',
    title: 'Retenções Tributárias',
    description:
      'Referências e orientações para apoio à análise das retenções incidentes nos pagamentos.',
    category: 'Retenções',
    tags: ['Tributos', 'IR', 'INSS', 'ISS'],
    icon: ReceiptText,
  },
  {
    id: 'legislacao',
    title: 'Legislação e Normativos',
    description:
      'Espaço para reunir leis, decretos, instruções normativas, manuais e demais referências.',
    category: 'Legislação',
    tags: ['Legislação', 'Normativos', 'Manuais'],
    icon: Scale,
  },
];

export default function BaseConhecimento() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('Todos');

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');

    return articles.filter((article) => {
      const matchesCategory =
        category === 'Todos' || article.category === category;

      const searchableText = [
        article.title,
        article.description,
        article.category,
        ...article.tags,
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR');

      const matchesSearch =
        term.length === 0 || searchableText.includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Base de Conhecimento
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Base de Conhecimento
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Consulte conceitos, orientações, referências e normativos
          utilizados nas rotinas da Gestão Orçamentária e Financeira.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <BookOpen
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div className="w-full">
            <h2 className="font-semibold text-slate-900">
              Encontre rapidamente o que precisa
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Pesquise por assunto, sistema, documento ou palavra-chave.
            </p>

            <div className="relative mt-5">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ex.: empenho, SICAF, PTRES, liquidação..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Categorias
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                category === item
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Conteúdos
            </h2>

            <p className="text-sm text-slate-500">
              Materiais para consulta rápida durante as rotinas do setor.
            </p>
          </div>

          <span className="text-sm text-slate-400">
            {filteredArticles.length}{' '}
            {filteredArticles.length === 1
              ? 'conteúdo encontrado'
              : 'conteúdos encontrados'}
          </span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredArticles.map((article) => {
              const Icon = article.icon;

              return (
                <div
                  key={article.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-blue-600">
                        {article.category}
                      </span>

                      <h3 className="mt-1 font-semibold text-slate-900">
                        {article.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {article.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        {article.path ? (
                          <Link
                            to={article.path}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
                          >
                            Ler conteúdo
                            <ArrowRight size={15} />
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">
                            Em preparação
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Search
              size={28}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-800">
              Nenhum conteúdo encontrado
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tente pesquisar outro termo ou selecionar outra categoria.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('Todos');
              }}
              className="mt-4 text-sm font-semibold text-blue-700"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <BookOpen
            size={20}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Base em construção contínua
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Novos conteúdos poderão ser incorporados conforme os
              procedimentos, manuais e normativos utilizados pelo setor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
