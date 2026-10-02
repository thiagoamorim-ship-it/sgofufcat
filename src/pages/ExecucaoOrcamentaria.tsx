import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Landmark,
  Loader2,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";

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

function numero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined || valor === "") return 0;

  if (typeof valor === "number") return valor;

  const normalizado = String(valor)
    .replace(/\./g, "")
    .replace(",", ".");

  const resultado = Number(normalizado);

  return Number.isFinite(resultado) ? resultado : 0;
}

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor);
}

function dataHora(valor?: string | null) {
  if (!valor) return "Nenhuma carga realizada";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return valor;

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
          <p className="text-sm font-medium text-slate-500">{titulo}</p>

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
        <p className="text-xs leading-5 text-slate-500">{subtitulo}</p>
      )}
    </div>
  );
}

export default function ExecucaoOrcamentaria() {
  const [empenhos, setEmpenhos] = useState<Empenho[]>([]);
  const [rap, setRap] = useState<Rap[]>([]);
  const [credito, setCredito] = useState<Credito[]>([]);
  const [ultimaCarga, setUltimaCarga] = useState<Carga | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [pesquisa, setPesquisa] = useState("");
  const [ptres, setPtres] = useState("");
  const [fonte, setFonte] = useState("");
  const [natureza, setNatureza] = useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro(null);

    try {
      const [
        respostaEmpenhos,
        respostaRap,
        respostaCredito,
        respostaCarga,
      ] = await Promise.all([
        supabase.from("bi_empenhos").select("*"),
        supabase.from("bi_rap").select("*"),
        supabase.from("bi_credito_orcamentario").select("*"),
        supabase
          .from("bi_cargas")
          .select("*")
          .eq("status", "concluido")
          .order("data_importacao", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (respostaEmpenhos.error) throw respostaEmpenhos.error;
      if (respostaRap.error) throw respostaRap.error;
      if (respostaCredito.error) throw respostaCredito.error;
      if (respostaCarga.error) throw respostaCarga.error;

      setEmpenhos((respostaEmpenhos.data || []) as Empenho[]);
      setRap((respostaRap.data || []) as Rap[]);
      setCredito((respostaCredito.data || []) as Credito[]);
      setUltimaCarga((respostaCarga.data || null) as Carga | null);
    } catch (error: any) {
      console.error(error);

      setErro(
        error?.message ||
          "Não foi possível carregar os dados da execução orçamentária."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const ptresDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        empenhos
          .map((item) => item.ptres)
          .filter((item): item is string => Boolean(item))
      )
    ).sort();
  }, [empenhos]);

  const fontesDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        empenhos
          .map((item) => item.fonte_recursos_detalhada_codigo)
          .filter((item): item is string => Boolean(item))
      )
    ).sort();
  }, [empenhos]);

  const naturezasDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        empenhos
          .map((item) => item.natureza_despesa_codigo)
          .filter((item): item is string => Boolean(item))
      )
    ).sort();
  }, [empenhos]);

  const empenhosFiltrados = useMemo(() => {
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

  const creditoFiltrado = useMemo(() => {
    return credito.filter((item) => {
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

      return true;
    });
  }, [credito, ptres, fonte, natureza]);

  const rapFiltrado = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return rap.filter((item) => {
      if (ptres && item.ptres !== ptres) return false;

      if (
        fonte &&
        item.fonte_recursos_detalhada !== fonte
      ) {
        return false;
      }

      if (
        natureza &&
        item.natureza_despesa !== natureza
      ) {
        return false;
      }

      if (!termo) return true;

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
  }, [rap, pesquisa, ptres, fonte, natureza]);

  const indicadores = useMemo(() => {
    const aLiquidar = empenhosFiltrados.reduce(
      (total, item) => total + numero(item.empenhos_a_liquidar),
      0
    );

    const emLiquidacao = empenhosFiltrados.reduce(
      (total, item) => total + numero(item.empenhos_em_liquidacao),
      0
    );

    const liquidadoPagar = empenhosFiltrados.reduce(
      (total, item) =>
        total + numero(item.empenhos_liquidados_a_pagar),
      0
    );

    const pago = empenhosFiltrados.reduce(
      (total, item) => total + numero(item.empenhos_pagos),
      0
    );

    const empenhado =
      aLiquidar + emLiquidacao + liquidadoPagar + pago;

    const saldoCredito = creditoFiltrado.reduce(
      (total, item) => total + numero(item.saldo_contabil),
      0
    );

    const saldoRap = rapFiltrado.reduce(
      (total, item) => total + numero(item.saldo),
      0
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
  }, [empenhosFiltrados, creditoFiltrado, rapFiltrado]);

  function limparFiltros() {
    setPesquisa("");
    setPtres("");
    setFonte("");
    setNatureza("");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
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
                  Acompanhamento gerencial da execução orçamentária,
                  empenhos, pagamentos, crédito disponível e Restos a
                  Pagar.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Última atualização
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock3 size={15} />
                    {dataHora(ultimaCarga?.data_importacao)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={carregarDados}
                  disabled={carregando}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {carregando ? (
                    <Loader2 size={17} className="animate-spin" />
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
                <CheckCircle2 size={14} className="text-emerald-600" />
                Fonte: Tesouro Gerencial
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {empenhos.length} registros de empenho
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {rap.length} registros de RAP
              </span>
            </div>
          </div>
        </section>

        {erro && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold">
                Não foi possível carregar o BI
              </p>
              <p className="mt-1">{erro}</p>
            </div>
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-500" />
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

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={pesquisa}
                onChange={(event) => setPesquisa(event.target.value)}
                placeholder="NE, fornecedor, processo..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={ptres}
              onChange={(event) => setPtres(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todos os PTRES</option>

              {ptresDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={fonte}
              onChange={(event) => setFonte(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todas as fontes</option>

              {fontesDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={natureza}
              onChange={(event) => setNatureza(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todas as naturezas</option>

              {naturezasDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            titulo="Crédito / Saldo"
            valor={indicadores.saldoCredito}
            subtitulo="Saldo contábil conforme posição importada."
            icon={Landmark}
            destaque
          />

          <MetricCard
            titulo="Empenhado"
            valor={indicadores.empenhado}
            subtitulo="Total dos estágios da execução dos empenhos."
            icon={FileText}
            destaque
          />

          <MetricCard
            titulo="A Liquidar"
            valor={indicadores.aLiquidar}
            subtitulo="Empenhos ainda não liquidados."
            icon={WalletCards}
          />

          <MetricCard
            titulo="Em Liquidação"
            valor={indicadores.emLiquidacao}
            subtitulo="Valores atualmente em processo de liquidação."
            icon={Clock3}
          />

          <MetricCard
            titulo="Liquidado a Pagar"
            valor={indicadores.liquidadoPagar}
            subtitulo="Obrigações liquidadas ainda pendentes de pagamento."
            icon={Banknote}
          />

          <MetricCard
            titulo="Pago"
            valor={indicadores.pago}
            subtitulo="Valores pagos dos empenhos carregados."
            icon={CheckCircle2}
          />

          <MetricCard
            titulo="Restos a Pagar"
            valor={indicadores.saldoRap}
            subtitulo="Saldo de RAP conforme a base importada."
            icon={RefreshCw}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Detalhamento dos Empenhos
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {empenhosFiltrados.length} registro(s) encontrado(s)
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
                        Carregando execução orçamentária...
                      </p>
                    </td>
                  </tr>
                ) : empenhosFiltrados.length === 0 ? (
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
                        Nenhum empenho encontrado
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Quando realizarmos a primeira importação,
                        os registros aparecerão aqui.
                      </p>
                    </td>
                  </tr>
                ) : (
                  empenhosFiltrados.slice(0, 100).map((item) => {
                    const aLiquidar = numero(
                      item.empenhos_a_liquidar
                    );
                    const emLiquidacao = numero(
                      item.empenhos_em_liquidacao
                    );
                    const liquidadoPagar = numero(
                      item.empenhos_liquidados_a_pagar
                    );
                    const pago = numero(item.empenhos_pagos);

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
                          {item.ne_ccor || "—"}
                        </td>

                        <td className="max-w-[300px] px-4 py-3">
                          <p className="truncate text-sm font-medium text-slate-700">
                            {item.favorecido_nome || "—"}
                          </p>

                          {item.favorecido_numero && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.favorecido_numero}
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                          {item.ptres || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                          {item.natureza_despesa_codigo || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                          {moeda(aLiquidar)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                          {moeda(emLiquidacao)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                          {moeda(liquidadoPagar)}
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

          {empenhosFiltrados.length > 100 && (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">
              Exibindo os primeiros 100 registros de{" "}
              {empenhosFiltrados.length}. Posteriormente adicionaremos
              paginação e detalhamento individual.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
