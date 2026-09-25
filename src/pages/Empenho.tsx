import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileSignature,
  Landmark,
  ListChecks,
  Scale,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Verificar autorização',
    system: 'SEI',
    description:
      'Verifique se consta no processo a autorização e assinatura do Ordenador de Despesa.',
    icon: FileCheck2,
  },
  {
    number: '02',
    title: 'Verificar regularidade',
    system: 'SICAF • CADIN',
    description:
      'Confira a regularidade fiscal do fornecedor, especialmente SICAF e CADIN, antes da emissão do empenho.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Acessar a Minuta de Empenho',
    system: 'Contratos.gov.br',
    description:
      'Confirme a UG 157602 — HU-UFCat — e acesse Gestão Orçamentária → Minuta de Empenho.',
    icon: Landmark,
  },
  {
    number: '04',
    title: 'Adicionar Minuta de Empenho',
    system: 'Contratos.gov.br',
    description:
      'Na área de Minuta de Empenho, selecione a opção para adicionar uma nova minuta.',
    icon: FileSignature,
  },
  {
    number: '05',
    title: 'Identificar o tipo da contratação',
    system: 'Contratos.gov.br',
    description:
      'Verifique se o empenho possui contrato ou se corresponde somente a uma compra.',
    icon: ClipboardCheck,
  },
  {
    number: '06',
    title: 'Selecionar modalidade da compra',
    system: 'Contratos.gov.br',
    description:
      'Selecione a modalidade da compra conforme o processo que está sendo empenhado.',
    icon: ShoppingCart,
  },
  {
    number: '07',
    title: 'Informar Pregão e Unidade de Compra',
    system: 'Contratos.gov.br',
    description:
      'Informe o número e o ano do Pregão e confira a Unidade de Compra responsável pela homologação.',
    icon: ListChecks,
  },
  {
    number: '08',
    title: 'Informar Unidade Beneficiária',
    system: 'Contratos.gov.br',
    description:
      'Quando a Unidade de Compra não for 157602, informe 157602 como Unidade Beneficiária. Se a Unidade de Compra já for 157602, deixe o campo em branco.',
    icon: Landmark,
  },
  {
    number: '09',
    title: 'Selecionar fornecedor e item',
    system: 'Contratos.gov.br',
    description:
      'Selecione o fornecedor correspondente ao processo e, em seguida, o item que será empenhado.',
    icon: ShoppingCart,
  },
  {
    number: '10',
    title: 'Selecionar célula orçamentária',
    system: 'Contratos.gov.br',
    description:
      'Selecione a célula orçamentária correspondente ao despacho de CDO. Caso ela não esteja disponível, utilize a opção de inserir célula.',
    icon: Landmark,
  },
  {
    number: '11',
    title: 'Informar subelemento e quantidade',
    system: 'Contratos.gov.br',
    description:
      'Selecione o subelemento correspondente aos dois últimos dígitos da NDD e informe a quantidade do item.',
    icon: ListChecks,
  },
  {
    number: '12',
    title: 'Preencher os dados do empenho',
    system: 'Contratos.gov.br',
    description:
      'Preencha a data de emissão, tipo de empenho, número do processo SEI e demais dados da emissão.',
    icon: FileSignature,
  },
  {
    number: '13',
    title: 'Conferir fundamento e observação',
    system: 'Contratos.gov.br',
    description:
      'Confira o fundamento legal, a indicação de empenho substitutivo de contrato, local e descrição/observação conforme o processo.',
    icon: Scale,
  },
  {
    number: '14',
    title: 'Verificar Passivo Anterior',
    system: 'Contratos.gov.br',
    description:
      'Preencha a informação de Passivo Anterior somente quando houver passivo anterior relacionado ao empenho.',
    icon: AlertTriangle,
  },
  {
    number: '15',
    title: 'Finalizar e emitir o empenho',
    system: 'Contratos.gov.br • SIAFI',
    description:
      'Confira os dados, selecione Emitir Empenho SIAFI e finalize a emissão.',
    icon: CheckCircle2,
  },
  {
    number: '16',
    title: 'Registrar no SEI e na planilha',
    system: 'SEI • Planilha SGOF',
    description:
      'Inclua o anexo com o número do empenho, utilize o despacho padrão EMPENHOS EMITIDOS e registre o empenho na planilha SGOF-HU-UFCat.',
    icon: FileCheck2,
  },
];

export default function Empenho() {
  return (
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
          Guia Operacional / Empenho
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Emissão de Empenho
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Passo a passo para conferência, elaboração da minuta e
          emissão do empenho.
        </p>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Antes de emitir o empenho
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Verifique a autorização do Ordenador de Despesa e a
              regularidade do fornecedor antes de iniciar a emissão.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Unidade Gestora"
          value="157602"
          detail="HU-UFCat"
        />

        <InfoCard
          title="Sistema"
          value="Contratos.gov.br"
          detail="Gestão Orçamentária"
        />

        <InfoCard
          title="Processo"
          value="SEI"
          detail="Número do processo"
        />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Passo a passo
          </h2>

          <p className="text-sm text-slate-500">
            Procedimento organizado em sequência operacional a partir
            do POP do setor.
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <Scale
            size={21}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Dados indicados no POP
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DataItem
                label="Fundamento legal indicado"
                value="Lei 14.133/2021 • Art. 28, I"
              />

              <DataItem
                label="Local"
                value="CATALAO/GO"
              />

              <DataItem
                label="Compras sem contrato"
                value="Empenho Substitutivo de Contrato: Sim"
              />

              <DataItem
                label="Despacho final"
                value="EMPENHOS EMITIDOS"
              />
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        Consulte sempre o POP vigente e os documentos do processo
        antes da emissão.
      </p>
    </div>
  );
}

function InfoCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {detail}
      </p>
    </div>
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
    <div className="rounded-xl bg-white/70 p-3">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
