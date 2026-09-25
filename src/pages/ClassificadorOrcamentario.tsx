import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileSearch,
  Info,
  Search,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Classification = {
  code: string;
  name: string;
  type: string;
  keywords: string[];
};

const classifications: Classification[] = [
  {
    code: '33903009',
    name: 'Material Farmacológico',
    type: 'Material de consumo',
    keywords: [
      'medicamento',
      'medicamentos',
      'remedio',
      'fármaco',
      'farmaco',
      'vacina',
      'vacinas',
      'soro',
      'soros',
    ],
  },
  {
    code: '33903022',
    name: 'Material de Limpeza e Produção de Higienização',
    type: 'Material de consumo',
    keywords: [
      'detergente',
      'desinfetante',
      'sabão',
      'sabao',
      'papel higienico',
      'papel higiênico',
      'saco lixo',
      'saco para lixo',
      'limpeza',
      'higienização',
      'higienizacao',
    ],
  },
  {
    code: '33903036',
    name: 'Material Hospitalar',
    type: 'Material de consumo',
    keywords: [
      'seringa',
      'seringas',
      'agulha',
      'agulhas',
      'cateter',
      'cateteres',
      'compressa',
      'compressas',
      'luva procedimento',
      'luvas procedimento',
      'material hospitalar',
    ],
  },
];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function ClassificadorOrcamentario() {
  const [description, setDescription] = useState('');
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched || !description.trim()) {
      return [];
    }

    const normalizedDescription = normalizeText(description);

    return classifications
      .map((classification) => {
        const matches = classification.keywords.filter((keyword) =>
          normalizedDescription.includes(normalizeText(keyword)),
        );

        return {
          ...classification,
          score: matches.length,
          matches,
        };
      })
      .filter((classification) => classification.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [description, searched]);

  const handleSearch = () => {
    setSearched(true);
  };

  const handleClear = () => {
    setDescription('');
    setSearched(false);
  };

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
          Classificador Orçamentário
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Pesquise a classificação orçamentária a partir da descrição
          do item constante na nota fiscal.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <Sparkles
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Consulta assistida
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Informe a descrição do bem ou insumo. O sistema pesquisará
              classificações compatíveis na base utilizada pela SGOF.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-900"
        >
          Descrição do item da nota fiscal
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Você pode copiar a descrição diretamente da NF.
        </p>

        <div className="relative mt-4">
          <FileSearch
            size={20}
            className="absolute left-4 top-4 text-slate-400"
          />

          <textarea
            id="description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setSearched(false);
            }}
            placeholder="Ex.: Seringa descartável 10 ml com agulha..."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSearch}
            disabled={!description.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={17} />
            Analisar classificação
          </button>

          {description && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Limpar
            </button>
          )}
        </div>
      </section>

      {searched && results.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Classificação sugerida
            </h2>

            <p className="text-sm text-slate-500">
              Confira o resultado antes de utilizá-lo na execução
              orçamentária.
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.code}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {index === 0 && (
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Melhor correspondência
                        </span>
                      )}

                      <span className="rounded-lg bg-[#002B49] px-2.5 py-1 text-xs font-bold text-white">
                        {result.code}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                      {result.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {result.type}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          NDD
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {result.code}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          ND
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {result.code.slice(0, 6)}
                        </p>
                      </div>
                    </div>

                    {result.matches.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Correspondências encontradas
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.matches.map((match) => (
                            <span
                              key={match}
                              className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                            >
                              {match}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {searched && results.length === 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={21}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Classificação não identificada
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                A descrição informada ainda não possui correspondência
                suficiente na base carregada. Consulte a Norma
                Operacional ou realize a classificação manualmente.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <BookOpen
            size={20}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Base da classificação
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              A classificação de materiais utiliza como referência a
              Norma Operacional SEI nº 1/2024/DAI-EBSERH e a estrutura
              de classificações adotada pela SGOF.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <Info
            size={20}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Resultado de apoio
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O resultado é uma sugestão de classificação. A descrição
              do documento fiscal, o objeto contratado e a documentação
              do processo devem ser conferidos pelo responsável antes da
              emissão da disponibilidade ou do empenho.
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        Classificador Orçamentário • SGOF • HU-UFCAT
      </p>
    </div>
  );
}
