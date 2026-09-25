import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Landmark,
  Maximize2,
  Monitor,
  PenLine,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Step = {
  number: string;
  title: string;
  system: string;
  description: string;
  icon: typeof Landmark;
  image?: string;
  imageTitle?: string;
};

const steps: Step[] = [
  {
    number: '01',
    title: 'Verificar disponibilidade',
    system: 'Orçamento',
    description:
      'Verifique se existe orçamento disponível antes de iniciar a concessão do CDO.',
    icon: CheckCircle2,
  },
  {
    number: '02',
    title: 'Preencher a planilha',
    system: 'Planilha de Disponibilidade Orçamentária',
    description:
      'Preencha a planilha de disponibilidade. As informações registradas serão utilizadas nas etapas seguintes no SIAFI.',
    icon: FileSpreadsheet,
    image: '/guia/disponibilidade/06-planilha-siafi-id-cdo.png',
    imageTitle: 'Planilha de Disponibilidade Orçamentária',
  },
  {
    number: '03',
    title: 'Acessar o SIAFI Web',
    system: 'SIAFI Web • INCNC',
    description:
      'Acesse a função INCNC — Incluir Nota de Crédito — e selecione a operação Detalhamento de Crédito.',
    icon: Landmark,
    image: '/guia/disponibilidade/01-incnc.png',
    imageTitle: 'INCNC — Incluir Nota de Crédito',
  },
  {
    number: '04',
    title: 'Preencher o detalhamento e a origem',
    system: 'SIAFI Web',
    description:
      'Preencha a descrição e informe a célula orçamentária de origem utilizando os dados da planilha de disponibilidade.',
    icon: Monitor,
    image: '/guia/disponibilidade/04-origem-credito.png',
    imageTitle: 'Origem do crédito',
  },
  {
    number: '05',
    title: 'Preencher o destino',
    system: 'SIAFI Web',
    description:
      'Informe a célula orçamentária de destino utilizando os dados correspondentes da planilha.',
    icon: Monitor,
    image: '/guia/disponibilidade/05-destino-credito.png',
    imageTitle: 'Destino do crédito',
  },
  {
    number: '06',
    title: 'Registrar a disponibilidade',
    system: 'SIAFI Web',
    description:
      'Confirme a origem, confira o sequencial e registre a Disponibilidade Orçamentária.',
    icon: CheckCircle2,
    image: '/guia/disponibilidade/02-detalhamento-credito.png',
    imageTitle: 'Detalhamento de Crédito',
  },
  {
    number: '07',
    title: 'Aguardar assinatura',
    system: 'SEI',
    description:
      'Após a concessão da disponibilidade, aguarde a assinatura do chefe antes de prosseguir para a etapa de empenho.',
    icon: PenLine,
  },
];

type Preview = {
  src: string;
  title: string;
} | null;

export default function DisponibilidadeOrcamentaria() {
  const [preview, setPreview] = useState<Preview>(null);

  return (
    <>
      <div className="space-y-6">
        <section>
          <Link
            to="/checklist"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Voltar ao Guia Operacional
          </Link>

          <p className="text-sm font-medium text-blue-600">
            Guia Operacional / Disponibilidade Orçamentária
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Disponibilidade Orçamentária
          </h1>

          <p className="mt-2 max-w-3xl text-slate-500">
            Passo a passo para verificação do orçamento, concessão do
            CDO e detalhamento do crédito para emissão do empenho.
          </p>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex items-start gap-3">
            <Info
              size={21}
              className="mt-0.5 shrink-0 text-blue-700"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Objetivo do procedimento
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Especificar a origem e a destinação dos recursos
                orçamentários antes da emissão da Nota de Empenho,
                utilizando os marcadores da célula orçamentária.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Passo a passo
            </h2>

            <p className="text-sm text-slate-500">
              Siga as etapas na ordem indicada pelo POP.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-blue-600">
                          PASSO {step.number}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {step.system}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {step.description}
                      </p>

                      {step.image && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreview({
                              src: step.image!,
                              title: step.imageTitle || step.title,
                            })
                          }
                          className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Monitor size={16} />
                          Ver tela do procedimento
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <BookOpen
              size={20}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div className="w-full">
              <h2 className="font-semibold text-slate-900">
                Dados utilizados no SIAFI
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                As informações são obtidas na Planilha de
                Disponibilidade Orçamentária.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DataItem
                  label="Descrição"
                  value="Coluna AA"
                />

                <DataItem
                  label="Esfera"
                  value="Coluna AI"
                />

                <DataItem
                  label="PTRES"
                  value="Coluna K"
                />

                <DataItem
                  label="Fonte • Origem"
                  value="Coluna AQ"
                />

                <DataItem
                  label="Natureza da Despesa"
                  value="Coluna N"
                />

                <DataItem
                  label="Plano Interno • Origem"
                  value="Coluna Y"
                />

                <DataItem
                  label="Fonte • Destino"
                  value="Coluna AS"
                />

                <DataItem
                  label="Plano Interno • Destino"
                  value="Coluna Z"
                />

                <DataItem
                  label="Valor"
                  value="Coluna J"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-end">
          <Link
            to="/checklist"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Voltar ao fluxo
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Tela do procedimento
                </p>

                <h2 className="mt-1 font-semibold text-slate-900">
                  {preview.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Fechar"
              >
                <X size={21} />
              </button>
            </div>

            <div className="overflow-auto bg-slate-100 p-4 md:p-6">
              <img
                src={preview.src}
                alt={preview.title}
                className="mx-auto max-h-[70vh] max-w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Maximize2 size={14} />
                Imagem extraída do POP do setor
              </div>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DataItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
