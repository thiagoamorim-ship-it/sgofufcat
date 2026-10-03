import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';

import { supabase } from '../lib/supabase';

type TipoBase =
  | 'empenhos'
  | 'rap'
  | 'credito_orcamentario'
  | 'desconhecido';

type Linha = Record<string, unknown>;

type ResultadoLeitura = {
  tipo: TipoBase;
  colunas: string[];
  linhas: Linha[];
  linhaInicialDados: number;
};

function texto(valor: unknown) {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizar(valor: unknown) {
  return texto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function linhaContem(
  linha: unknown[],
  termo: string,
) {
  const procurado = normalizar(termo);

  return linha.some((celula) =>
    normalizar(celula).includes(procurado),
  );
}


function matrizComCelulasMescladas(
  worksheet: XLSX.WorkSheet,
): unknown[][] {
  const matriz = XLSX.utils.sheet_to_json<unknown[]>(
    worksheet,
    {
      header: 1,
      defval: '',
      raw: false,
    },
  );

  const mesclas = worksheet['!merges'] || [];

  mesclas.forEach((mescla) => {
    const valorOrigem =
      matriz[mescla.s.r]?.[mescla.s.c] ?? '';

    if (texto(valorOrigem) === '') {
      return;
    }

    for (
      let linha = mescla.s.r;
      linha <= mescla.e.r;
      linha += 1
    ) {
      if (!matriz[linha]) {
        matriz[linha] = [];
      }

      for (
        let coluna = mescla.s.c;
        coluna <= mescla.e.c;
        coluna += 1
      ) {
        if (texto(matriz[linha][coluna]) === '') {
          matriz[linha][coluna] = valorOrigem;
        }
      }
    }
  });
