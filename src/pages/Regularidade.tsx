import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  ExternalLink,
  FileCheck2,
  Landmark,
  Search,
  ShieldCheck,
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

const consultations = [
  {
    title: 'Receita Federal / PGFN',
    subtitle: 'Regularidade Fiscal Federal',
    description:
      'Certidão relativa a tributos federais e à Dívida Ativa da União.',
    icon: Landmark,
    url: 'https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal-perante-a-fazenda-nacional',
  },
  {
    title: 'FGTS / CRF',
    subtitle: 'Regularidade do FGTS',
    description:
      'Certificado de Regularidade do Fundo de Garantia do Tempo de Serviço.',
    icon: WalletCards,
    url: 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf',
  },
  {
    title: 'CNDT',
    subtitle: 'Regularidade Trabalhista',
    description:
      'Emissão da Certidão Negativa de Débitos Trabalhistas.',
    icon: FileCheck2,
    url: 'https://cndt-certidao.tst.jus.br/inicio.faces',
  },
  {
    title: 'SICAF',
    subtitle: 'Situação do Fornecedor',
    description:
      'Consulta cadastral e de regularidade do fornecedor no Governo Federal.',
    icon: Users,
    url: 'https://www3.comprasnet.gov.br/sicaf-web/index.jsf',
  },
  {
    title: 'CADIN',
    subtitle: 'Cadastro Informativo',
    description:
      'Consulta relacionada ao Cadastro Informativo de Créditos não Quitados do Setor Público Federal.',
    icon: ShieldCheck,
    url: 'https://cadin.pgfn.gov.br/',
  },
];

export default function Regularidade() {
  const [cnpj, setCnpj] = useState('');
  const [searchedCnpj, setSearchedCnpj] = useState('');
  const [error, setError] = useState('');

  const valid = useMemo(() => isValidCNPJ(cnpj), [cnpj]);

  function handleSearch() {
    if (!valid) {
      setError('Informe um CNPJ válido para iniciar as consultas.');
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
          Centralize o acesso às consultas oficiais de regularidade
          fiscal, trabalhista e cadastral dos fornecedores.
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
              Informe o CNPJ para acessar as consultas de regularidade.
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
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Search size={18} />
            Iniciar consultas
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
          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex items-center gap-3">
              <Building2
                size={21}
                className="text-blue-700"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Fornecedor em conferência
                </p>

                <p className="font-semibold text-slate-900">
                  {searchedCnpj}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Consultas oficiais
              </h2>

              <p className="text-sm text-slate-500">
                Abra cada sistema oficial para emitir ou consultar o
                respectivo documento.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {consultations.map((consultation) => {
                const Icon = consultation.icon;

                return (
                  <a
                    key={consultation.title}
                    href={consultation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        Consulta externa
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      {consultation.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-700">
                      {consultation.subtitle}
                    </p>

                    <p className="mt-2 flex-1 text-sm leading-5 text-slate-500">
                      {consultation.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600 transition group-hover:text-blue-700">
                      Acessar portal oficial
                      <ExternalLink size={15} />
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Conferência da regularidade
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  As consultas são realizadas nos respectivos sistemas
                  oficiais. O SGOF não atribui situação de regularidade
                  automaticamente.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
