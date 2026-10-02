import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';

type TipoBase =
  | 'empenhos'
  | 'rap'
  | 'credito_orcamentario'
  | 'desconhecido';

type Linha = Record<string, unknown>;

function texto(valor: unknown) {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizar(valor: unknown) {
  return texto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function detectarTipo(colunas: string[]): TipoBase {
  const cabecalho = colunas.map(normalizar);

  const possui = (...termos: string[]) =>
    termos.every((termo) =>
      cabecalho.some((coluna) =>
        coluna.includes(normalizar(termo)),
      ),
    );

  // Empenhos
  if (
    possui('ne ccor') &&
    possui('empenhos a liquidar') &&
    possui('empenhos pagos')
  ) {
    return 'empenhos';
  }

  // RAP
  if (
    possui('ne ccor') &&
    possui('conta contabil') &&
    possui('saldo')
  ) {
    return 'rap';
  }

  // Crédito / Disponibilidade Orçamentária
  if (
    possui('ug executora') &&
    possui('acao governo') &&
    possui('nc - operacao') &&
    possui('saldo')
  ) {
    return 'credito_orcamentario';
  }

  return 'desconhecido';
}

function nomeTipo(tipo: TipoBase) {
  switch (tipo) {
    case 'empenhos':
      return 'Empenhos';

    case 'rap':
      return 'Restos a Pagar (RAP)';

    case 'credito_orcamentario':
      return 'Crédito Orçamentário';

    default:
      return 'Não reconhecida';
  }
}

export default function ImportarExecucaoOrcamentaria() {
  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [planilha, setPlanilha] =
    useState('');

  const [colunas, setColunas] =
    useState<string[]>([]);

  const [linhas, setLinhas] =
    useState<Linha[]>([]);

  const [tipo, setTipo] =
    useState<TipoBase>('desconhecido');

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  const previa = useMemo(
    () => linhas.slice(0, 5),
    [linhas],
  );

  async function processarArquivo(
    arquivoSelecionado: File,
  ) {
    setCarregando(true);
    setErro(null);

    try {
      const extensao =
        arquivoSelecionado.name
          .split('.')
          .pop()
          ?.toLowerCase();

      if (
        extensao !== 'xlsx' &&
        extensao !== 'xls'
      ) {
        throw new Error(
          'Selecione uma planilha Excel (.xlsx ou .xls).',
        );
      }

      const buffer =
        await arquivoSelecionado.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: true,
      });

      if (!workbook.SheetNames.length) {
        throw new Error(
          'O arquivo não possui planilhas.',
        );
      }

      /*
       * Para os relatórios do Tesouro,
       * procuramos automaticamente a primeira aba
       * que contenha dados reconhecíveis.
       */
      let abaEncontrada = '';
      let linhasEncontradas: Linha[] = [];
      let colunasEncontradas: string[] = [];
      let tipoEncontrado: TipoBase =
        'desconhecido';

      for (const nomeAba of workbook.SheetNames) {
        const worksheet =
          workbook.Sheets[nomeAba];

        if (!worksheet) continue;

        const dados =
          XLSX.utils.sheet_to_json<Linha>(
            worksheet,
            {
              defval: '',
              raw: false,
            },
          );

        if (!dados.length) continue;

        const primeirasColunas =
          Object.keys(dados[0] || {});

        const tipoAba =
          detectarTipo(primeirasColunas);

        if (tipoAba !== 'desconhecido') {
          abaEncontrada = nomeAba;
          linhasEncontradas = dados;
          colunasEncontradas =
            primeirasColunas;
          tipoEncontrado = tipoAba;
          break;
        }

        /*
         * Guarda a primeira aba com dados para
         * permitir diagnóstico caso nenhuma
         * estrutura seja reconhecida.
         */
        if (!linhasEncontradas.length) {
          abaEncontrada = nomeAba;
          linhasEncontradas = dados;
          colunasEncontradas =
            primeirasColunas;
        }
      }

      if (!linhasEncontradas.length) {
        throw new Error(
          'Não foram encontrados registros na planilha.',
        );
      }

      setArquivo(arquivoSelecionado);
      setPlanilha(abaEncontrada);
      setLinhas(linhasEncontradas);
      setColunas(colunasEncontradas);
      setTipo(tipoEncontrado);
    } catch (error: any) {
      console.error(error);

      setArquivo(null);
      setPlanilha('');
      setLinhas([]);
      setColunas([]);
      setTipo('desconhecido');

      setErro(
        error?.message ||
          'Não foi possível ler a planilha.',
      );
    } finally {
      setCarregando(false);
    }
  }

  function limpar() {
    setArquivo(null);
    setPlanilha('');
    setColunas([]);
    setLinhas([]);
    setTipo('desconhecido');
    setErro(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              SGOF • HU-UFCAT
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Importar dados da Execução Orçamentária
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Importe os relatórios extraídos do
              Tesouro Gerencial. O SGOF identifica
              automaticamente o tipo da base antes
              de qualquer gravação.
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700">
            Etapa de validação
          </div>
        </div>
      </section>

      {erro && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Não foi possível processar o arquivo
            </p>

            <p className="mt-1">
              {erro}
            </p>
          </div>
        </div>
      )}

      {!arquivo ? (
        <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-sm md:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Upload size={28} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Selecione uma planilha
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Utilize os arquivos Excel extraídos do
            Tesouro Gerencial para Empenhos, RAP ou
            Crédito Orçamentário.
          </p>

          <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002B49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003d66]">
            {carregando ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <FileSpreadsheet size={18} />
            )}

            {carregando
              ? 'Analisando...'
              : 'Selecionar arquivo'}

            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              disabled={carregando}
              onChange={(event) => {
                const selecionado =
                  event.target.files?.[0];

                if (selecionado) {
                  void processarArquivo(
                    selecionado,
                  );
                }

                event.currentTarget.value = '';
              }}
            />
          </label>
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Arquivo
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                {arquivo.name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Aba analisada
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {planilha || '—'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Registros encontrados
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {linhas.length.toLocaleString(
                  'pt-BR',
                )}
              </p>
            </div>
          </section>

          <section
            className={`rounded-2xl border p-5 ${
              tipo === 'desconhecido'
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {tipo === 'desconhecido' ? (
                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
              ) : (
                <CheckCircle2
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
              )}

              <div>
                <p
                  className={`font-bold ${
                    tipo === 'desconhecido'
                      ? 'text-amber-900'
                      : 'text-emerald-900'
                  }`}
                >
                  {tipo === 'desconhecido'
                    ? 'Estrutura ainda não reconhecida'
                    : 'Planilha reconhecida'}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    tipo === 'desconhecido'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  Tipo detectado:{' '}
                  <strong>
                    {nomeTipo(tipo)}
                  </strong>
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">
                  Pré-visualização
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Primeiros 5 registros •{' '}
                  {colunas.length} coluna(s)
                  identificada(s)
                </p>
              </div>

              <button
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={16} />
                Remover arquivo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-max divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {colunas.map((coluna) => (
                      <th
                        key={coluna}
                        className="max-w-[240px] whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-500"
                      >
                        {coluna}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {previa.map(
                    (linha, indice) => (
                      <tr key={indice}>
                        {colunas.map(
                          (coluna) => (
                            <td
                              key={coluna}
                              className="max-w-[240px] truncate whitespace-nowrap px-4 py-3 text-xs text-slate-600"
                              title={texto(
                                linha[coluna],
                              )}
                            >
                              {texto(
                                linha[coluna],
                              ) || '—'}
                            </td>
                          ),
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              disabled
              className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-400"
            >
              Confirmar importação
            </button>
          </div>
        </>
      )}
    </div>
  );
}
