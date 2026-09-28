import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  Landmark,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

const SIRT_URL =
  'https://sirt-web.hatchable.site/login';

const IN_1234_URL =
  'https://normas.receita.fazenda.gov.br/sijut2consulta/consulta.action?termoBusca=in%201234';

const IN_2110_URL =
  'https://normas.receita.fazenda.gov.br/sijut2consulta/consulta/link.action?idAto=126687';

type ItemRetencao = {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  destaque?: string;
  descricao: string;
  conferir: string[];
  fundamento: string;
  fonte?: string;
  termos: string[];
  icon: typeof BookOpen;
};

const itens: ItemRetencao[] = [
  {
    id: 'bens',
    titulo: 'Aquisição de bens',
    subtitulo: 'Fornecimento de materiais e produtos',
    categoria: 'Federal',
    descricao:
      'Os pagamentos efetuados pela Administração Pública Federal a pessoas jurídicas pelo fornecimento de bens estão abrangidos pelas regras de retenção da IN RFB nº 1.234/2012.',
    conferir: [
      'Natureza do bem adquirido.',
      'Enquadramento no Anexo I da IN RFB nº 1.234/2012.',
      'Situação tributária do fornecedor.',
      'Eventuais hipóteses de dispensa ou tratamento específico.',
      'Correspondência entre nota fiscal, empenho e objeto contratado.',
    ],
    fundamento:
      'IN RFB nº 1.234/2012, especialmente Anexo I.',
    fonte: IN_1234_URL,
    termos: [
      'aquisição',
      'bens',
      'material',
      'produto',
      'mercadoria',
      'hospitalar',
      'medicamento',
    ],
    icon: Building2,
  },
  {
    id: 'servicos',
    titulo: 'Prestação de serviços',
    subtitulo: 'Serviços contratados de pessoas jurídicas',
    categoria: 'Federal',
    descricao:
      'Os pagamentos por prestação de serviços também devem ser enquadrados conforme a natureza do serviço e as regras da IN RFB nº 1.234/2012.',
    conferir: [
      'Descrição efetiva do serviço prestado.',
      'Objeto do contrato e da nota fiscal.',
      'Enquadramento no Anexo I da IN RFB nº 1.234/2012.',
      'Possível incidência de retenção previdenciária.',
      'Possível incidência de ISS.',
    ],
    fundamento:
      'IN RFB nº 1.234/2012 e normas específicas conforme o serviço.',
    fonte: IN_1234_URL,
    termos: [
      'serviço',
      'serviços',
      'prestação',
      'contrato',
      'contratação',
    ],
    icon: Stethoscope,
  },
  {
    id: 'simples',
    titulo: 'Simples Nacional',
    subtitulo: 'Fornecedor optante pelo regime',
    categoria: 'Fornecedor',
    descricao:
      'A condição de optante pelo Simples Nacional deve ser identificada antes da retenção. O enquadramento exige atenção à natureza da receita e às regras específicas aplicáveis.',
    conferir: [
      'Confirmar se a empresa é optante pelo Simples Nacional.',
      'Verificar se a receita da operação está abrangida pelo regime.',
      'Conferir a documentação ou declaração exigível.',
      'Não presumir dispensa apenas pela informação constante da nota fiscal.',
      'Verificar separadamente INSS e ISS quando aplicáveis.',
    ],
    fundamento:
      'IN RFB nº 1.234/2012 e legislação do Simples Nacional.',
    fonte: IN_1234_URL,
    termos: [
      'simples',
      'simples nacional',
      'optante',
      'mei',
      'microempresa',
      'epp',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'ir',
    titulo: 'Imposto de Renda — IR',
    subtitulo: 'Retenção federal',
    categoria: 'Federal',
    descricao:
      'A alíquota do IR depende do enquadramento do bem ou serviço no Anexo I da IN RFB nº 1.234/2012. Não deve ser aplicada uma alíquota única a todos os pagamentos.',
    conferir: [
      'Identificar exatamente o bem ou serviço.',
      'Localizar o enquadramento correspondente no Anexo I.',
      'Conferir a alíquota de IR aplicável à operação.',
      'Verificar hipóteses de isenção, imunidade ou dispensa.',
      'Registrar o fundamento utilizado na análise.',
    ],
    fundamento:
      'IN RFB nº 1.234/2012, Anexo I.',
    fonte: IN_1234_URL,
    termos: [
      'ir',
      'irrf',
      'imposto de renda',
      'renda',
    ],
    icon: Landmark,
  },
  {
    id: 'contribuicoes',
    titulo: 'CSLL, Cofins e PIS/Pasep',
    subtitulo: 'Contribuições federais',
    categoria: 'Federal',
    descricao:
      'As contribuições devem ser verificadas conforme o enquadramento da operação e as hipóteses previstas na legislação de retenções aplicável à Administração Pública.',
    conferir: [
      'Natureza do pagamento.',
      'Enquadramento no Anexo I da IN RFB nº 1.234/2012.',
      'Condição tributária do fornecedor.',
      'Hipóteses específicas de não retenção.',
      'Compatibilidade entre objeto contratado e documento fiscal.',
    ],
    fundamento:
      'IN RFB nº 1.234/2012, especialmente Anexo I.',
    fonte: IN_1234_URL,
    termos: [
      'csll',
      'cofins',
      'pis',
      'pasep',
      'contribuições',
    ],
    icon: Calculator,
  },
  {
    id: 'inss',
    titulo: 'INSS',
    subtitulo: 'Retenção previdenciária',
    categoria: 'Previdenciária',
    destaque: '11% quando caracterizada a hipótese legal',
    descricao:
      'A retenção previdenciária não incide automaticamente sobre todo serviço. A regra geral do art. 110 da IN RFB nº 2.110/2022 prevê retenção de 11% quando o serviço estiver sujeito à retenção e for prestado nas condições previstas na norma.',
    conferir: [
      'Se existe cessão de mão de obra ou empreitada.',
      'Se o serviço está entre as hipóteses previstas nos arts. 111 e 112.',
      'Forma efetiva de execução do contrato.',
      'Hipóteses de dispensa da retenção.',
      'Base de cálculo e eventual fornecimento de materiais ou equipamentos.',
    ],
    fundamento:
      'IN RFB nº 2.110/2022, arts. 110 a 119.',
    fonte: IN_2110_URL,
    termos: [
      'inss',
      'previdência',
      'previdenciária',
      '11%',
      'mão de obra',
      'cessão',
      'empreitada',
      'limpeza',
      'vigilância',
      'construção',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'iss',
    titulo: 'ISS',
    subtitulo: 'Imposto Sobre Serviços',
    categoria: 'Municipal',
    descricao:
      'O ISS deve ser analisado separadamente das retenções federais, considerando a natureza do serviço, o local de incidência e a legislação municipal aplicável.',
    conferir: [
      'Município competente para cobrança do imposto.',
      'Local onde o serviço é considerado devido.',
      'Código e natureza do serviço.',
      'Responsabilidade tributária do tomador.',
      'Alíquota prevista na legislação municipal aplicável.',
    ],
    fundamento:
      'LC nº 116/2003 e legislação municipal aplicável.',
    termos: [
      'iss',
      'issqn',
      'municipal',
      'município',
      'catalão',
    ],
    icon: Landmark,
  },
];

export default function TabelaRetencoes() {
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = useState('');
  const [aberto, setAberto] = useState<string | null>(
    null,
  );

  const filtrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) return itens;

    return itens.filter((item) => {
      const conteudo = [
        item.titulo,
        item.subtitulo,
        item.categoria,
        item.descricao,
        item.fundamento,
        ...item.termos,
        ...item.conferir,
      ]
        .join(' ')
        .toLowerCase();

      return conteudo.includes(termo);
    });
  }, [pesquisa]);

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
          Gestão / Retenções / Tabela de bolso
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Tabela de bolso
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Referência rápida para apoiar a conferência das
          retenções tributárias nas rotinas do SGOF.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Apoio à conferência
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Esta página auxilia na identificação dos pontos
              que precisam ser conferidos. A definição da
              retenção aplicável depende do enquadramento da
              operação e da documentação do processo.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={pesquisa}
              onChange={(event) =>
                setPesquisa(event.target.value)
              }
              placeholder="Ex.: material hospitalar, Simples Nacional, INSS, limpeza..."
              className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <a
            href={SIRT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Analisar no SIRT
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Situações para consulta
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Clique em um item para visualizar os pontos de
              conferência.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {filtrados.length}{' '}
            {filtrados.length === 1
              ? 'resultado'
              : 'resultados'}
          </span>
        </div>

        <div className="space-y-3">
          {filtrados.map((item) => {
            const Icon = item.icon;
            const expandido = aberto === item.id;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setAberto(
                      expandido ? null : item.id,
                    )
                  }
                  className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {item.titulo}
                      </h3>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        {item.categoria}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.subtitulo}
                    </p>

                    {item.destaque && (
                      <p className="mt-2 text-xs font-semibold text-blue-700">
                        {item.destaque}
                      </p>
                    )}
                  </div>

                  <span className="mt-1 text-xl font-light text-slate-400">
                    {expandido ? '−' : '+'}
                  </span>
                </button>

                {expandido && (
                  <div className="border-t border-slate-100 px-5 pb-6 pt-5 md:px-20">
                    <p className="text-sm leading-6 text-slate-600">
                      {item.descricao}
                    </p>

                    <div className="mt-5">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        O que conferir
                      </h4>

                      <div className="mt-3 space-y-2.5">
                        {item.conferir.map(
                          (ponto) => (
                            <div
                              key={ponto}
                              className="flex items-start gap-2.5"
                            >
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-emerald-600"
                              />

                              <p className="text-sm leading-5 text-slate-600">
                                {ponto}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Fundamento
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {item.fundamento}
                      </p>

                      {item.fonte && (
                        <a
                          href={item.fonte}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
                        >
                          Consultar fonte oficial
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filtrados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <Search
              size={28}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-700">
              Nenhum resultado encontrado
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Tente pesquisar por outro tributo, serviço ou
              situação.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
        <div className="flex items-start gap-3">
          <BookOpen
            size={20}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Atenção
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              A tabela de bolso não substitui a análise do
              documento fiscal, do contrato, da legislação
              aplicável ou do SIRT. Em situações específicas,
              confirme o enquadramento antes da retenção e do
              pagamento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
