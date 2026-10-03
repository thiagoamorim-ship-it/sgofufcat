import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Banknote,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  FileSpreadsheet,
  Download,
  Filter,
  Landmark,
  PieChart,
  Loader2,
  RefreshCw,
  Search,
  TrendingUp,
  Upload,
  Users,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Empenho = {
  id: number;
  ne_ccor: string | null;
  favorecido_numero: string | null;
  favorecido_nome: string | null;
  natureza_despesa_codigo: string | null;
  natureza_despesa_nome: string | null;
  natureza_despesa_detalhada_codigo: string | null;
  natureza_despesa_detalhada_nome: string | null;
  ptres: string | null;
  fonte_recursos_detalhada_codigo: string | null;
  fonte_recursos_detalhada_nome: string | null;
  pi_codigo: string | null;
  pi_nome: string | null;
  numero_processo: string | null;
  descricao: string | null;
  empenhos_a_liquidar: number | string | null;
  empenhos_em_liquidacao: number | string | null;
  empenhos_liquidados_a_pagar: number | string | null;
  empenhos_pagos: number | string | null;
};

type Rap = {
  id: number;
  ne_ccor: string | null;
  favorecido: string | null;
  natureza_despesa: string | null;
  natureza_despesa_detalhada: string | null;
  ptres: string | null;
  fonte_recursos_detalhada: string | null;
  pi: string | null;
  numero_processo: string | null;
  descricao: string | null;
  saldo: number | string | null;
};

type Credito = {
  id: number;
  ptres: string | null;
  fonte_recursos_detalhada_codigo: string | null;
  natureza_despesa_codigo: string | null;
  pi_codigo: string | null;
  saldo_contabil: number | string | null;
};

type Carga = {
  id: string;
  tipo_base: string;
  nome_arquivo: string;
  data_referencia: string | null;
  data_importacao: string;
  origem: string;
  status: string;
  quantidade_registros: number | null;
};

function numero(
  valor: number | string | null | undefined,
) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return 0;
  }

  if (typeof valor === "number") {
    return valor;
  }

  const normalizado = String(valor)
    .replace(/\./g, "")
    .replace(",", ".");

  const resultado = Number(normalizado);

  return Number.isFinite(resultado)
    ? resultado
    : 0;
}

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor);
}

function dataHora(valor?: string | null) {
  if (!valor) {
    return "Nenhuma carga realizada";
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

function MetricCard({
  titulo,
  valor,
  subtitulo,
  icon: Icon,
  destaque = false,
}: {
  titulo: string;
  valor: number;
  subtitulo?: string;
  icon: React.ElementType;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        destaque
          ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {titulo}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {moeda(valor)}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${
            destaque
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon size={21} />
        </div>
      </div>

      {subtitulo && (
        <p className="text-xs leading-5 text-slate-500">
          {subtitulo}
        </p>
      )}
    </div>
  );
}

function PercentCard({
  titulo,
  valor,
  subtitulo,
}: {
  titulo: string;
  valor: number;
  subtitulo: string;
}) {
  const percentual = Math.max(0, Math.min(100, valor));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">{titulo}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {valor.toLocaleString("pt-BR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}%
          </p>
        </div>
        <div className="rounded-xl bg-white/10 p-3 text-blue-200">
          <TrendingUp size={21} />
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-400 transition-all"
          style={{ width: `${percentual}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">{subtitulo}</p>
    </div>
  );
}

function RankingBar({
  rotulo,
  valor,
  maximo,
  detalhe,
}: {
  rotulo: string;
  valor: number;
  maximo: number;
  detalhe?: string;
}) {
  const largura = maximo > 0 ? Math.max(2, (valor / maximo) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-700" title={rotulo}>
            {rotulo || "Não informado"}
          </p>
          {detalhe && (
            <p className="mt-0.5 truncate text-xs text-slate-400" title={detalhe}>
              {detalhe}
            </p>
          )}
        </div>
        <span className="shrink-0 text-sm font-semibold text-slate-900">
          {moeda(valor)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${largura}%` }}
        />
      </div>
    </div>
  );
}

export default function ExecucaoOrcamentaria() {
  const [empenhos, setEmpenhos] =
    useState<Empenho[]>([]);

  const [rap, setRap] =
    useState<Rap[]>([]);

  const [credito, setCredito] =
    useState<Credito[]>([]);

  const [ultimaCarga, setUltimaCarga] =
    useState<Carga | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [pesquisa, setPesquisa] =
    useState("");

  const [ptres, setPtres] =
    useState("");

  const [fonte, setFonte] =
    useState("");

  const [natureza, setNatureza] =
    useState("");

  const [situacao, setSituacao] =
    useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro(null);

    try {
      const tiposBase = [
        "empenhos",
        "rap",
        "credito_orcamentario",
      ];

      const { data: cargasData, error: cargasError } =
        await supabase
          .from("bi_cargas")
          .select("*")
          .eq("status", "concluido")
          .in("tipo_base", tiposBase)
          .order("data_importacao", {
            ascending: false,
          });

      if (cargasError) {
        throw cargasError;
      }

      const cargas =
        (cargasData || []) as Carga[];

      const cargaEmpenhos =
        cargas.find(
          (item) =>
            item.tipo_base === "empenhos",
        ) || null;

      const cargaRap =
        cargas.find(
          (item) => item.tipo_base === "rap",
        ) || null;

      const cargaCredito =
        cargas.find(
          (item) =>
            item.tipo_base ===
            "credito_orcamentario",
        ) || null;

      const cargaMaisRecente =
        cargas[0] || null;

      const [
        respostaEmpenhos,
        respostaRap,
        respostaCredito,
      ] = await Promise.all([
        cargaEmpenhos
          ? supabase
              .from("bi_empenhos")
              .select("*")
              .eq(
                "carga_id",
                cargaEmpenhos.id,
              )
          : Promise.resolve({
              data: [] as Empenho[],
              error: null,
            }),

        cargaRap
          ? supabase
              .from("bi_rap")
              .select("*")
              .eq("carga_id", cargaRap.id)
          : Promise.resolve({
              data: [] as Rap[],
              error: null,
            }),

        cargaCredito
          ? supabase
              .from(
                "bi_credito_orcamentario",
              )
              .select("*")
              .eq(
                "carga_id",
                cargaCredito.id,
              )
          : Promise.resolve({
              data: [] as Credito[],
              error: null,
            }),
      ]);

      if (respostaEmpenhos.error) {
        throw respostaEmpenhos.error;
      }

      if (respostaRap.error) {
        throw respostaRap.error;
      }

      if (respostaCredito.error) {
        throw respostaCredito.error;
      }

      setEmpenhos(
        (respostaEmpenhos.data ||
          []) as Empenho[],
      );

      setRap(
        (respostaRap.data || []) as Rap[],
      );

      setCredito(
        (respostaCredito.data ||
          []) as Credito[],
      );

      setUltimaCarga(cargaMaisRecente);
    } catch (error: any) {
      console.error(error);

      setErro(
        error?.message ||
          "Não foi possível carregar os dados da execução orçamentária.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  const ptresDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        empenhos
          .map((item) => item.ptres)
          .filter(
            (item): item is string =>
              Boolean(item),
          ),
      ),
    ).sort();
  }, [empenhos]);

  const fontesDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        empenhos
          .map(
            (item) =>
              item.fonte_recursos_detalhada_codigo,
          )
          .filter(
            (item): item is string =>
              Boolean(item),
          ),
      ),
    ).sort();
  }, [empenhos]);

  const naturezasDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        empenhos
          .map(
            (item) =>
              item.natureza_despesa_codigo,
          )
          .filter(
            (item): item is string =>
              Boolean(item),
          ),
      ),
    ).sort();
  }, [empenhos]);

  const empenhosBaseFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return empenhos.filter((item) => {
      if (ptres && item.ptres !== ptres) return false;

      if (
        fonte &&
        item.fonte_recursos_detalhada_codigo !== fonte
      ) {
        return false;
      }

      if (
        natureza &&
        item.natureza_despesa_codigo !== natureza
      ) {
        return false;
      }

      if (!termo) return true;

      const conteudo = [
        item.ne_ccor,
        item.favorecido_numero,
        item.favorecido_nome,
        item.numero_processo,
        item.descricao,
        item.natureza_despesa_codigo,
        item.natureza_despesa_nome,
        item.natureza_despesa_detalhada_codigo,
        item.natureza_despesa_detalhada_nome,
        item.ptres,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return conteudo.includes(termo);
    });
  }, [empenhos, pesquisa, ptres, fonte, natureza]);

  const empenhosFiltrados = useMemo(() => {
    return empenhosBaseFiltrados.filter((item) => {
      const valorALiquidar = numero(item.empenhos_a_liquidar);
      const valorEmLiquidacao = numero(item.empenhos_em_liquidacao);
      const valorLiquidadoPagar = numero(item.empenhos_liquidados_a_pagar);
      const valorPago = numero(item.empenhos_pagos);

      if (situacao === "empenhado_nao_liquidado") {
        return valorALiquidar > 0;
      }

      if (situacao === "em_liquidacao") {
        return valorEmLiquidacao > 0;
      }

      if (situacao === "liquidado_nao_pago") {
        return valorLiquidadoPagar > 0;
      }

      if (situacao === "pago") {
        return valorPago > 0;
      }

      return true;
    });
  }, [empenhosBaseFiltrados, situacao]);

  const creditoFiltrado = useMemo(() => {
    return credito.filter((item) => {
      if (
        ptres &&
        item.ptres !== ptres
      ) {
        return false;
      }

      if (
        fonte &&
        item.fonte_recursos_detalhada_codigo !==
          fonte
      ) {
        return false;
      }

      if (
        natureza &&
        item.natureza_despesa_codigo !==
          natureza
      ) {
        return false;
      }

      return true;
    });
  }, [
    credito,
    ptres,
    fonte,
    natureza,
  ]);

  const rapFiltrado = useMemo(() => {
    const termo =
      pesquisa.trim().toLowerCase();

    return rap.filter((item) => {
      if (
        ptres &&
        item.ptres !== ptres
      ) {
        return false;
      }

      if (
        fonte &&
        item.fonte_recursos_detalhada !==
          fonte
      ) {
        return false;
      }

      if (
        natureza &&
        item.natureza_despesa !==
          natureza
      ) {
        return false;
      }

      if (!termo) {
        return true;
      }

      return [
        item.ne_ccor,
        item.favorecido,
        item.numero_processo,
        item.descricao,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [
    rap,
    pesquisa,
    ptres,
    fonte,
    natureza,
  ]);

  const indicadores = useMemo(() => {
    const aLiquidar =
      empenhosBaseFiltrados.reduce(
        (total, item) =>
          total +
          numero(
            item.empenhos_a_liquidar,
          ),
        0,
      );

    const emLiquidacao =
      empenhosBaseFiltrados.reduce(
        (total, item) =>
          total +
          numero(
            item.empenhos_em_liquidacao,
          ),
        0,
      );

    const liquidadoPagar =
      empenhosBaseFiltrados.reduce(
        (total, item) =>
          total +
          numero(
            item.empenhos_liquidados_a_pagar,
          ),
        0,
      );

    const pago =
      empenhosBaseFiltrados.reduce(
        (total, item) =>
          total +
          numero(
            item.empenhos_pagos,
          ),
        0,
      );

    const empenhado =
      aLiquidar +
      emLiquidacao +
      liquidadoPagar +
      pago;

    const saldoCredito =
      creditoFiltrado.reduce(
        (total, item) =>
          total +
          numero(
            item.saldo_contabil,
          ),
        0,
      );

    const saldoRap =
      rapFiltrado.reduce(
        (total, item) =>
          total +
          numero(item.saldo),
        0,
      );

    return {
      saldoCredito,
      empenhado,
      aLiquidar,
      emLiquidacao,
      liquidadoPagar,
      pago,
      saldoRap,
    };
  }, [
    empenhosBaseFiltrados,
    creditoFiltrado,
    rapFiltrado,
  ]);

  const analises = useMemo(() => {
    const totalLiquidado =
      indicadores.emLiquidacao +
      indicadores.liquidadoPagar +
      indicadores.pago;

    const percentualPago =
      indicadores.empenhado > 0
        ? (indicadores.pago / indicadores.empenhado) * 100
        : 0;

    const percentualLiquidado =
      indicadores.empenhado > 0
        ? (totalLiquidado / indicadores.empenhado) * 100
        : 0;

    const totalCreditoMaisEmpenhado =
      indicadores.saldoCredito + indicadores.empenhado;

    const percentualComprometido =
      totalCreditoMaisEmpenhado > 0
        ? (indicadores.empenhado / totalCreditoMaisEmpenhado) * 100
        : 0;

    const totalEmpenho = (item: Empenho) =>
      numero(item.empenhos_a_liquidar) +
      numero(item.empenhos_em_liquidacao) +
      numero(item.empenhos_liquidados_a_pagar) +
      numero(item.empenhos_pagos);

    const agrupar = (
      chave: (item: Empenho) => string,
      detalhe?: (item: Empenho) => string,
    ) => {
      const mapa = new Map<
        string,
        { rotulo: string; valor: number; detalhe: string }
      >();

      empenhosFiltrados.forEach((item) => {
        const rotulo = chave(item) || "Não informado";
        const atual = mapa.get(rotulo) || {
          rotulo,
          valor: 0,
          detalhe: detalhe?.(item) || "",
        };
        atual.valor += totalEmpenho(item);
        if (!atual.detalhe && detalhe) atual.detalhe = detalhe(item);
        mapa.set(rotulo, atual);
      });

      return Array.from(mapa.values())
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);
    };

    const porNatureza = agrupar(
      (item) => item.natureza_despesa_codigo || "Não informado",
      (item) => item.natureza_despesa_nome || "",
    );

    const porPtres = agrupar((item) => item.ptres || "Não informado");

    const porFornecedor = agrupar(
      (item) => item.favorecido_nome || item.favorecido_numero || "Não informado",
      (item) => item.favorecido_numero || "",
    );

    const rapOrdenado = [...rapFiltrado]
      .map((item) => ({
        ...item,
        valor: numero(item.saldo),
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);

    return {
      totalLiquidado,
      percentualPago,
      percentualLiquidado,
      percentualComprometido,
      porNatureza,
      porPtres,
      porFornecedor,
      rapOrdenado,
    };
  }, [indicadores, empenhosFiltrados, rapFiltrado]);

  function limparFiltros() {
    setPesquisa("");
    setPtres("");
    setFonte("");
    setNatureza("");
    setSituacao("");
  }

  function linhasExportacao() {
    return empenhosFiltrados.map((item) => {
      const aLiquidar = numero(item.empenhos_a_liquidar);
      const emLiquidacao = numero(item.empenhos_em_liquidacao);
      const liquidadoPagar = numero(item.empenhos_liquidados_a_pagar);
      const pago = numero(item.empenhos_pagos);

      return {
        NE: item.ne_ccor || "",
        CNPJ_CPF: item.favorecido_numero || "",
        Favorecido: item.favorecido_nome || "",
        Processo: item.numero_processo || "",
        PTRES: item.ptres || "",
        Fonte: item.fonte_recursos_detalhada_codigo || "",
        Natureza: item.natureza_despesa_codigo || "",
        Natureza_Descricao: item.natureza_despesa_nome || "",
        Natureza_Detalhada: item.natureza_despesa_detalhada_codigo || "",
        PI: item.pi_codigo || "",
        Descricao: item.descricao || "",
        A_Liquidar: aLiquidar,
        Em_Liquidacao: emLiquidacao,
        Liquidado_a_Pagar: liquidadoPagar,
        Pago: pago,
        Total_Empenhado: aLiquidar + emLiquidacao + liquidadoPagar + pago,
      };
    });
  }

  function baixarArquivo(conteudo: BlobPart, tipo: string, nome: string) {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportarCSV() {
    const linhas = linhasExportacao();
    if (!linhas.length) return;

    const colunas = Object.keys(linhas[0]) as Array<keyof (typeof linhas)[number]>;
    const escapar = (valor: unknown) => `"${String(valor ?? "").replace(/"/g, '""')}"`;
    const csv = [
      colunas.join(";"),
      ...linhas.map((linha) => colunas.map((coluna) => escapar(linha[coluna])).join(";")),
    ].join("\n");

    baixarArquivo(
      `\uFEFF${csv}`,
      "text/csv;charset=utf-8;",
      `execucao-orcamentaria-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  }

  function exportarExcel() {
    const linhas = linhasExportacao();
    if (!linhas.length) return;

    const colunas = Object.keys(linhas[0]) as Array<keyof (typeof linhas)[number]>;
    const escaparHtml = (valor: unknown) => String(valor ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const cabecalho = colunas.map((coluna) => `<th>${escaparHtml(coluna)}</th>`).join("");
    const corpo = linhas.map((linha) =>
      `<tr>${colunas.map((coluna) => `<td>${escaparHtml(linha[coluna])}</td>`).join("")}</tr>`,
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr>${cabecalho}</tr></thead><tbody>${corpo}</tbody></table></body></html>`;

    baixarArquivo(
      `\uFEFF${html}`,
      "application/vnd.ms-excel;charset=utf-8;",
      `execucao-orcamentaria-${new Date().toISOString().slice(0, 10)}.xls`,
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

        {/* Cabeçalho */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <Landmark size={18} />
                  SGOF • HU-UFCAT
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Execução Orçamentária
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Acompanhamento gerencial da execução
                  orçamentária, empenhos, pagamentos,
                  crédito disponível e Restos a Pagar.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                {/* Última atualização */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Última atualização
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock3 size={15} />

                    {dataHora(
                      ultimaCarga?.data_importacao,
                    )}
                  </div>
                </div>

                {/* Importar dados */}
                <Link
                  to="/execucao-orcamentaria/importar"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Upload size={17} />
                  Importar dados
                </Link>

                {/* Atualizar */}
                <button
                  type="button"
                  onClick={() =>
                    void carregarDados()
                  }
                  disabled={carregando}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {carregando ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <RefreshCw size={17} />
                  )}

                  Atualizar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/70 px-6 py-4 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                <CheckCircle2
                  size={14}
                  className="text-emerald-600"
                />
                Fonte: Tesouro Gerencial
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {empenhos.length} registros de empenho
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {rap.length} registros de RAP
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {credito.length} registros de crédito
              </span>
            </div>
          </div>
        </section>

        {/* Erro */}
        {erro && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle
              className="mt-0.5 shrink-0"
              size={18}
            />

            <div>
              <p className="font-semibold">
                Não foi possível carregar o BI
              </p>

              <p className="mt-1">
                {erro}
              </p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-2">
              <Filter
                size={18}
                className="text-slate-500"
              />

              <h2 className="font-semibold text-slate-800">
                Filtros
              </h2>
            </div>

            <button
              type="button"
              onClick={limparFiltros}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={pesquisa}
                onChange={(event) =>
                  setPesquisa(
                    event.target.value,
                  )
                }
                placeholder="NE, fornecedor, processo..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={ptres}
              onChange={(event) =>
                setPtres(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Todos os PTRES
              </option>

              {ptresDisponiveis.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>

            <select
              value={fonte}
              onChange={(event) =>
                setFonte(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Todas as fontes
              </option>

              {fontesDisponiveis.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>

            <select
              value={natureza}
              onChange={(event) =>
                setNatureza(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Todas as naturezas
              </option>

              {naturezasDisponiveis.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>

            <select
              value={situacao}
              onChange={(event) => setSituacao(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todas as situações</option>
              <option value="empenhado_nao_liquidado">Empenhado e não liquidado</option>
              <option value="em_liquidacao">Em liquidação</option>
              <option value="liquidado_nao_pago">Liquidado e não pago</option>
              <option value="pago">Pago</option>
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              A exportação respeita todos os filtros aplicados e contém {empenhosFiltrados.length} registro(s). Os cards superiores mantêm a posição consolidada dos demais filtros; a situação atua na consulta, rankings e exportação.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportarCSV}
                disabled={!empenhosFiltrados.length}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} />
                Exportar CSV
              </button>

              <button
                type="button"
                onClick={exportarExcel}
                disabled={!empenhosFiltrados.length}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileSpreadsheet size={16} />
                Exportar Excel
              </button>
            </div>
          </div>
        </section>

        {/* Indicadores */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            titulo="Crédito / Saldo"
            valor={
              indicadores.saldoCredito
            }
            subtitulo="Saldo contábil conforme posição importada."
            icon={Landmark}
            destaque
          />

          <MetricCard
            titulo="Empenhado"
            valor={
              indicadores.empenhado
            }
            subtitulo="Total dos estágios da execução dos empenhos."
            icon={FileText}
            destaque
          />

          <MetricCard
            titulo="A Liquidar"
            valor={
              indicadores.aLiquidar
            }
            subtitulo="Empenhos ainda não liquidados."
            icon={WalletCards}
          />

          <MetricCard
            titulo="Em Liquidação"
            valor={
              indicadores.emLiquidacao
            }
            subtitulo="Valores atualmente em processo de liquidação."
            icon={Clock3}
          />

          <MetricCard
            titulo="Liquidado a Pagar"
            valor={
              indicadores.liquidadoPagar
            }
            subtitulo="Obrigações liquidadas ainda pendentes de pagamento."
            icon={Banknote}
          />

          <MetricCard
            titulo="Pago"
            valor={
              indicadores.pago
            }
            subtitulo="Valores pagos dos empenhos carregados."
            icon={CheckCircle2}
          />

          <MetricCard
            titulo="Restos a Pagar"
            valor={
              indicadores.saldoRap
            }
            subtitulo="Saldo de RAP conforme a base importada."
            icon={RefreshCw}
          />
        </section>

        {/* Visão executiva */}
        <section className="mb-6 grid gap-4 lg:grid-cols-3">
          <PercentCard
            titulo="Pago / Empenhado"
            valor={analises.percentualPago}
            subtitulo="Percentual do valor empenhado que já alcançou o estágio de pagamento."
          />
          <PercentCard
            titulo="Liquidado / Empenhado"
            valor={analises.percentualLiquidado}
            subtitulo="Considera valores em liquidação, liquidados a pagar e pagos."
          />
          <PercentCard
            titulo="Crédito comprometido"
            valor={analises.percentualComprometido}
            subtitulo="Relação entre o empenhado e o total formado por empenhado + saldo de crédito."
          />
        </section>

        {/* Fluxo da execução */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={19} className="text-blue-600" />
                <h2 className="font-semibold text-slate-900">Fluxo da Execução</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Composição dos valores da execução dos empenhos filtrados.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              Empenhado {moeda(indicadores.empenhado)}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { titulo: "A Liquidar", valor: indicadores.aLiquidar },
              { titulo: "Em Liquidação", valor: indicadores.emLiquidacao },
              { titulo: "Liquidado a Pagar", valor: indicadores.liquidadoPagar },
              { titulo: "Pago", valor: indicadores.pago },
            ].map((item) => {
              const participacao = indicadores.empenhado > 0
                ? (item.valor / indicadores.empenhado) * 100
                : 0;

              return (
                <div key={item.titulo} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.titulo}
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{moeda(item.valor)}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.min(100, Math.max(0, participacao))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {participacao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do empenhado
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rankings gerenciais */}
        <section className="mb-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <PieChart size={18} className="text-blue-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Por Natureza da Despesa</h2>
                <p className="text-xs text-slate-500">5 maiores naturezas por valor empenhado</p>
              </div>
            </div>
            <div className="space-y-5">
              {analises.porNatureza.length ? analises.porNatureza.map((item) => (
                <RankingBar
                  key={item.rotulo}
                  rotulo={item.rotulo}
                  detalhe={item.detalhe}
                  valor={item.valor}
                  maximo={analises.porNatureza[0]?.valor || 0}
                />
              )) : <p className="text-sm text-slate-400">Sem dados para os filtros selecionados.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Landmark size={18} className="text-blue-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Por PTRES</h2>
                <p className="text-xs text-slate-500">5 maiores PTRES por valor empenhado</p>
              </div>
            </div>
            <div className="space-y-5">
              {analises.porPtres.length ? analises.porPtres.map((item) => (
                <RankingBar
                  key={item.rotulo}
                  rotulo={item.rotulo}
                  valor={item.valor}
                  maximo={analises.porPtres[0]?.valor || 0}
                />
              )) : <p className="text-sm text-slate-400">Sem dados para os filtros selecionados.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Maiores Fornecedores</h2>
                <p className="text-xs text-slate-500">5 maiores favorecidos por valor empenhado</p>
              </div>
            </div>
            <div className="space-y-5">
              {analises.porFornecedor.length ? analises.porFornecedor.map((item) => (
                <RankingBar
                  key={item.rotulo}
                  rotulo={item.rotulo}
                  detalhe={item.detalhe}
                  valor={item.valor}
                  maximo={analises.porFornecedor[0]?.valor || 0}
                />
              )) : <p className="text-sm text-slate-400">Sem dados para os filtros selecionados.</p>}
            </div>
          </div>
        </section>

        {/* Restos a Pagar */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-900">Restos a Pagar</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Maiores saldos da posição de RAP importada do Tesouro Gerencial.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900 px-4 py-2.5 text-right text-white">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Saldo RAP</p>
              <p className="text-lg font-bold">{moeda(indicadores.saldoRap)}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {analises.rapOrdenado.length ? analises.rapOrdenado.map((item) => (
              <div key={item.id} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[160px_1fr_180px] md:items-center">
                <div>
                  <p className="text-xs font-medium text-slate-400">NE / CCOR</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{item.ne_ccor || "—"}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">{item.favorecido || "Favorecido não informado"}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    PTRES {item.ptres || "—"} • Natureza {item.natureza_despesa || "—"}
                  </p>
                </div>
                <p className="text-left text-base font-bold text-slate-900 md:text-right">{moeda(item.valor)}</p>
              </div>
            )) : (
              <div className="px-5 py-10 text-center text-sm text-slate-400">Sem RAP para os filtros selecionados.</div>
            )}
          </div>
        </section>

        {/* Detalhamento */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="font-semibold text-slate-900">
                Detalhamento dos Empenhos
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {empenhosFiltrados.length}{" "}
                registro(s) encontrado(s)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">
                <tr>
                  {[
                    "NE",
                    "Favorecido",
                    "PTRES",
                    "Natureza",
                    "A Liquidar",
                    "Em Liquidação",
                    "Liquidado a Pagar",
                    "Pago",
                    "Total",
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">

                {carregando ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-16 text-center"
                    >
                      <Loader2
                        size={24}
                        className="mx-auto animate-spin text-blue-600"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Carregando execução
                        orçamentária...
                      </p>
                    </td>
                  </tr>
                ) : empenhosFiltrados.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-16 text-center"
                    >
                      <FileText
                        size={30}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-600">
                        Nenhum empenho
                        encontrado
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Quando realizarmos a
                        primeira importação, os
                        registros aparecerão aqui.
                      </p>
                    </td>
                  </tr>
                ) : (
                  empenhosFiltrados
                    .slice(0, 100)
                    .map((item) => {
                      const aLiquidar =
                        numero(
                          item.empenhos_a_liquidar,
                        );

                      const emLiquidacao =
                        numero(
                          item.empenhos_em_liquidacao,
                        );

                      const liquidadoPagar =
                        numero(
                          item.empenhos_liquidados_a_pagar,
                        );

                      const pago =
                        numero(
                          item.empenhos_pagos,
                        );

                      const total =
                        aLiquidar +
                        emLiquidacao +
                        liquidadoPagar +
                        pago;

                      return (
                        <tr
                          key={item.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-800">
                            {item.ne_ccor ||
                              "—"}
                          </td>

                          <td className="max-w-[300px] px-4 py-3">
                            <p className="truncate text-sm font-medium text-slate-700">
                              {item.favorecido_nome ||
                                "—"}
                            </p>

                            {item.favorecido_numero && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  item.favorecido_numero
                                }
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                            {item.ptres ||
                              "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                            {item.natureza_despesa_codigo ||
                              "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(
                              aLiquidar,
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(
                              emLiquidacao,
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(
                              liquidadoPagar,
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(pago)}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-900">
                            {moeda(total)}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>

          {empenhosFiltrados.length >
            100 && (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">
              Exibindo os primeiros 100
              registros de{" "}
              {empenhosFiltrados.length}.
              Posteriormente adicionaremos
              paginação e detalhamento
              individual.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
