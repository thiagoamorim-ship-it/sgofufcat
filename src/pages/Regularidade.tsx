import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Landmark,
  Search,
  ShieldCheck,
  TriangleAlert,
  Users,
  WalletCards,
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

  const calculateDigit = (base: string, weights: number[]) => {
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

  const firstDigit = calculateDigit(
    cnpj.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const secondDigit = calculateDigit(
    cnpj.slice(0, 12) + firstDigit,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return cnpj.endsWith(`${firstDigit}${secondDigit}`);
}

const services = [
  {
    title: 'Receita Federal / PGFN',
    description:
      'Certidão de regularidade fiscal perante a Fazenda Nacional.',
    icon: Landmark,
    url: 'https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal',
    badge: 'Federal',
  },
  {
    title: 'FGTS',
    description:
      'Consulta do Certificado de Regularidade do FGTS.',
    icon: WalletCards,
    url: 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf',
    badge: 'FGTS',
  },
  {
    title: 'CNDT',
    description:
      'Certidão Negativa de Débitos Trabalhistas.',
    icon: FileCheck2,
    url: 'https://cndt-certidao.tst.jus.br/inicio.faces',
    badge: 'Trabalhista',
  },
  {
    title: 'SICAF',
    description:
      'Cadastro e situação do fornecedor no Governo Federal.',
    icon: Users,
    url: 'https://www3.comprasnet.gov.br/sicaf-web/index.jsf',
    badge: 'Cadastro',
  },
];

export default function Regularidade() {
  const [cnpj, setCnpj] = useState('');
  const [searchedCnpj, setSearchedCnpj] = useState('');
  const [message, setMessage] = useState('');

  const valid = useMemo(() => isValidCNPJ(cnpj), [cnpj]);

  function handleSearch() {
    if (!valid) {
      setMessage('Informe um CNPJ válido para iniciar a conferência.');
      setSearchedCnpj('');
      return;
    }

    setMessage('');
    setSearchedCnpj(formatCNPJ(cnpj));
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Regularidade
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Regularidade do Fornecedor
        </h1>

        <p className="mt-2 text-slate-500">
          Centralize as consultas de regularidade fiscal, trabalhista
          e cadastral do fornecedor.
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
              Informe o CNPJ uma única vez para iniciar a conferência.
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
                setMessage('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="00.000.000/0000-00"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Search size={18} />
            Consultar
          </button>
        </div>

        {message && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <TriangleAlert size={18} />
            {message}
          </div>
        )}

        {searchedCnpj && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2
              size={20}
              className="text-emerald-600"
            />

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                CNPJ válido
              </p>

              <p className="text-xs text-emerald-700">
                {searchedCnpj}
              </p>
            </div>
          </div>
        )}
      </section>

      {searchedCnpj && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Consultas de regularidade
            </h2>

            <p className="text-sm text-slate-500">
              Utilize os canais oficiais para conferir a situação do
              fornecedor.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <a
                  key={service.title}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {service.title}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            {service.badge}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <ExternalLink
                      size={16}
                      className="shrink-0 text-slate-300 transition group-hover:text-blue-600"
                    />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-4 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <BadgeCheck
              size={20}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-sm leading-6 text-slate-600">
              O SGO centraliza os acessos, mas a situação apresentada
              em cada certidão deve ser confirmada no respectivo
              sistema oficial.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
