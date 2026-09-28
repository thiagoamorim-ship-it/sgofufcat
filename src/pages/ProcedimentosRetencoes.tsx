import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  Landmark,
  ReceiptText,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const SIRT_URL = 'https://sirt-web.hatchable.site/login';

const etapas = [
  {
    numero: '01',
    titulo: 'Identificar o fornecedor',
    descricao:
      'Antes de analisar alíquotas, confirme quem está recebendo o pagamento e sua situação tributária.',
    icon: Building2,
    conferir: [
      'CNPJ e razão social do fornecedor.',
      'Compatibilidade entre fornecedor, empenho, contrato e documento fiscal.',
      'Condição tributária informada pelo fornecedor.',
      'Se há situação específica que possa afastar ou modificar a retenção.',
    ],
    alerta:
      'Não determine o código da receita apenas pela descrição do item na nota fiscal.',
  },
  {
    numero: '02',
    titulo: 'Verificar hipóteses especiais',
    descricao:
      'Antes de aplicar a tabela geral, verifique se existem condições tributárias específicas.',
    icon: ShieldCheck,
    conferir: [
      'Optante pelo Simples Nacional.',
      'Isenção ou imunidade aplicável.',
      'Hipótese de não incidência.',
      'Alíquota zero de PIS/Pasep ou Cofins.',
      'Outras hipóteses de não retenção previstas na legislação.',
    ],
    alerta:
      'Uma exceção pode alterar completamente o resultado da análise. Não avance automaticamente para a alíquota geral.',
  },
  {
    numero: '03',
    titulo: 'Identificar o bem ou serviço',
    descricao:
      'Analise a natureza efetiva da operação, e não somente o texto resumido da nota fiscal.',
    icon: FileSearch,
    conferir: [
      'Descrição detalhada do objeto contratado.',
      'Documento fiscal apresentado.',
      'Contrato, termo de referência ou instrumento equivalente.',
      'Se é aquisição de bem, prestação de serviço ou situação mista.',
      'Características específicas da operação que influenciem o enquadramento.',
    ],
    alerta:
      'Termos semelhantes podem possuir tratamentos tributários diferentes.',
  },
  {
    numero: '04',
    titulo: 'Analisar IR, CSLL, Cofins e PIS/Pasep',
    descricao:
      'Com a natureza da operação identificada, consulte o enquadramento correspondente no Anexo I da IN RFB nº 1.234/2012.',
    icon: Calculator,
    conferir: [
      'Código da receita.',
      'Alíquota do IR.',
      'Alíquota da CSLL.',
      'Alíquota da Cofins.',
      'Alíquota do PIS/Pasep.',
      'Percentual total aplicável.',
      'Exceções e condições vinculadas ao enquadramento.',
    ],
    alerta:
      'Quando mais de um código for possível, confirme as condições específicas antes de concluir.',
  },
  {
    numero: '05',
    titulo: 'Analisar retenção previdenciária',
    descricao:
      'Nos serviços, verifique separadamente se existe hipótese de retenção previdenciária.',
    icon: Landmark,
    conferir: [
      'Forma efetiva de execução do serviço.',
      'Existência de cessão de mão de obra ou empreitada, quando aplicável.',
      'Natureza do serviço executado.',
      'Hipóteses específicas de incidência ou dispensa.',
      'Base de cálculo quando houver retenção.',
    ],
    alerta:
      'Não aplique 11% de INSS automaticamente a todo serviço. A incidência depende da hipótese legal.',
  },
  {
    numero: '06',
    titulo: 'Analisar ISS',
    descricao:
      'A retenção do ISS deve ser verificada separadamente das retenções federais.',
    icon: ReceiptText,
    conferir: [
      'Natureza do serviço.',
      'Município competente para o imposto.',
      'Local de incidência.',
      'Responsabilidade tributária do tomador.',
      'Legislação municipal aplicável.',
      'Alíquota aplicável ao serviço.',
    ],
    alerta:
      'A tabela da IN RFB nº 1.234/2012 não determina a retenção do ISS.',
  },
  {
    numero: '07',
    titulo: 'Conferir o documento fiscal',
    descricao:
      'Antes da conclusão, confronte o resultado da análise tributária com os documentos do processo.',
    icon: FileCheck2,
    conferir: [
      'Dados do fornecedor.',
      'Descrição do bem ou serviço.',
      'Valor bruto do documento.',
      'Tributos destacados ou informações tributárias apresentadas.',
      'Declarações e documentos complementares, quando exigíveis.',
      'Compatibilidade com contrato, empenho e objeto executado.',
    ],
    alerta:
      'Divergências relevantes devem ser esclarecidas antes da retenção e do pagamento.',
  },
  {
    numero: '08',
    titulo: 'Concluir a análise',
    descricao:
      'Após todas as verificações, registre o enquadramento utilizado e os valores da retenção.',
    icon: ClipboardCheck,
    conferir: [
      'Fundamento legal utilizado.',
      'Código da receita selecionado.',
      'Percentuais aplicados.',
      'Base de cálculo.',
      'Valor de cada retenção.',
      'Eventuais hipóteses de não retenção.',
      'Documentos que sustentam a conclusão.',
    ],
    alerta:
      'A conclusão deve permitir identificar como o enquadramento tributário foi determinado.',
  },
];

function Resumo({
  numero,
  titulo,
  texto,
}: {
  numero: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-blue-50 px-2 text-sm font-bold text-blue-700">
          {numero}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {titulo}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProcedimentosRetencoes() {
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
          Gestão / Retenções / Procedimentos
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Procedimentos de Retenções
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Roteiro de apoio para conferência das retenções
          tributárias antes da liquidação e do pagamento.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <SearchCheck
            size={21}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Fluxo de conferência
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Siga as etapas em sequência. A identificação
              do fornecedor e das exceções ocorre antes da
              escolha do código e da alíquota.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Resumo
          numero="1–3"
          titulo="Identificação"
          texto="Fornecedor e operação"
        />

        <Resumo
          numero="4"
          titulo="Federais"
          texto="IR, CSLL, Cofins e PIS"
        />

        <Resumo
          numero="5–6"
          titulo="Outros tributos"
          texto="INSS e ISS"
        />

        <Resumo
          numero="7–8"
          titulo="Conclusão"
          texto="Conferência e registro"
        />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Passo a passo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Utilize o roteiro como apoio durante a análise
            do processo.
          </p>
        </div>

        <div className="space-y-4">
          {etapas.map((etapa) => {
            const Icon = etapa.icon;

            return (
              <article
                key={etapa.numero}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-blue-600">
                        ETAPA {etapa.numero}
                      </span>
                    </div>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {etapa.titulo}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {etapa.descricao}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5 md:ml-16">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    O que conferir
                  </p>

                  <div className="mt-3 grid gap-2.5 md:grid-cols-2">
                    {etapa.conferir.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <p className="text-sm leading-5 text-slate-600">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                    <AlertTriangle
                      size={17}
                      className="mt-0.5 shrink-0 text-amber-700"
                    />

                    <p className="text-sm leading-5 text-slate-600">
                      {etapa.alerta}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            navigate('/retencoes/tabela-de-bolso')
          }
          className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Calculator size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Tabela de bolso
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Consultar códigos e alíquotas.
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
            />
          </div>
        </button>

        <a
          href={SIRT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Calculator size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  SIRT
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Abrir sistema especializado.
                </p>
              </div>
            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-400 transition group-hover:text-blue-700"
            />
          </div>
        </a>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-slate-600"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Natureza deste roteiro
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Este conteúdo é um roteiro de apoio à
              conferência no SGOF. Ele não representa,
              por si só, um POP institucional do HU-UFCAT
              e não substitui a legislação vigente, os
              documentos do processo ou procedimentos
              institucionais formalmente aprovados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
