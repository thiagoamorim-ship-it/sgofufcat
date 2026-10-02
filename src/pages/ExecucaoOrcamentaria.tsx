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
  Upload,
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
