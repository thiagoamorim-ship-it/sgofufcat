import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileDown,
  Landmark,
  Loader2,
  Search,
  ShieldCheck,
} from 'lucide-react';

function onlyNumbers(value: string) {
  return value.replace(/\D/g, '').slice(0, 14);
}

function formatCNPJ(value: string) {
  const digits = onlyNumbers(value);

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function isValidCNPJ(value: string) {
  const cnpj = onlyNumbers(value);

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calc = (base: string, weights: number[]) => {
    const sum = base
      .split('')
      .reduce(
        (total, digit, index) =>
          total + Number(digit) * weights[index],
        0,
      );

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calc(
    cnpj.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const digit2 = calc(
    cnpj.slice(0, 12) + digit1,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return cnpj.endsWith(`${digit1}${digit2}`);
}

type ConsultationStatus =
  | 'ready'
  | 'integration'
  | 'external';

type Consultation = {
  title: string;
  subtitle: string;
  description: string;
  status: ConsultationStatus;
  url?: string;
};

const consultations: Consultation[] = [
  {
    title: 'Receita Federal / PGFN',
    subtitle: 'Regularidade Fiscal Federal',
    description:
      'Certidão relativa aos tributos federais e à Dívida Ativa da União.',
    status: 'integration',
    url: 'https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal-perante-a-fazenda-nacional',
  },
  {
    title: 'FGTS / CRF',
    subtitle: 'Regularidade do FGTS',
    description:
      'Certificado de Regularidade do Fundo de Garantia do Tempo de Serviço.',
    status: 'external',
    url: 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf',
  },
  {
    title: 'CNDT',
    subtitle: 'Regularidade Trabalhista',
    description:
      'Certidão Negativa de Débitos Trabalhistas.',
    status: 'external',
    url: 'https://cndt-certidao.tst.jus.br/inicio.faces',
  },
  {
    title: 'SICAF',
    subtitle: 'Situação Cadastral',
    description:
      'Situação cadastral e níveis de regularidade do fornecedor.',
    status: 'external',
    url: 'https://www3.comprasnet.gov.br/sicaf-web/index.jsf',
  },
  {
    title: 'CADIN',
    subtitle: 'Cadastro de Inadimplentes',
    description:
      'Consulta ao Cadastro Informativo de Créditos não Quitados do Setor Público Federal.',
    status: 'integration',
    url: 'https://www.gov.br/conecta/catalogo/apis/api-cadin-consulta-contratante',
  },
];

export default function Regularidade() {
  const [cnpj, setCnpj] = useState('');
  const [searchedCnpj, setSearchedCnpj] = useState('');
  const [error, setError] = useState('');

  const valid = useMemo(() => isValidCNPJ(cnpj), [cnpj]);

  function handleSearch() {
    if (!valid) {
      setError('Informe um CNPJ válido para realizar a consulta.');
      setSearchedCnpj('');
      return;
    }

    setError('');
    setSearchedCnpj(formatCNPJ(cnpj));
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Regularidade
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Central de Regularidade
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Consulte a situação fiscal, trabalhista e cadastral do
          fornecedor a partir de um único CNPJ.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Consultar fornecedor
            </h2>

            <p className="text-sm text-slate-500">
              Informe o CNPJ para iniciar a conferência consolidada.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Building2
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              inputMode="numeric"
              value={formatCNPJ(cnpj)}
              onChange={(event) => {
                setCnpj(onlyNumbers(event.target.value));
                setError('');
                setSearchedCnpj('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="00.000.000/0000-00"
              className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Search size={18} />
            Consultar regularidade
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </section>

      {searchedCnpj && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Building2 size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    CNPJ consultado
                  </p>

                  <p className="font-semibold text-slate-900">
                    {searchedCnpj}
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Consulta consolidada
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Resultado das consultas
              </h2>

              <p className="text-sm text-slate-500">
                O painel será atualizado conforme cada integração
                oficial for conectada ao SGOF.
              </p>
            </div>

            <div className="space-y-3">
              {consultations.map((item) => (
                <ConsultationCard
                  key={item.title}
                  item={item}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              title="Consultas"
              value="5"
              description="Fontes de regularidade"
            />

            <SummaryCard
              title="Integrações"
              value="2"
              description="CND Federal e CADIN"
            />

            <SummaryCard
              title="Documentos"
              value="—"
              description="Disponíveis após integração"
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Relatório de Regularidade
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Consolidará os resultados e documentos oficiais
                  obtidos pelo SGOF.
                </p>
              </div>

              <button
                type="button"
                disabled
                className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
              >
                <FileDown size={18} />
                Gerar PDF
              </button>
            </div>
          </section>

          <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-sm leading-6 text-slate-600">
              O SGOF não considera um fornecedor regular apenas pela
              validação do CNPJ. Cada situação será apresentada somente
              após resposta da respectiva fonte oficial.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ConsultationCard({
  item,
}: {
  item: Consultation;
}) {
  const integration = item.status === 'integration';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            <Landmark size={20} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">
                {item.title}
              </h3>

              {integration ? (
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  <Loader2 size={12} />
                  API disponível
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <Clock3 size={12} />
                  Consulta externa
                </span>
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {item.subtitle}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-400">
              Situação
            </p>

            <p className="text-sm font-medium text-slate-600">
              Aguardando integração
            </p>
          </div>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Portal oficial
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <CheckCircle2 size={18} />
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
