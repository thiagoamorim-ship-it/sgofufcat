import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calculator,
  CircleDollarSign,
  MinusCircle,
  Percent,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type TipoAlteracao = 'acrescimo' | 'supressao';

function moedaParaNumero(valor: string) {
  const limpo = valor
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  const numero = Number(limpo);

  return Number.isFinite(numero) ? numero : 0;
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

function formatarPercentual(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(valor);
}

export default function AcrescimoSupressao() {
  const [tipo, setTipo] = useState<TipoAlteracao>('acrescimo');
  const [valorOriginal, setValorOriginal] = useState('');
  const [valorAlteracao, setValorAlteracao] = useState('');

  const resultado = useMemo(() => {
    const original = moedaParaNumero(valorOriginal);
    const alteracao = moedaParaNumero(valorAlteracao);

    const percentual =
      original > 0 ? (alteracao / original) * 100 : 0;

    const novoValor =
      tipo === 'acrescimo'
        ? original + alteracao
        : Math.max(original - alteracao, 0);

    return {
      original,
      alteracao,
      percentual,
      novoValor,
    };
  }, [tipo, valorOriginal, valorAlteracao]);

  const preencherMoeda = (
    valor: string,
    setter: (valor: string) => void,
  ) => {
    const somenteNumeros = valor.replace(/\D/g, '');

    if (!somenteNumeros) {
      setter('');
      return;
    }

    const numero = Number(somenteNumeros) / 100;

    setter(
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero),
    );
  };

  const limpar = () => {
    setValorOriginal('');
    setValorAlteracao('');
    setTipo('acrescimo');
  };

  const possuiCalculo =
    resultado.original > 0 && resultado.alteracao >= 0;

  return (
    <div className="space-y-6">
      <section>
        <Link
          to="/calculadoras"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Voltar às Calculadoras
        </Link>

        <p className="text-sm font-medium text-blue-600">
          Calculadoras / Alteração de Valor
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Acréscimo e Supressão
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Calcule o percentual de alteração e o novo valor após um
          acréscimo ou uma supressão.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Calculator size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Dados do cálculo
              </h2>

              <p className="text-sm text-slate-500">
                Informe os valores para obter o resultado.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">
              Tipo de alteração
            </label>

            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipo('acrescimo')}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                  tipo === 'acrescimo'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <PlusCircle size={18} />
                Acréscimo
              </button>

              <button
                type="button"
                onClick={() => setTipo('supressao')}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                  tipo === 'supressao'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <MinusCircle size={18} />
                Supressão
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="valor-original"
                className="text-sm font-medium text-slate-700"
              >
                Valor original
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  R$
                </span>

                <input
                  id="valor-original"
                  type="text"
                  inputMode="numeric"
                  value={valorOriginal}
                  onChange={(event) =>
                    preencherMoeda(
                      event.target.value,
                      setValorOriginal,
                    )
                  }
                  placeholder="0,00"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="valor-alteracao"
                className="text-sm font-medium text-slate-700"
              >
                Valor da alteração
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  R$
                </span>

                <input
                  id="valor-alteracao"
                  type="text"
                  inputMode="numeric"
                  value={valorAlteracao}
                  onChange={(event) =>
                    preencherMoeda(
                      event.target.value,
                      setValorAlteracao,
                    )
                  }
                  placeholder="0,00"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          </div>

          {tipo === 'supressao' &&
            resultado.alteracao > resultado.original &&
            resultado.original > 0 && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                O valor da supressão informado é superior ao valor
                original.
              </div>
            )}

          <button
            type="button"
            onClick={limpar}
            className="mt-6 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Limpar cálculo
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <CircleDollarSign size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Resultado
              </h2>

              <p className="text-sm text-slate-500">
                Demonstrativo automático do cálculo.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#002B49] p-5 text-white">
            <p className="text-xs font-medium uppercase tracking-wide text-white/60">
              Novo valor
            </p>

            <p className="mt-2 break-words text-3xl font-bold">
              {possuiCalculo
                ? formatarMoeda(resultado.novoValor)
                : 'R$ 0,00'}
            </p>

            <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
              <Percent size={17} className="text-blue-200" />

              <span className="text-sm text-white/70">
                Percentual da alteração:
              </span>

              <strong>
                {formatarPercentual(resultado.percentual)}%
              </strong>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ResultadoLinha
              label="Valor original"
              value={formatarMoeda(resultado.original)}
            />

            <ResultadoLinha
              label={
                tipo === 'acrescimo'
                  ? 'Valor do acréscimo'
                  : 'Valor da supressão'
              }
              value={formatarMoeda(resultado.alteracao)}
            />

            <ResultadoLinha
              label="Percentual"
              value={`${formatarPercentual(
                resultado.percentual,
              )}%`}
            />

            <ResultadoLinha
              label="Valor resultante"
              value={formatarMoeda(resultado.novoValor)}
              destaque
            />
          </div>

          {possuiCalculo && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Memória do cálculo
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {formatarMoeda(resultado.alteracao)} ÷{' '}
                {formatarMoeda(resultado.original)} × 100 ={' '}
                <strong className="text-slate-900">
                  {formatarPercentual(resultado.percentual)}%
                </strong>
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {formatarMoeda(resultado.original)}{' '}
                {tipo === 'acrescimo' ? '+' : '−'}{' '}
                {formatarMoeda(resultado.alteracao)} ={' '}
                <strong className="text-slate-900">
                  {formatarMoeda(resultado.novoValor)}
                </strong>
              </p>
            </div>
          )}
        </section>
      </div>

      <p className="text-center text-xs text-slate-400">
        Ferramenta de apoio ao cálculo. A análise dos limites e da
        admissibilidade da alteração deve considerar o caso concreto e
        a legislação aplicável.
      </p>
    </div>
  );
}

function ResultadoLinha({
  label,
  value,
  destaque = false,
}: {
  label: string;
  value: string;
  destaque?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`text-right text-sm ${
          destaque
            ? 'font-bold text-blue-700'
            : 'font-semibold text-slate-900'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
