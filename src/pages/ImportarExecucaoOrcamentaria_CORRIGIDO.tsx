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

  return matriz;
}

function detectarTipoPorMatriz(
  matriz: unknown[][],
): TipoBase {
  const primeirasLinhas = matriz.slice(0, 15);

  const conteudo = primeirasLinhas
    .flat()
    .map(normalizar)
    .join(' | ');

  /*
   * EMPENHOS
   */
  if (
    conteudo.includes('ne ccor') &&
    conteudo.includes('empenhos a liquidar') &&
    conteudo.includes('empenhos pagos')
  ) {
    return 'empenhos';
  }

  /*
   * CRÉDITO ORÇAMENTÁRIO
   */
  if (
    conteudo.includes('ug executora') &&
    conteudo.includes('acao governo') &&
    (
      conteudo.includes('nc - operacao') ||
      conteudo.includes('nc operacao')
    )
  ) {
    return 'credito_orcamentario';
  }

  /*
   * RAP
   */
  if (
    conteudo.includes('ne ccor') &&
    conteudo.includes('conta contabil') &&
    conteudo.includes('saldo')
  ) {
    return 'rap';
  }

  return 'desconhecido';
}

function nomeTipo(tipo: TipoBase) {
  switch (tipo) {
    case 'empenhos':
      return 'Empenhos';

    case 'rap':
      return 'Restos a Pagar (RAP)';

    case 'credito_orcamentario':
      return 'Crédito Orçamentário';

    default:
      return 'Não reconhecida';
  }
}

function processarMatriz(
  matrizOriginal: unknown[][],
): ResultadoLeitura {
  const matriz = matrizOriginal.map((linha) =>
    Array.isArray(linha) ? linha : [],
  );

  const tipo =
    detectarTipoPorMatriz(matriz);

  if (!matriz.length) {
    return {
      tipo: 'desconhecido',
      colunas: [],
      linhas: [],
      linhaInicialDados: 0,
    };
  }

  /*
   * =====================================================
   * EMPENHOS
   * =====================================================
   */
  if (tipo === 'empenhos') {
    let linhaCodigos = -1;
    let linhaNomes = -1;
    let linhaSaldo = -1;

    for (
      let indice = 0;
      indice < Math.min(matriz.length, 15);
      indice += 1
    ) {
      const linha = matriz[indice];

      if (
        linhaContem(linha, '622920101') ||
        linhaContem(
          linha,
          'empenhos a liquidar',
        )
      ) {
        if (
          linhaContem(linha, '622920101')
        ) {
          linhaCodigos = indice;
        }

        if (
          linhaContem(
            linha,
            'empenhos a liquidar',
          )
        ) {
          linhaNomes = indice;
        }
      }

      if (
        linhaContem(
          linha,
          'saldo - r$',
        )
      ) {
        linhaSaldo = indice;
      }
    }

    const linhaBase = matriz[0] || [];

    const maiorQuantidadeColunas =
      Math.max(
        linhaBase.length,
        ...matriz
          .slice(0, 10)
          .map((linha) => linha.length),
      );

    const colunas: string[] = [];

    for (
      let coluna = 0;
      coluna < maiorQuantidadeColunas;
      coluna += 1
    ) {
      const base =
        texto(linhaBase[coluna]);

      const codigo =
        linhaCodigos >= 0
          ? texto(
              matriz[linhaCodigos]?.[
                coluna
              ],
            )
          : '';

      const nome =
        linhaNomes >= 0
          ? texto(
              matriz[linhaNomes]?.[
                coluna
              ],
            )
          : '';

      let nomeFinal = base;

      if (
        codigo.includes('622920101') ||
        normalizar(nome).includes(
          'empenhos a liquidar',
        )
      ) {
        nomeFinal = 'Empenhos a Liquidar';
      } else if (
        codigo.includes('622920102') ||
        normalizar(nome).includes(
          'empenhos em liquidacao',
        )
      ) {
        nomeFinal = 'Empenhos em Liquidação';
      } else if (
        codigo.includes('622920103') ||
        normalizar(nome).includes(
          'empenhos liquidados a pagar',
        )
      ) {
        nomeFinal =
          'Empenhos Liquidados a Pagar';
      } else if (
        codigo.includes('622920104') ||
        normalizar(nome).includes(
          'empenhos pagos',
        )
      ) {
        nomeFinal = 'Empenhos Pagos';
      }

      if (!nomeFinal) {
        nomeFinal =
          nome ||
          codigo ||
          `Coluna ${coluna + 1}`;
      }

      let nomeUnico = nomeFinal;
      let contador = 2;

      while (
        colunas.includes(nomeUnico)
      ) {
        nomeUnico =
          `${nomeFinal} (${contador})`;

        contador += 1;
      }

      colunas.push(nomeUnico);
    }

    const ultimaLinhaCabecalho =
      Math.max(
        0,
        linhaCodigos,
        linhaNomes,
        linhaSaldo,
      );

    const linhaInicialDados =
      ultimaLinhaCabecalho + 1;

    const linhas: Linha[] = [];

    for (
      let indice = linhaInicialDados;
      indice < matriz.length;
      indice += 1
    ) {
      const linha = matriz[indice];

      if (
        !linha ||
        !linha.some(
          (celula) =>
            texto(celula) !== '',
        )
      ) {
        continue;
      }

      const registro: Linha = {};

      colunas.forEach(
        (coluna, indiceColuna) => {
          registro[coluna] =
            linha[indiceColuna] ?? '';
        },
      );

      const primeiraCelula = texto(linha[0])
        .replace(/\s/g, '')
        .toUpperCase();

      if (!/NE\d+/.test(primeiraCelula)) {
        continue;
      }

      linhas.push(registro);
    }

    return {
      tipo,
      colunas,
      linhas,
      linhaInicialDados,
    };
  }

  /*
   * =====================================================
   * RESTOS A PAGAR - RAP
   * =====================================================
   *
   * O RAP possui cabeçalho multinível.
   * Aqui tratamos a estrutura separadamente para impedir
   * que linhas de cabeçalho sejam interpretadas como dados.
   */
  if (tipo === 'rap') {
    const limiteCabecalho =
      Math.min(matriz.length, 15);

    let linhaPrincipal = -1;
    let linhaComplementar = -1;
    let melhorPontuacao = -1;

    /*
     * Localiza a principal linha do cabeçalho.
     */
    for (
      let indice = 0;
      indice < limiteCabecalho;
      indice += 1
    ) {
      const linha = matriz[indice] || [];

      const conteudoLinha = linha
        .map(normalizar)
        .join(' | ');

      let pontuacao = 0;

      if (
        conteudoLinha.includes('ne ccor')
      ) {
        pontuacao += 4;
      }

      if (
        conteudoLinha.includes('favorecido')
      ) {
        pontuacao += 2;
      }

      if (
        conteudoLinha.includes(
          'natureza despesa',
        )
      ) {
        pontuacao += 2;
      }

      if (
        conteudoLinha.includes('ptres')
      ) {
        pontuacao += 2;
      }

      if (
        conteudoLinha.includes(
          'fonte recursos',
        )
      ) {
        pontuacao += 2;
      }

      if (
        conteudoLinha.includes(
          'conta contabil',
        )
      ) {
        pontuacao += 2;
      }

      if (
        conteudoLinha.includes('saldo')
      ) {
        pontuacao += 2;
      }

      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        linhaPrincipal = indice;
      }
    }

    if (linhaPrincipal < 0) {
      return {
        tipo: 'desconhecido',
        colunas: [],
        linhas: [],
        linhaInicialDados: 0,
      };
    }

    /*
     * Procura uma segunda linha de cabeçalho.
     *
     * Normalmente ela possui termos como Código,
     * Número e Nome.
     */
    for (
      let indice = linhaPrincipal + 1;
      indice <
      Math.min(
        matriz.length,
        linhaPrincipal + 4,
      );
      indice += 1
    ) {
      const linha = matriz[indice] || [];

      const conteudoLinha = linha
        .map(normalizar)
        .join(' | ');

      const pareceCabecalho =
        conteudoLinha.includes('numero') ||
        conteudoLinha.includes('nome') ||
        conteudoLinha.includes('codigo') ||
        conteudoLinha.includes(
          'conta contabil',
        ) ||
        conteudoLinha.includes(
          'saldo - r$',
        );

      const pareceDado = linha.some(
        (celula) => {
          const valor = texto(celula)
            .replace(/\s/g, '')
            .toUpperCase();

          return /NE\d+/.test(valor);
        },
      );

      if (
        pareceCabecalho &&
        !pareceDado
      ) {
        linhaComplementar = indice;
      }
    }

    const principal =
      matriz[linhaPrincipal] || [];

    const complementar =
      linhaComplementar >= 0
        ? matriz[linhaComplementar] || []
        : [];

    const quantidadeColunas = Math.max(
      principal.length,
      complementar.length,
      ...matriz
        .slice(
          linhaPrincipal,
          Math.min(
            matriz.length,
            linhaPrincipal + 5,
          ),
        )
        .map((linha) => linha.length),
    );

    const colunas: string[] = [];

    /*
     * Em células mescladas, o Excel normalmente mantém
     * o título apenas na primeira coluna do grupo.
     * Por isso carregamos o último título principal.
     */
    let ultimoCabecalhoPrincipal = '';

    for (
      let indice = 0;
      indice < quantidadeColunas;
      indice += 1
    ) {
      const valorPrincipal =
        texto(principal[indice]);

      const valorComplementar =
        texto(complementar[indice]);

      if (valorPrincipal) {
        ultimoCabecalhoPrincipal =
          valorPrincipal;
      }

      let nomeFinal =
        valorPrincipal ||
        ultimoCabecalhoPrincipal;

      if (
        valorComplementar &&
        normalizar(valorComplementar) !==
          normalizar(nomeFinal)
      ) {
        nomeFinal = nomeFinal
          ? `${nomeFinal} - ${valorComplementar}`
          : valorComplementar;
      }

      const nomeNormalizado =
        normalizar(nomeFinal);

      /*
       * Favorecido
       */
      if (
        nomeNormalizado.includes(
          'ne ccor - favorecido',
        ) &&
        (
          nomeNormalizado.includes('numero') ||
          nomeNormalizado.includes('codigo')
        )
      ) {
        nomeFinal =
          'NE CCor - Favorecido Número';
      } else if (
        nomeNormalizado.includes(
          'ne ccor - favorecido',
        ) &&
        nomeNormalizado.includes('nome')
      ) {
        nomeFinal =
          'NE CCor - Favorecido Nome';
      }

      /*
       * Natureza da Despesa Detalhada
       */
      else if (
        nomeNormalizado.includes(
          'natureza despesa detalhada',
        ) &&
        (
          nomeNormalizado.includes('codigo') ||
          nomeNormalizado.includes('numero')
        )
      ) {
        nomeFinal =
          'Natureza Despesa Detalhada Código';
      } else if (
        nomeNormalizado.includes(
          'natureza despesa detalhada',
        ) &&
        nomeNormalizado.includes('nome')
      ) {
        nomeFinal =
          'Natureza Despesa Detalhada Nome';
      }

      /*
       * Natureza da Despesa
       */
      else if (
        nomeNormalizado.includes(
          'natureza despesa',
        ) &&
        (
          nomeNormalizado.includes('codigo') ||
          nomeNormalizado.includes('numero')
        )
      ) {
        nomeFinal =
          'Natureza Despesa Código';
      } else if (
        nomeNormalizado.includes(
          'natureza despesa',
        ) &&
        nomeNormalizado.includes('nome')
      ) {
        nomeFinal =
          'Natureza Despesa Nome';
      }

      /*
       * Fonte
       */
      else if (
        nomeNormalizado.includes(
          'fonte recursos detalhada',
        ) &&
        (
          nomeNormalizado.includes('codigo') ||
          nomeNormalizado.includes('numero')
        )
      ) {
        nomeFinal =
          'Fonte Recursos Detalhada Código';
      } else if (
        nomeNormalizado.includes(
          'fonte recursos detalhada',
        ) &&
        nomeNormalizado.includes('nome')
      ) {
        nomeFinal =
          'Fonte Recursos Detalhada Nome';
      }

      /*
       * PI
       */
      else if (
        (
          nomeNormalizado === 'pi' ||
          nomeNormalizado.startsWith('pi -')
        ) &&
        (
          nomeNormalizado.includes('codigo') ||
          nomeNormalizado.includes('numero')
        )
      ) {
        nomeFinal = 'PI Código';
      } else if (
        (
          nomeNormalizado === 'pi' ||
          nomeNormalizado.startsWith('pi -')
        ) &&
        nomeNormalizado.includes('nome')
      ) {
        nomeFinal = 'PI Nome';
      }

      /*
       * Campos sem título.
       */
      if (!nomeFinal) {
        nomeFinal =
          `Campo RAP ${indice + 1}`;
      }

      /*
       * Evita nomes duplicados.
       */
      let nomeUnico = nomeFinal;
      let contador = 2;

      while (
        colunas.includes(nomeUnico)
      ) {
        nomeUnico =
          `${nomeFinal} (${contador})`;

        contador += 1;
      }

      colunas.push(nomeUnico);
    }

    const ultimaLinhaCabecalho =
      Math.max(
        linhaPrincipal,
        linhaComplementar,
      );

    const linhaInicialDados =
      ultimaLinhaCabecalho + 1;

    const linhas: Linha[] = [];

    for (
      let indice = linhaInicialDados;
      indice < matriz.length;
      indice += 1
    ) {
      const linha = matriz[indice] || [];

      const possuiConteudo =
        linha.some(
          (celula) =>
            texto(celula) !== '',
        );

      if (!possuiConteudo) {
        continue;
      }

      /*
       * Uma linha de RAP válida deve possuir
       * identificação de Nota de Empenho.
       *
       * Isso impede que linhas residuais do cabeçalho
       * sejam contabilizadas como registros.
       */
      const primeiraColuna = texto(
        linha[0],
      )
        .replace(/\s/g, '')
        .toUpperCase();

      const possuiNE =
        /NE\d+/.test(primeiraColuna);

      if (!possuiNE) {
        continue;
      }

      const registro: Linha = {};

      colunas.forEach(
        (coluna, indiceColuna) => {
          registro[coluna] =
            linha[indiceColuna] ?? '';
        },
      );

      linhas.push(registro);
    }

    return {
      tipo,
      colunas,
      linhas,
      linhaInicialDados,
    };
  }

  /*
   * =====================================================
   * CRÉDITO ORÇAMENTÁRIO
   * =====================================================
   *
   * Mantemos o processamento que já foi validado para
   * Crédito Disponível - Gestão.
   */
  let melhorLinha = 0;
  let melhorPontuacao = -1;

  const termosConhecidos = [
    'ne ccor',
    'favorecido',
    'natureza despesa',
    'ptres',
    'fonte recursos',
    'pi',
    'conta contabil',
    'saldo',
    'ug executora',
    'acao governo',
    'nc - operacao',
    'evento',
    'plano orcamentario',
  ];

  for (
    let indice = 0;
    indice < Math.min(matriz.length, 15);
    indice += 1
  ) {
    const linhaNormalizada =
      matriz[indice]
        .map(normalizar)
        .join(' | ');

    const pontuacao =
      termosConhecidos.filter((termo) =>
        linhaNormalizada.includes(
          normalizar(termo),
        ),
      ).length;

    if (pontuacao > melhorPontuacao) {
      melhorPontuacao = pontuacao;
      melhorLinha = indice;
    }
  }

  const cabecalho =
    matriz[melhorLinha] || [];

  const colunas: string[] = [];

  cabecalho.forEach(
    (celula, indice) => {
      const base =
        texto(celula) ||
        `Coluna ${indice + 1}`;

      let nomeUnico = base;
      let contador = 2;

      while (
        colunas.includes(nomeUnico)
      ) {
        nomeUnico =
          `${base} (${contador})`;

        contador += 1;
      }

      colunas.push(nomeUnico);
    },
  );

  const linhaInicialDados =
    melhorLinha + 1;

  const linhas: Linha[] = [];

  for (
    let indice = linhaInicialDados;
    indice < matriz.length;
    indice += 1
  ) {
    const linha = matriz[indice];

    if (
      !linha ||
      !linha.some(
        (celula) =>
          texto(celula) !== '',
      )
    ) {
      continue;
    }

    const registro: Linha = {};

    colunas.forEach(
      (coluna, indiceColuna) => {
        registro[coluna] =
          linha[indiceColuna] ?? '';
      },
    );

    linhas.push(registro);
  }

  return {
    tipo,
    colunas,
    linhas,
    linhaInicialDados,
  };
}

export default function ImportarExecucaoOrcamentaria() {
  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [planilha, setPlanilha] =
    useState('');

  const [colunas, setColunas] =
    useState<string[]>([]);

  const [linhas, setLinhas] =
    useState<Linha[]>([]);

  const [tipo, setTipo] =
    useState<TipoBase>('desconhecido');

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  const [importando, setImportando] =
    useState(false);

  const [sucesso, setSucesso] =
    useState<string | null>(null);

  const previa = useMemo(
    () => linhas.slice(0, 5),
    [linhas],
  );

  async function processarArquivo(
    arquivoSelecionado: File,
  ) {
    setCarregando(true);
    setErro(null);
    setSucesso(null);

    try {
      const extensao =
        arquivoSelecionado.name
          .split('.')
          .pop()
          ?.toLowerCase();

      if (
        extensao !== 'xlsx' &&
        extensao !== 'xls'
      ) {
        throw new Error(
          'Selecione uma planilha Excel (.xlsx ou .xls).',
        );
      }

      const buffer =
        await arquivoSelecionado.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: true,
      });

      if (!workbook.SheetNames.length) {
        throw new Error(
          'O arquivo não possui planilhas.',
        );
      }

      let abaEncontrada = '';

      let resultadoEncontrado:
        | ResultadoLeitura
        | null = null;

      let primeiraAbaComDados:
        | {
            nome: string;
            resultado: ResultadoLeitura;
          }
        | null = null;

      for (
        const nomeAba of workbook.SheetNames
      ) {
        const worksheet =
          workbook.Sheets[nomeAba];

        if (!worksheet) {
          continue;
        }

        const matriz =
          XLSX.utils.sheet_to_json<
            unknown[]
          >(worksheet, {
            header: 1,
            defval: '',
            raw: false,
          });

        if (!matriz.length) {
          continue;
        }

        let resultado =
          processarMatriz(matriz);

        /*
         * RAP v2:
         * o Tesouro Gerencial utiliza células mescladas no
         * cabeçalho. Se a base for RAP, expandimos essas
         * mesclas somente em memória e processamos novamente.
         *
         * Empenhos e Crédito Orçamentário permanecem usando
         * exatamente a leitura anterior.
         */
        if (resultado.tipo === 'rap') {
          const matrizRap =
            matrizComCelulasMescladas(
              worksheet,
            );

          resultado =
            processarMatriz(matrizRap);
        }

        if (
          resultado.linhas.length &&
          !primeiraAbaComDados
        ) {
          primeiraAbaComDados = {
            nome: nomeAba,
            resultado,
          };
        }

        if (
          resultado.tipo !==
            'desconhecido' &&
          resultado.linhas.length
        ) {
          abaEncontrada = nomeAba;
          resultadoEncontrado =
            resultado;

          break;
        }
      }

      if (
        !resultadoEncontrado &&
        primeiraAbaComDados
      ) {
        abaEncontrada =
          primeiraAbaComDados.nome;

        resultadoEncontrado =
          primeiraAbaComDados.resultado;
      }

      if (
        !resultadoEncontrado ||
        !resultadoEncontrado.linhas.length
      ) {
        throw new Error(
          'Não foram encontrados registros válidos na planilha.',
        );
      }

      setArquivo(
        arquivoSelecionado,
      );

      setPlanilha(
        abaEncontrada,
      );

      setLinhas(
        resultadoEncontrado.linhas,
      );

      setColunas(
        resultadoEncontrado.colunas,
      );

      setTipo(
        resultadoEncontrado.tipo,
      );
    } catch (error: any) {
      console.error(error);

      setArquivo(null);
      setPlanilha('');
      setLinhas([]);
      setColunas([]);
      setTipo('desconhecido');

      setErro(
        error?.message ||
          'Não foi possível ler a planilha.',
      );
    } finally {
      setCarregando(false);
    }
  }

  function limpar() {
    setArquivo(null);
    setPlanilha('');
    setColunas([]);
    setLinhas([]);
    setTipo('desconhecido');
    setErro(null);
    setSucesso(null);
  }

  async function confirmarImportacao() {
    if (
      !arquivo ||
      (tipo !== 'rap' && tipo !== 'empenhos') ||
      !linhas.length
    ) {
      return;
    }

    setImportando(true);
    setErro(null);
    setSucesso(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          'Sua sessão expirou. Entre novamente no SGOF.',
        );
      }

      const response = await fetch('/api/bi-importar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tipo,
          nomeArquivo: arquivo.name,
          linhas,
        }),
      });

      const respostaTexto = await response.text();

      let data: {
        error?: string;
        quantidade?: number;
        message?: string;
      } = {};

      if (respostaTexto) {
        try {
          data = JSON.parse(respostaTexto);
        } catch {
          if (!response.ok) {
            throw new Error(
              respostaTexto.slice(0, 500) ||
                'A API retornou uma resposta inválida.',
            );
          }

          throw new Error(
            'A API retornou uma resposta inesperada.',
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            respostaTexto ||
            'Não foi possível concluir a importação.',
        );
      }

      const quantidade = Number(
        data?.quantidade ?? linhas.length,
      );

      const nomeBase =
        tipo === 'rap' ? 'RAP' : 'Empenhos';

      setSucesso(
        `${quantidade.toLocaleString('pt-BR')} registro(s) de ${nomeBase} importado(s) com sucesso.`,
      );
    } catch (error: any) {
      console.error('Erro ao confirmar importação:', error);

      setErro(
        error?.message ||
          'Não foi possível concluir a importação.',
      );
    } finally {
      setImportando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              SGOF • HU-UFCAT
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Importar dados da Execução Orçamentária
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Importe os relatórios extraídos do
              Tesouro Gerencial. O SGOF identifica
              automaticamente o tipo da base antes
              de qualquer gravação.
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700">
            Etapa de validação
          </div>
        </div>
      </section>

      {/* Erro */}
      {erro && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Não foi possível processar o arquivo
            </p>

            <p className="mt-1">
              {erro}
            </p>
          </div>
        </div>
      )}

      {sucesso && (
        <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Importação concluída
            </p>

            <p className="mt-1">
              {sucesso}
            </p>
          </div>
        </div>
      )}

      {/* Seleção */}
      {!arquivo ? (
        <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-sm md:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Upload size={28} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Selecione uma planilha
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Utilize os arquivos Excel extraídos do
            Tesouro Gerencial para Empenhos, RAP ou
            Crédito Orçamentário.
          </p>

          <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002B49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003d66]">
            {carregando ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <FileSpreadsheet
                size={18}
              />
            )}

            {carregando
              ? 'Analisando...'
              : 'Selecionar arquivo'}

            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              disabled={carregando}
              onChange={(event) => {
                const selecionado =
                  event.target.files?.[0];

                if (selecionado) {
                  void processarArquivo(
                    selecionado,
                  );
                }

                event.currentTarget.value =
                  '';
              }}
            />
          </label>
        </section>
      ) : (
        <>
          {/* Resumo */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Arquivo
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                {arquivo.name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Aba analisada
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {planilha || '—'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Registros encontrados
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {linhas.length.toLocaleString(
                  'pt-BR',
                )}
              </p>
            </div>
          </section>

          {/* Resultado */}
          <section
            className={`rounded-2xl border p-5 ${
              tipo === 'desconhecido'
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {tipo === 'desconhecido' ? (
                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
              ) : (
                <CheckCircle2
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
              )}

              <div>
                <p
                  className={`font-bold ${
                    tipo ===
                    'desconhecido'
                      ? 'text-amber-900'
                      : 'text-emerald-900'
                  }`}
                >
                  {tipo ===
                  'desconhecido'
                    ? 'Estrutura ainda não reconhecida'
                    : 'Planilha reconhecida'}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    tipo ===
                    'desconhecido'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  Tipo detectado:{' '}
                  <strong>
                    {nomeTipo(tipo)}
                  </strong>

                  {tipo === 'rap' && (
                    <span className="ml-2 inline-flex rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      Parser RAP v2
                    </span>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Prévia */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">
                  Pré-visualização
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Primeiros 5 registros •{' '}
                  {colunas.length}{' '}
                  coluna(s) identificada(s)
                </p>
              </div>

              <button
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={16} />
                Remover arquivo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-max divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {colunas.map(
                      (coluna) => (
                        <th
                          key={coluna}
                          className="max-w-[260px] whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {coluna}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {previa.map(
                    (linha, indice) => (
                      <tr key={indice}>
                        {colunas.map(
                          (coluna) => (
                            <td
                              key={coluna}
                              className="max-w-[260px] truncate whitespace-nowrap px-4 py-3 text-xs text-slate-600"
                              title={texto(
                                linha[coluna],
                              )}
                            >
                              {texto(
                                linha[coluna],
                              ) || '—'}
                            </td>
                          ),
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Confirmação */}
          <div className="flex flex-col items-end gap-2">
            {tipo !== 'rap' && tipo !== 'empenhos' && (
              <p className="text-xs text-amber-600">
                A gravação no banco está habilitada para RAP e Empenhos.
              </p>
            )}

            <button
              type="button"
              onClick={() => void confirmarImportacao()}
              disabled={
                importando ||
                (tipo !== 'rap' && tipo !== 'empenhos') ||
                !linhas.length
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#002B49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003d66] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {importando && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {importando
                ? 'Importando...'
                : 'Confirmar importação'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
