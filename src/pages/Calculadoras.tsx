import {
  ArrowRight,
  CalendarDays,
  Calculator,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Percent,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const calculators = [
  {
    id: 'acrescimo-supressao',
    title: 'Acréscimo e Supressão',
    description:
      'Calcule o percentual de alteração e o novo valor do contrato.',
    icon: Percent,
    available: true,
    path: '/calculadoras/acrescimo-supressao',
  },
  {
    id: 'reajuste',
    title: 'Reajuste de Valores',
    description:
      'Calcule reajustes por percentual ou variação de índice.',
    icon: RefreshCw,
    available: false,
  },
  {
    id: 'rateio',
    title: 'Rateio Proporcional',
    description:
      'Distribua um valor entre itens, fontes ou centros de custo.',
    icon: Scale,
    available: false,
  },
  {
    id: 'saldo-empenho',
    title: 'Saldo de Empenho',
    description:
      'Calcule saldos a liquidar e a pagar a partir da execução da despesa.',
    icon: CircleDollarSign,
    available: false,
  },
  {
    id: 'execucao',
    title: 'Execução da Despesa',
    description:
      'Calcule os percentuais de empenho, liquidação e pagamento.',
    icon: ChartNoAxesColumnIncreasing,
    available: false,
  },
  {
    id: 'prazos',
    title: 'Prazos e Datas',
    description:
      'Calcule intervalos entre datas e projeções de vencimento.',
    icon: CalendarDays,
    available: false,
  },
];

export default function Calculadoras() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Calculadoras
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Calculadoras
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Ferramentas rápidas para apoio às rotinas orçamentárias,
          financeiras e contratuais.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <Calculator
            size={22}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Central de cálculos
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Selecione uma ferramenta para realizar o cálculo.
              Os resultados são processados diretamente no navegador.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Ferramentas
          </h2>

          <p className="text-sm text-slate-500">
            Escolha o cálculo que deseja realizar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {calculators.map((calculator) => {
            const Icon = calculator.icon;

            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      calculator.available
                        ? 'bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      calculator.available
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {calculator.available
                      ? 'Disponível'
                      : 'Em breve'}
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {calculator.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {calculator.description}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  {calculator.available ? (
                    <span className="flex items-center gap-1 text-sm font-semibold text-blue-700">
                      Abrir calculadora
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">
                      Em desenvolvimento
                    </span>
                  )}
                </div>
              </>
            );

            if (calculator.available && calculator.path) {
              return (
                <Link
                  key={calculator.id}
                  to={calculator.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={calculator.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 opacity-75 shadow-sm"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Como funciona
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Feature
            number="01"
            title="Informe os valores"
            description="Preencha somente os dados necessários para o cálculo."
          />

          <Feature
            number="02"
            title="Resultado automático"
            description="O SGOF realiza o cálculo diretamente no navegador."
          />

          <Feature
            number="03"
            title="Demonstrativo"
            description="Confira a memória resumida do cálculo e o resultado final."
          />
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        As calculadoras são ferramentas de apoio à conferência e não
        substituem a análise dos documentos do processo.
      </p>
    </div>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <span className="text-xs font-bold text-blue-600">
        {number}
      </span>

      <h3 className="mt-2 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
