import {
  ArrowLeft,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Info,
  Layers3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const tipos = [
  {
    title: 'Empenho Ordinário',
    subtitle: 'Valor conhecido • Pagamento único',
    description:
      'Utilizado quando a despesa possui finalidade determinada, valor previamente conhecido e sua liquidação e pagamento ocorrerão de uma só vez.',
    exemplo:
      'Exemplo: aquisição de um bem ou material com valor definido e entrega prevista para pagamento em parcela única.',
    pergunta: 'O valor é conhecido e o pagamento ocorrerá de uma só vez?',
    resposta: 'Em regra, utilize o empenho ordinário.',
    icon: CheckCircle2,
  },
  {
    title: 'Empenho por Estimativa',
    subtitle: 'Valor não determinado previamente',
    description:
      'Utilizado quando não é possível determinar previamente o montante exato da despesa.',
    exemplo:
      'Exemplos clássicos incluem despesas variáveis de água, energia elétrica, gás e telefone.',
    pergunta: 'Não é possível determinar previamente o valor exato?',
    resposta: 'Pode ser caso de empenho por estimativa.',
    icon: CircleDollarSign,
  },
  {
    title: 'Empenho Global',
    subtitle: 'Valor conhecido • Pagamento parcelado',
    description:
      'Utilizado para despesas contratuais e outras de valor determinado sujeitas a parcelamento.',
    exemplo:
      'Exemplo: contrato com valor total conhecido cuja execução e pagamentos ocorrerão em parcelas ao longo do período contratado.',
    pergunta: 'O valor total é conhecido, mas haverá pagamentos parcelados?',
    resposta: 'Pode ser caso de empenho global.',
    icon: CalendarRange,
  },
];

export default function TiposEmpenho() {
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
          Base de Conhecimento / Empenho
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Tipos de Empenho
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Referência rápida para diferenciar os empenhos ordinário,
          estimativo e global durante a execução da despesa.
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
              O que é o empenho?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              O empenho é um estágio da execução da despesa pública.
              Representa o ato da autoridade competente que cria para o
              Estado obrigação de pagamento, pendente ou não do
              implemento de condição.
            </p>

            <p className="mt-2 text-sm font-medium leading-6 text-blue-800">
              A realização de despesa sem prévio empenho é vedada pela
              Lei nº 4.320/1964.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Qual tipo utilizar?
          </h2>

          <p className="text-sm text-slate-500">
            Observe principalmente se o valor é conhecido e como ocorrerá
            o pagamento.
          </p>
        </div>

        <div className="space-y-4">
          {tipos.map((tipo) => {
            const Icon = tipo.icon;

            return (
              <div
                key={tipo.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {tipo.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                      {tipo.subtitle}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {tipo.description}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Exemplo prático
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {tipo.exemplo}
                      </p>
                    </div>

                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {tipo.pergunta}
                      </p>

                      <p className="mt-1 text-sm text-blue-700">
                        {tipo.resposta}
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
          <Layers3
            size={21}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div className="w-full">
            <h2 className="font-semibold text-slate-900">
              Resumo rápido
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">
                      Tipo
                    </th>
                    <th className="pb-3 pr-4 font-semibold">
                      Valor
                    </th>
                    <th className="pb-3 font-semibold">
                      Característica
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      Ordinário
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      Conhecido
                    </td>
                    <td className="py-3 text-slate-600">
                      Liquidação e pagamento de uma só vez
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      Estimativo
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      Não determinado previamente
                    </td>
                    <td className="py-3 text-slate-600">
                      O montante exato não pode ser previamente determinado
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      Global
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      Conhecido
                    </td>
                    <td className="py-3 text-slate-600">
                      Despesa contratual ou outra sujeita a parcelamento
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
              Atenção na escolha
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              A escolha não deve considerar apenas a existência de um
              contrato. Verifique se o valor da despesa é previamente
              conhecido e se a obrigação será liquidada e paga de uma
              única vez ou de forma parcelada.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <FileText
            size={20}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Fundamentação
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Lei nº 4.320/1964, especialmente arts. 58 a 61.
              O art. 60 estabelece as regras relacionadas ao empenho
              prévio, ao empenho por estimativa e ao empenho global.
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        Base de Conhecimento • SGOF • HU-UFCAT
      </p>
    </div>
  );
}
