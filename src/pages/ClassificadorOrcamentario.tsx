import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileSearch,
  Info,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { classificacoesOrcamentarias } from '../data/classificacoesOrcamentarias';

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWords(value: string) {
  const ignoredWords = new Set([
    'a',
    'ao',
    'aos',
    'as',
    'com',
    'da',
    'das',
    'de',
    'do',
    'dos',
    'e',
    'em',
    'na',
    'nas',
    'no',
    'nos',
    'o',
    'os',
    'para',
    'por',
    'um',
    'uma',
  ]);

  return normalizeText(value)
    .split(' ')
    .filter((word) => word.length >= 3 && !ignoredWords.has(word));
}

export default function ClassificadorOrcamentario() {
  const [description, setDescription] = useState('');
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched || !description.trim()) {
      return [];
    }

    const normalizedDescription = normalizeText(description);
    const descriptionWords = new Set(getWords(description));

    return classificacoesOrcamentarias
      .map((classification) => {
        const normalizedName = normalizeText(classification.nome);
        const normalizedCoverage = normalizeText(classification.descricao);

        const classificationWords = new Set([
          ...getWords(classification.nome),
          ...getWords(classification.descricao),
        ]);

        let score = 0;
        const matches: string[] = [];

        if (
          normalizedName.length >= 4 &&
          normalizedDescription.includes(normalizedName)
        ) {
          score += 20;
          matches.push(classification.nome);
        }

        descriptionWords.forEach((word) => {
          if (classificationWords.has(word)) {
            score += 3;

            if (!matches.includes(word)) {
              matches.push(word);
            }
          } else if (
            word.length >= 5 &&
            normalizedCoverage.includes(word)
          ) {
            score += 1;

            if (!matches.includes(word)) {
              matches.push(word);
            }
          }
        });

        return {
          ...classification,
          score,
          matches,
        };
      })
      .filter((classification) => classification.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
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
          Consulte a classificação orçamentária sugerida a partir da
          descrição do bem ou material constante na nota fiscal.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <FileSearch
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Consulta pela descrição
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              A pesquisa utiliza a base de classificações de despesas
              cadastrada para apoio às rotinas da SGOF.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-900"
        >
          Descrição do item
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Copie a descrição do produto diretamente da nota fiscal ou
          informe as principais características do item.
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
              Classificações encontradas
            </h2>

            <p className="text-sm text-slate-500">
              Os resultados estão ordenados pela correspondência com a
              descrição informada.
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.codigo}
                className={`rounded-2xl bg-white p-5 shadow-sm ${
                  index === 0
                    ? 'border-2 border-blue-200'
                    : 'border border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      index === 0
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {index === 0 && (
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          Maior correspondência
                        </span>
                      )}

                      <span className="rounded-lg bg-[#002B49] px-2.5 py-1 text-xs font-bold text-white">
                        {result.codigo}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                      {result.nome}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {result.tipo}
                    </p>

                    {result.descricao && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Descrição / abrangência
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {result.descricao}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          NDD
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {result.codigo}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          ND
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {result.natureza || '—'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Subitem
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {result.subitem || '—'}
                        </p>
                      </div>
                    </div>

                    {result.matches.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Termos relacionados
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.matches.slice(0, 8).map((match) => (
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
                Não foi encontrada correspondência suficiente para a
                descrição informada. Tente utilizar a descrição técnica
                do item ou consulte a classificação manualmente.
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
              A consulta utiliza a base de classificações preparada a
              partir da Norma Operacional SEI nº 1/2024/DAI-EBSERH,
              contemplando as classificações cadastradas para materiais
              de consumo e materiais permanentes.
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
              Classificação sugerida
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O resultado funciona como apoio à classificação. O objeto
              contratado, a descrição do documento fiscal e os demais
              documentos do processo devem ser conferidos antes da
              utilização da classificação na execução orçamentária.
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
