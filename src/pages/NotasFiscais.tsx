import { useState } from 'react';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileCode2,
  Hash,
  Package,
  ReceiptText,
  UploadCloud,
} from 'lucide-react';

type NFeData = {
  numero: string;
  serie: string;
  chave: string;
  emissao: string;
  fornecedor: string;
  cnpj: string;
  destinatario: string;
  cnpjDestinatario: string;
  valorTotal: string;
  valorProdutos: string;
  valorFrete: string;
  valorDesconto: string;
  itens: number;
};

function getText(parent: Element | Document, tag: string) {
  return parent.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
}

function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 14) return value || '—';

  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

function formatCurrency(value: string) {
  const number = Number(value);

  if (!value || Number.isNaN(number)) return 'R$ 0,00';

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(value: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function NotasFiscais() {
  const [data, setData] = useState<NFeData | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  async function processXML(file?: File) {
    if (!file) return;

    setError('');
    setData(null);

    if (!file.name.toLowerCase().endsWith('.xml')) {
      setError('Selecione um arquivo XML de NF-e.');
      return;
    }

    try {
      const text = await file.text();
      const xml = new DOMParser().parseFromString(text, 'application/xml');

      if (xml.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML inválido');
      }

      const infNFe = xml.getElementsByTagName('infNFe')[0];

      if (!infNFe) {
        throw new Error('NF-e não encontrada');
      }

      const ide = infNFe.getElementsByTagName('ide')[0];
      const emit = infNFe.getElementsByTagName('emit')[0];
      const dest = infNFe.getElementsByTagName('dest')[0];
      const total = infNFe.getElementsByTagName('ICMSTot')[0];

      const chave =
        infNFe.getAttribute('Id')?.replace(/^NFe/, '') ||
        getText(xml, 'chNFe');

      const emissao =
        getText(ide, 'dhEmi') ||
        getText(ide, 'dEmi');

      const itens = infNFe.getElementsByTagName('det').length;

      setData({
        numero: getText(ide, 'nNF'),
        serie: getText(ide, 'serie'),
        chave,
        emissao,
        fornecedor: getText(emit, 'xNome'),
        cnpj: getText(emit, 'CNPJ') || getText(emit, 'CPF'),
        destinatario: getText(dest, 'xNome'),
        cnpjDestinatario:
          getText(dest, 'CNPJ') || getText(dest, 'CPF'),
        valorTotal: getText(total, 'vNF'),
        valorProdutos: getText(total, 'vProd'),
        valorFrete: getText(total, 'vFrete'),
        valorDesconto: getText(total, 'vDesc'),
        itens,
      });

      setFileName(file.name);
    } catch {
      setError(
        'Não foi possível identificar uma NF-e válida nesse arquivo XML.',
      );
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Gestão / Notas Fiscais
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Notas Fiscais
        </h1>

        <p className="mt-2 text-slate-500">
          Importe o XML da NF-e para visualizar e conferir os principais
          dados fiscais.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ReceiptText size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Importar XML da NF-e
            </h2>

            <p className="text-sm text-slate-500">
              O arquivo é processado diretamente no navegador.
            </p>
          </div>
        </div>

        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            processXML(event.dataTransfer.files[0]);
          }}
        >
          <UploadCloud size={36} className="mb-3 text-blue-600" />

          <span className="font-semibold text-slate-800">
            Clique para selecionar ou arraste o XML
          </span>

          <span className="mt-1 text-sm text-slate-500">
            Arquivos XML de Nota Fiscal Eletrônica
          </span>

          <input
            type="file"
            accept=".xml,text/xml,application/xml"
            className="hidden"
            onChange={(event) => processXML(event.target.files?.[0])}
          />
        </label>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </section>

      {data && (
        <>
          <section className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 size={20} className="text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                NF-e carregada com sucesso
              </p>

              <p className="text-xs text-emerald-700">
                {fileName}
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              icon={Hash}
              label="NF-e"
              value={`${data.numero || '—'} / Série ${data.serie || '—'}`}
            />

            <InfoCard
              icon={CalendarDays}
              label="Emissão"
              value={formatDate(data.emissao)}
            />

            <InfoCard
              icon={Package}
              label="Itens"
              value={String(data.itens)}
            />

            <InfoCard
              icon={ReceiptText}
              label="Valor da NF-e"
              value={formatCurrency(data.valorTotal)}
              highlight
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={19} className="text-blue-600" />
                <h2 className="font-semibold text-slate-900">
                  Emitente
                </h2>
              </div>

              <p className="font-semibold text-slate-800">
                {data.fornecedor || 'Não informado'}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {formatCNPJ(data.cnpj)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={19} className="text-blue-600" />
                <h2 className="font-semibold text-slate-900">
                  Destinatário
                </h2>
              </div>

              <p className="font-semibold text-slate-800">
                {data.destinatario || 'Não informado'}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {formatCNPJ(data.cnpjDestinatario)}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">
              Resumo financeiro
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FinancialItem
                label="Produtos"
                value={formatCurrency(data.valorProdutos)}
              />

              <FinancialItem
                label="Frete"
                value={formatCurrency(data.valorFrete)}
              />

              <FinancialItem
                label="Desconto"
                value={formatCurrency(data.valorDesconto)}
              />

              <FinancialItem
                label="Total da NF-e"
                value={formatCurrency(data.valorTotal)}
                strong
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <FileCode2 size={20} className="mt-0.5 text-slate-400" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  Chave de acesso
                </p>

                <p className="mt-1 break-all font-mono text-sm text-slate-500">
                  {data.chave || 'Não identificada'}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

type InfoCardProps = {
  icon: typeof ReceiptText;
  label: string;
  value: string;
  highlight?: boolean;
};

function InfoCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
          highlight
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-blue-50 text-blue-700'
        }`}
      >
        <Icon size={18} />
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function FinancialItem({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>

      <p
        className={`mt-1 ${
          strong
            ? 'text-lg font-bold text-emerald-700'
            : 'font-semibold text-slate-800'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
