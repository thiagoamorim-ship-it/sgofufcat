import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react';

const SIRT_URL =
  'https://sirt-web.hatchable.site/login';

type Retencao = {
  codigo: string;
  total: number;
  ir: number;
  csll: number;
  cofins: number;
  pis: number;
  naturezas: string[];
  termos: string[];
  alerta?: string;
};

const retencoes: Retencao[] = [
  {
    codigo: '6147',
    total: 5.85,
    ir: 1.2,
    csll: 1,
    cofins: 3,
    pis: 0.65,
    naturezas: [
      'Alimentação.',
      'Energia elétrica.',
      'Serviços prestados com emprego de materiais.',
      'Construção civil por empreitada com emprego de materiais.',
      'Serviços hospitalares de que trata o art. 30.',
      'Serviços de auxílio diagnóstico e terapia, patologia clínica, imagenologia, anatomia patológica e citopatologia, medicina nuclear e análises e patologias clínicas de que trata o art. 31.',
      'Transporte de cargas, exceto os relacionados no código 8767.',
      'Produtos farmacêuticos, de perfumaria, de toucador ou de higiene pessoal, exceto os relacionados no código 8767.',
      'Mercadorias e bens em geral.',
    ],
    termos: [
      'alimentacao',
      'energia',
      'material',
      'materiais',
      'construcao',
      'hospitalar',
      'hospital',
      'diagnostico',
      'terapia',
      'patologia',
      'imagenologia',
      'medicina nuclear',
      'transporte de carga',
      'farmaceutico',
      'medicamento',
      'medicamentos',
      'perfumaria',
      'higiene',
      'mercadoria',
      'mercadorias',
      'bens',
      'produto',
    ],
    alerta:
      'Algumas operações, especialmente produtos farmacêuticos e transporte de cargas, podem possuir enquadramento específico no código 8767.',
  },

  {
    codigo: '9060',
    total: 4.89,
    ir: 0.24,
    csll: 1,
    cofins: 3,
    pis: 0.65,
    naturezas: [
      'Combustíveis e derivados nas situações específicas previstas no Anexo I.',
      'Álcool etílico hidratado adquirido diretamente de produtor, importador ou distribuidor, conforme art. 20.',
      'Biodiesel adquirido de produtor ou importador, conforme art. 21.',
    ],
    termos: [
      'gasolina',
      'diesel',
      'oleo diesel',
      'glp',
      'combustivel',
      'petroleo',
      'gas natural',
      'querosene',
      'qav',
      'alcool',
      'etanol',
      'biodiesel',
    ],
    alerta:
      'O enquadramento de combustíveis depende também da posição do fornecedor na cadeia comercial. Confira as condições específicas do Anexo I.',
  },

  {
    codigo: '8739',
    total: 1.24,
    ir: 0.24,
    csll: 1,
    cofins: 0,
    pis: 0,
    naturezas: [
      'Gasolina, óleo diesel, GLP e demais produtos indicados no Anexo I quando adquiridos de distribuidores ou comerciantes varejistas nas condições previstas.',
      'Álcool etílico hidratado nacional adquirido de comerciante varejista.',
      'Biodiesel adquirido de distribuidores e comerciantes varejistas.',
      'Biodiesel adquirido de produtor nas condições especiais previstas no Anexo I.',
    ],
    termos: [
      'gasolina',
      'diesel',
      'glp',
      'combustivel',
      'alcool',
      'etanol',
      'biodiesel',
      'varejista',
      'distribuidor',
    ],
    alerta:
      'Não selecione apenas pelo produto. A condição do fornecedor é relevante para distinguir este código do 9060.',
  },

  {
    codigo: '8767',
    total: 2.2,
    ir: 1.2,
    csll: 1,
    cofins: 0,
    pis: 0,
    naturezas: [
      'Transporte internacional de cargas efetuado por empresas nacionais.',
      'Estaleiros navais brasileiros nas atividades previstas no Anexo I.',
      'Produtos farmacêuticos, de perfumaria, de toucador e de higiene pessoal nas condições específicas do art. 22.',
      'Produtos abrangidos pelas demais hipóteses expressamente relacionadas no Anexo I.',
      'Outros produtos ou serviços beneficiados com isenção, não incidência ou alíquota zero da Cofins e do PIS/Pasep, observadas as condições da IN.',
    ],
    termos: [
      'transporte internacional',
      'carga internacional',
      'estaleiro',
      'farmaceutico',
      'medicamento',
      'medicamentos',
      'perfumaria',
      'higiene',
      'aliquota zero',
      'isencao',
      'nao incidencia',
      'pis zero',
      'cofins zero',
      'monofasico',
      'distribuidor',
      'varejista',
    ],
    alerta:
      'A alíquota de 2,20% não deve ser aplicada apenas porque o item é medicamento ou produto farmacêutico. É necessário confirmar a hipótese legal que afasta PIS/Pasep e Cofins.',
  },

  {
    codigo: '6175',
    total: 7.05,
    ir: 2.4,
    csll: 1,
    cofins: 3,
    pis: 0.65,
    naturezas: [
      'Passagens aéreas, rodoviárias e demais serviços de transporte de passageiros, inclusive tarifa de embarque, exceto as relacionadas no código 8850.',
    ],
    termos: [
      'passagem',
      'passagens',
      'passagem aerea',
      'rodoviaria',
      'passageiro',
      'transporte de passageiros',
      'tarifa de embarque',
    ],
    alerta:
      'Transporte internacional de passageiros efetuado por empresa nacional possui tratamento específico no código 8850.',
  },

  {
    codigo: '8850',
    total: 3.4,
    ir: 2.4,
    csll: 1,
    cofins: 0,
    pis: 0,
    naturezas: [
      'Transporte internacional de passageiros efetuado por empresas nacionais.',
    ],
    termos: [
      'passagem internacional',
      'transporte internacional',
      'passageiro internacional',
      'passageiros internacionais',
    ],
  },

  {
    codigo: '8863',
    total: 4.65,
    ir: 0,
    csll: 1,
    cofins: 3,
    pis: 0.65,
    naturezas: [
      'Serviços prestados por associações profissionais ou assemelhadas e cooperativas.',
    ],
    termos: [
      'associacao',
      'associacoes',
      'associacao profissional',
      'cooperativa',
      'cooperativas',
    ],
  },

  {
    codigo: '6188',
    total: 7.05,
    ir: 2.4,
    csll: 1,
    cofins: 3,
    pis: 0.65,
    naturezas: [
      'Serviços prestados pelas instituições financeiras relacionadas no Anexo I.',
      'Empresas de seguros privados e de capitalização.',
      'Entidades abertas de previdência complementar.',
      'Seguro saúde.',
    ],
    termos: [
      'banco',
      'bancario',
      'financeira',
      'financiamento',
      'credito',
      'cambio',
      'arrendamento mercantil',
      'seguro',
      'seguro saude',
      'capitalizacao',
      'previdencia complementar',
    ],
  },

  {
    codigo: '6190',
    total: 9.45,
    ir: 4.8,
    csll: 1,
    cofins: 3,
    pis: 0.65,
    naturezas: [
      'Serviços de abastecimento de água.',
      'Telefone.',
      'Correio e telégrafos.',
      'Vigilância.',
      'Limpeza.',
      'Locação de mão de obra.',
      'Intermediação de negócios.',
      'Administração, locação ou cessão de bens imóveis, móveis e direitos de qualquer natureza.',
      'Factoring.',
      'Plano de saúde humano, veterinário ou odontológico nas condições previstas no Anexo I.',
      'Demais serviços.',
    ],
    termos: [
      'agua',
      'telefone',
      'telefonia',
      'correio',
      'vigilancia',
      'seguranca',
      'limpeza',
      'mao de obra',
      'locacao',
      'cessao',
      'intermediacao',
      'factoring',
      'plano de saude',
      'servico',
      'servicos',
      'manutencao',
      'consultoria',
      'assessoria',
    ],
  },
];

function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function formatarPercentual(valor: number) {
  return `${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export default function TabelaRetencoes() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState('');
  const [expandido, setExpandido] =
    useState<string | null>(null);

  const [simples, setSimples] = useState<
    'sim' | 'nao' | 'nao-sei' | null
  >(null);

  const [beneficio, setBeneficio] = useState<
    'sim' | 'nao' | 'nao-sei' | null
  >(null);

  const resultados = useMemo(() => {
    const termo = normalizar(pesquisa);

    if (!termo) return retencoes;

    return retencoes.filter((item) => {
      const texto = normalizar(
        [
          item.codigo,
          formatarPercentual(item.total),
          ...item.naturezas,
          ...item.termos,
        ].join(' '),
      );

      return texto.includes(termo);
    });
  }, [pesquisa]);

  const existeAnalise =
    simples !== null || beneficio !== null;

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
          Assistente de Retenções
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Consulte os enquadramentos do Anexo I e
          verifique condições que podem alterar ou
          afastar a retenção.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Análise antes do código
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              O código da receita não deve ser definido
              somente pelo nome do produto ou serviço.
              Situação tributária do fornecedor e benefícios
              fiscais podem alterar o resultado.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CircleHelp
            size={20}
            className="text-blue-700"
          />

          <h2 className="font-bold text-slate-900">
            Análise guiada
          </h2>
        </div>

        <div className="mt-5 space-y-6">
          <Pergunta
            numero="1"
            titulo="O fornecedor é optante pelo Simples Nacional?"
            valor={simples}
            onChange={setSimples}
          />

          {simples === 'sim' && (
            <Aviso
              tipo="atencao"
              titulo="Hipótese de não retenção"
              texto="A condição de optante pelo Simples Nacional exige tratamento específico antes da aplicação da tabela. Não aplique automaticamente os percentuais do Anexo I."
            />
          )}

          {simples === 'nao-sei' && (
            <Aviso
              tipo="atencao"
              titulo="Confirme o regime tributário"
              texto="Antes de concluir a retenção, confirme a situação tributária do fornecedor."
            />
          )}

          <div className="border-t border-slate-100 pt-6">
            <Pergunta
              numero="2"
              titulo="A operação possui isenção, não incidência ou alíquota zero de PIS/Pasep ou Cofins?"
              valor={beneficio}
              onChange={setBeneficio}
            />
          </div>

          {beneficio === 'sim' && (
            <Aviso
              tipo="informacao"
              titulo="Atenção ao código 8767"
              texto="Existem hipóteses no Anexo I em que PIS/Pasep e Cofins são zero e permanecem IR e CSLL. É necessário confirmar o fundamento legal da operação antes de utilizar o código 8767."
            />
          )}

          {beneficio === 'nao-sei' && (
            <Aviso
              tipo="atencao"
              titulo="Enquadramento ainda não conclusivo"
              texto="Confira o documento fiscal e o fundamento tributário antes de concluir se PIS/Pasep e Cofins devem ser retidos."
            />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">
          Qual é o bem ou serviço?
        </label>

        <p className="mt-1 text-xs text-slate-400">
          Pesquise também pelo código da receita.
        </p>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={pesquisa}
              onChange={(event) =>
                setPesquisa(event.target.value)
              }
              placeholder="Ex.: medicamento, limpeza, passagem, 8767..."
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

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Medicamento',
            'Material',
            'Hospitalar',
            'Limpeza',
            'Vigilância',
            'Passagem',
            'Combustível',
            '8767',
            '6190',
          ].map((termo) => (
            <button
              key={termo}
              type="button"
              onClick={() => setPesquisa(termo)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {termo}
            </button>
          ))}
        </div>
      </section>

      {pesquisa && resultados.length > 1 && (
        <Aviso
          tipo="atencao"
          titulo={`${resultados.length} enquadramentos encontrados`}
          texto="A mesma palavra pode aparecer em situações tributárias diferentes. Confira as condições de cada código antes de concluir."
        />
      )}

      {simples === 'sim' && pesquisa && (
        <Aviso
          tipo="bloqueio"
          titulo="Não conclua pela tabela automaticamente"
          texto="Foi informado que o fornecedor é optante pelo Simples Nacional. Verifique primeiro a hipótese legal aplicável antes de utilizar um dos códigos abaixo."
        />
      )}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Enquadramentos possíveis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Anexo I — IN RFB nº 1.234/2012
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {resultados.length}{' '}
            {resultados.length === 1
              ? 'resultado'
              : 'resultados'}
          </span>
        </div>

        {resultados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <Search
              size={30}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 font-semibold text-slate-700">
              Nenhum enquadramento encontrado
            </h3>

            <button
              type="button"
              onClick={() => setPesquisa('')}
              className="mt-3 text-sm font-semibold text-blue-700"
            >
              Exibir tabela completa
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {resultados.map((item) => {
              const aberto =
                expandido === item.codigo;

              return (
                <article
                  key={item.codigo}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandido(
                        aberto ? null : item.codigo,
                      )
                    }
                    className="w-full p-5 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Calculator size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            Código {item.codigo}
                          </h3>

                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                            {formatarPercentual(
                              item.total,
                            )}
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {item.naturezas[0]}
                        </p>
                      </div>

                      {aberto ? (
                        <ChevronUp
                          size={20}
                          className="text-slate-400"
                        />
                      ) : (
                        <ChevronDown
                          size={20}
                          className="text-slate-400"
                        />
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      <Tributo
                        nome="IR"
                        valor={item.ir}
                      />

                      <Tributo
                        nome="CSLL"
                        valor={item.csll}
                      />

                      <Tributo
                        nome="COFINS"
                        valor={item.cofins}
                      />

                      <Tributo
                        nome="PIS/Pasep"
                        valor={item.pis}
                      />

                      <div className="rounded-xl bg-[#002B49] px-3 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-white">
                          {formatarPercentual(
                            item.total,
                          )}
                        </p>
                      </div>
                    </div>
                  </button>

                  {aberto && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                      <div className="flex items-center gap-2">
                        <FileText
                          size={17}
                          className="text-blue-700"
                        />

                        <h4 className="text-sm font-bold text-slate-800">
                          Hipóteses do Anexo I
                        </h4>
                      </div>

                      <div className="mt-4 space-y-3">
                        {item.naturezas.map(
                          (natureza) => (
                            <div
                              key={natureza}
                              className="flex items-start gap-2.5"
                            >
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-emerald-600"
                              />

                              <p className="text-sm leading-6 text-slate-600">
                                {natureza}
                              </p>
                            </div>
                          ),
                        )}
                      </div>

                      {item.alerta && (
                        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle
                              size={17}
                              className="mt-0.5 shrink-0 text-amber-700"
                            />

                            <p className="text-sm leading-6 text-amber-900">
                              {item.alerta}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Fundamento da tabela
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          Anexo I da IN RFB nº
                          1.234/2012, conforme tabela de
                          referência cadastrada no SGOF.
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {existeAnalise && (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Situação da análise
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            As respostas da análise guiada funcionam como
            alertas de enquadramento. Elas não substituem a
            verificação do documento fiscal e das condições
            legais específicas da operação.
          </p>
        </section>
      )}
    </div>
  );
}

function Pergunta({
  numero,
  titulo,
  valor,
  onChange,
}: {
  numero: string;
  titulo: string;
  valor: 'sim' | 'nao' | 'nao-sei' | null;
  onChange: (
    valor: 'sim' | 'nao' | 'nao-sei',
  ) => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
          {numero}
        </div>

        <p className="pt-1 text-sm font-semibold text-slate-800">
          {titulo}
        </p>
      </div>

      <div className="ml-10 mt-3 flex flex-wrap gap-2">
        <Opcao
          ativa={valor === 'sim'}
          onClick={() => onChange('sim')}
        >
          Sim
        </Opcao>

        <Opcao
          ativa={valor === 'nao'}
          onClick={() => onChange('nao')}
        >
          Não
        </Opcao>

        <Opcao
          ativa={valor === 'nao-sei'}
          onClick={() => onChange('nao-sei')}
        >
          Não sei
        </Opcao>
      </div>
    </div>
  );
}

function Opcao({
  ativa,
  onClick,
  children,
}: {
  ativa: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
        ativa
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
      }`}
    >
      {children}
    </button>
  );
}

function Tributo({
  nome,
  valor,
}: {
  nome: string;
  valor: number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {nome}
      </p>

      <p
        className={`mt-1 text-base font-bold ${
          valor === 0
            ? 'text-slate-400'
            : 'text-slate-800'
        }`}
      >
        {formatarPercentual(valor)}
      </p>
    </div>
  );
}

function Aviso({
  tipo,
  titulo,
  texto,
}: {
  tipo: 'atencao' | 'informacao' | 'bloqueio';
  titulo: string;
  texto: string;
}) {
  const classe =
    tipo === 'bloqueio'
      ? 'border-red-200 bg-red-50'
      : tipo === 'atencao'
        ? 'border-amber-200 bg-amber-50'
        : 'border-blue-200 bg-blue-50';

  const icone =
    tipo === 'bloqueio'
      ? 'text-red-700'
      : tipo === 'atencao'
        ? 'text-amber-700'
        : 'text-blue-700';

  return (
    <div
      className={`rounded-2xl border p-5 ${classe}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={20}
          className={`mt-0.5 shrink-0 ${icone}`}
        />

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {titulo}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
}
