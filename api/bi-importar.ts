import { createClient } from '@supabase/supabase-js';

type Linha = Record<string, unknown>;

type CorpoRequisicao = {
  tipo?: string;
  nomeArquivo?: string;
  linhas?: Linha[];
};

function responder(
  res: any,
  status: number,
  dados: Record<string, unknown>,
) {
  return res.status(status).json(dados);
}

function texto(valor: unknown) {
  return String(valor ?? '').trim();
}

function normalizar(valor: unknown) {
  return texto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function numero(valor: unknown) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return 0;
  }

  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  let valorTexto = texto(valor)
    .replace(/\s/g, '')
    .replace(/R\$/gi, '');

  if (!valorTexto) {
    return 0;
  }

  if (
    valorTexto.includes(',') &&
    valorTexto.includes('.')
  ) {
    valorTexto = valorTexto
      .replace(/\./g, '')
      .replace(',', '.');
  } else if (valorTexto.includes(',')) {
    valorTexto = valorTexto.replace(',', '.');
  }

  const convertido = Number(valorTexto);

  return Number.isFinite(convertido)
    ? convertido
    : 0;
}

function obterCampo(
  linha: Linha,
  alternativas: string[],
) {
  const entradas = Object.entries(linha);

  /*
   * Primeiro procura correspondência exata.
   */
  for (const alternativa of alternativas) {
    const procurado = normalizar(alternativa);

    const encontrada = entradas.find(
      ([chave]) =>
        normalizar(chave) === procurado,
    );

    if (encontrada) {
      return encontrada[1];
    }
  }

  /*
   * Depois aceita cabeçalhos semelhantes,
   * inclusive os gerados pelo parser com (2).
   */
  for (const alternativa of alternativas) {
    const procurado = normalizar(alternativa);

    const encontrada = entradas.find(
      ([chave]) =>
        normalizar(chave).startsWith(
          procurado,
        ),
    );

    if (encontrada) {
      return encontrada[1];
    }
  }

  return '';
}

/*
 * =====================================================
 * RAP
 * =====================================================
 */

function mapearRap(linha: Linha) {
  const ne = obterCampo(linha, [
    'NE CCor',
    'NE CCOR',
  ]);

  const favorecidoNumero = obterCampo(
    linha,
    [
      'NE CCor - Favorecido Número',
      'NE CCor - Favorecido Numero',
      'NE CCor - Favorecido Código',
      'NE CCor - Favorecido Codigo',
      'NE CCor - Favorecido',
    ],
  );

  const favorecidoNome = obterCampo(
    linha,
    [
      'NE CCor - Favorecido Nome',
      'NE CCor - Favorecido (2)',
    ],
  );

  const naturezaCodigo = obterCampo(
    linha,
    [
      'Natureza Despesa Código',
      'Natureza Despesa Codigo',
      'Natureza Despesa',
    ],
  );

  const naturezaNome = obterCampo(
    linha,
    [
      'Natureza Despesa Nome',
      'Natureza Despesa (2)',
    ],
  );

  const naturezaDetalhadaCodigo =
    obterCampo(linha, [
      'Natureza Despesa Detalhada Código',
      'Natureza Despesa Detalhada Codigo',
      'Natureza Despesa Detalhada',
    ]);

  const naturezaDetalhadaNome =
    obterCampo(linha, [
      'Natureza Despesa Detalhada Nome',
      'Natureza Despesa Detalhada (2)',
    ]);

  const favorecido = [
    texto(favorecidoNumero),
    texto(favorecidoNome),
  ]
    .filter(Boolean)
    .join(' - ');

  const naturezaDespesa = [
    texto(naturezaCodigo),
    texto(naturezaNome),
  ]
    .filter(Boolean)
    .join(' - ');

  const naturezaDespesaDetalhada = [
    texto(naturezaDetalhadaCodigo),
    texto(naturezaDetalhadaNome),
  ]
    .filter(Boolean)
    .join(' - ');

  return {
    ne_ccor: texto(ne),

    favorecido,

    natureza_despesa:
      naturezaDespesa,

    natureza_despesa_detalhada:
      naturezaDespesaDetalhada,

    ptres: texto(
      obterCampo(linha, ['PTRES']),
    ),

    fonte_recursos_detalhada: texto(
      obterCampo(linha, [
        'Fonte Recursos Detalhada',
        'Fonte Recursos Detalhada Código',
        'Fonte Recursos Detalhada Codigo',
      ]),
    ),

    pi: texto(
      obterCampo(linha, [
        'PI',
        'PI Código',
        'PI Codigo',
      ]),
    ),

    local_entrega: texto(
      obterCampo(linha, [
        'NE CCor - Local Entrega',
        'Local Entrega',
      ]),
    ),

    numero_processo: texto(
      obterCampo(linha, [
        'NE CCor - Núm. Processo',
        'NE CCor - Num. Processo',
        'NE CCor - Número Processo',
        'Numero Processo',
      ]),
    ),

    mes_emissao: texto(
      obterCampo(linha, [
        'NE CCor - Mês Emissão',
        'NE CCor - Mes Emissao',
        'Mês Emissão',
        'Mes Emissao',
      ]),
    ),

    descricao: texto(
      obterCampo(linha, [
        'NE CCor - Descrição',
        'NE CCor - Descricao',
        'Descrição',
        'Descricao',
      ]),
    ),

    conta_contabil_numero: texto(
      obterCampo(linha, [
        'Conta Contábil Número',
        'Conta Contabil Numero',
      ]),
    ),

    conta_contabil_nome: texto(
      obterCampo(linha, [
        'Conta Contábil Nome',
        'Conta Contabil Nome',
      ]),
    ),

    saldo: numero(
      obterCampo(linha, [
        'Saldo - R$ (Conta Contábil)',
        'Saldo - R$ (Conta Contabil)',
        'Saldo',
      ]),
    ),
  };
}

/*
 * =====================================================
 * EMPENHOS
 * =====================================================
 */

function mapearEmpenho(linha: Linha) {
  return {
    ne_ccor: texto(
      obterCampo(linha, [
        'Empenho HU-UFCAT',
        'NE CCor',
        'NE CCOR',
      ]),
    ),

    favorecido_numero: texto(
      obterCampo(linha, [
        'NE CCor - Favorecido Número',
        'NE CCor - Favorecido Numero',
      ]),
    ),

    favorecido_nome: texto(
      obterCampo(linha, [
        'NE CCor - Favorecido Nome',
      ]),
    ),

    natureza_despesa_codigo: texto(
      obterCampo(linha, [
        'Natureza Despesa Código',
        'Natureza Despesa Codigo',
      ]),
    ),

    natureza_despesa_nome: texto(
      obterCampo(linha, [
        'Natureza Despesa Nome',
      ]),
    ),

    natureza_despesa_detalhada_codigo:
      texto(
        obterCampo(linha, [
          'Natureza Despesa Detalhada Código',
          'Natureza Despesa Detalhada Codigo',
        ]),
      ),

    natureza_despesa_detalhada_nome:
      texto(
        obterCampo(linha, [
          'Natureza Despesa Detalhada Nome',
        ]),
      ),

    ptres: texto(
      obterCampo(linha, ['PTRES']),
    ),

    fonte_recursos_detalhada_codigo:
      texto(
        obterCampo(linha, [
          'Fonte Recursos Detalhada Código',
          'Fonte Recursos Detalhada Codigo',
        ]),
      ),

    fonte_recursos_detalhada_nome:
      texto(
        obterCampo(linha, [
          'Fonte Recursos Detalhada Nome',
        ]),
      ),

    pi_codigo: texto(
      obterCampo(linha, [
        'PI Código',
        'PI Codigo',
      ]),
    ),

    pi_nome: texto(
      obterCampo(linha, ['PI Nome']),
    ),

    local_entrega: texto(
      obterCampo(linha, [
        'NE CCor - Local Entrega',
        'Local Entrega',
      ]),
    ),

    numero_processo: texto(
      obterCampo(linha, [
        'NE CCor - Núm. Processo',
        'NE CCor - Num. Processo',
        'NE CCor - Número Processo',
        'Numero Processo',
      ]),
    ),

    mes_emissao: texto(
      obterCampo(linha, [
        'NE CCor - Mês Emissão',
        'NE CCor - Mes Emissao',
        'Mês Emissão',
        'Mes Emissao',
      ]),
    ),

    descricao: texto(
      obterCampo(linha, [
        'NE CCor - Descrição',
        'NE CCor - Descricao',
        'Descrição',
        'Descricao',
      ]),
    ),

    conta_contabil_numero: texto(
      obterCampo(linha, [
        'Conta Contábil Número',
        'Conta Contabil Numero',
      ]),
    ),

    conta_contabil_nome: texto(
      obterCampo(linha, [
        'Conta Contábil Nome',
        'Conta Contabil Nome',
      ]),
    ),

    empenhos_a_liquidar: numero(
      obterCampo(linha, [
        'Empenhos a Liquidar',
      ]),
    ),

    empenhos_em_liquidacao: numero(
      obterCampo(linha, [
        'Empenhos em Liquidação',
        'Empenhos em Liquidacao',
      ]),
    ),

    empenhos_liquidados_a_pagar:
      numero(
        obterCampo(linha, [
          'Empenhos Liquidados a Pagar',
        ]),
      ),

    empenhos_pagos: numero(
      obterCampo(linha, [
        'Empenhos Pagos',
      ]),
    ),
  };
}

/*
 * =====================================================
 * AUTENTICAÇÃO
 * =====================================================
 */

async function autenticar(
  req: any,
  supabase: any,
) {
  const authorization =
    req.headers?.authorization ??
    req.headers?.Authorization;

  if (
    !authorization ||
    typeof authorization !== 'string' ||
    !authorization.startsWith('Bearer ')
  ) {
    throw new Error('NAO_AUTENTICADO');
  }

  const token = authorization
    .replace(/^Bearer\s+/i, '')
    .trim();

  if (!token) {
    throw new Error('NAO_AUTENTICADO');
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('NAO_AUTENTICADO');
  }

  const {
    data: perfil,
    error: perfilError,
  } = await supabase
    .from('profiles')
    .select('id, perfil, ativo')
    .eq('id', user.id)
    .maybeSingle();

  if (
    perfilError ||
    !perfil ||
    perfil.ativo !== true
  ) {
    throw new Error('ACESSO_NEGADO');
  }

  if (
    perfil.perfil !== 'administrador' &&
    perfil.perfil !== 'admin'
  ) {
    throw new Error('ACESSO_NEGADO');
  }

  return user;
}

/*
 * =====================================================
 * API
 * =====================================================
 */

export default async function handler(
  req: any,
  res: any,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return responder(res, 405, {
      error: 'Método não permitido.',
    });
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Variáveis do Supabase ausentes no servidor.',
    );

    return responder(res, 500, {
      error:
        'Configuração do servidor incompleta.',
    });
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  try {
    const usuario =
      await autenticar(req, supabase);

    const corpo =
      (req.body ?? {}) as CorpoRequisicao;

    const tipo =
      texto(corpo.tipo);

    const nomeArquivo =
      texto(corpo.nomeArquivo);

    const linhas =
      Array.isArray(corpo.linhas)
        ? corpo.linhas
        : [];

    /*
     * Por enquanto:
     * RAP + EMPENHOS.
     */
    if (
      tipo !== 'rap' &&
      tipo !== 'empenhos'
    ) {
      return responder(res, 400, {
        error:
          'Nesta etapa, a gravação está habilitada para RAP e Empenhos.',
      });
    }

    if (!nomeArquivo) {
      return responder(res, 400, {
        error:
          'O nome do arquivo não foi informado.',
      });
    }

    if (!linhas.length) {
      return responder(res, 400, {
        error:
          'Nenhum registro foi recebido para importação.',
      });
    }

    if (linhas.length > 10000) {
      return responder(res, 400, {
        error:
          'A quantidade de registros excede o limite permitido.',
      });
    }

    /*
     * Mapeamento de acordo com a base.
     */
    const registros =
      tipo === 'rap'
        ? linhas
            .map(mapearRap)
            .filter(
              (registro) =>
                registro.ne_ccor &&
                /NE\d+/i.test(
                  registro.ne_ccor.replace(
                    /\s/g,
                    '',
                  ),
                ),
            )
        : linhas
            .map(mapearEmpenho)
            .filter(
              (registro) =>
                registro.ne_ccor &&
                /NE\d+/i.test(
                  registro.ne_ccor.replace(
                    /\s/g,
                    '',
                  ),
                ),
            );

    if (!registros.length) {
      return responder(res, 400, {
        error:
          tipo === 'rap'
            ? 'Nenhum registro válido de RAP foi identificado.'
            : 'Nenhum registro válido de Empenhos foi identificado.',
      });
    }

    const tabelaDestino =
      tipo === 'rap'
        ? 'bi_rap'
        : 'bi_empenhos';

    /*
     * Cria o registro da carga.
     */
    const {
      data: carga,
      error: cargaError,
    } = await supabase
      .from('bi_cargas')
      .insert({
        tipo_base: tipo,
        nome_arquivo: nomeArquivo,
        origem: 'manual',
        status: 'processando',
        quantidade_registros: 0,
        usuario_id: usuario.id,
      })
      .select('id')
      .single();

    if (
      cargaError ||
      !carga?.id
    ) {
      console.error(
        'Erro ao criar carga:',
        cargaError,
      );

      return responder(res, 500, {
        error:
          'Não foi possível iniciar a importação.',
      });
    }

    const cargaId = carga.id;

    try {
      /*
       * Inserção em lotes.
       */
      const tamanhoLote = 500;

      for (
        let inicio = 0;
        inicio < registros.length;
        inicio += tamanhoLote
      ) {
        const lote = registros
          .slice(
            inicio,
            inicio + tamanhoLote,
          )
          .map((registro) => ({
            ...registro,
            carga_id: cargaId,
          }));

        const {
          error: insertError,
        } = await supabase
          .from(tabelaDestino)
          .insert(lote);

        if (insertError) {
          throw insertError;
        }
      }

      /*
       * Marca a carga como concluída.
       */
      const {
        error: finalizarError,
      } = await supabase
        .from('bi_cargas')
        .update({
          status: 'concluido',
          quantidade_registros:
            registros.length,
          mensagem_erro: null,
        })
        .eq('id', cargaId);

      if (finalizarError) {
        throw finalizarError;
      }

      return responder(res, 200, {
        success: true,
        cargaId,
        tipo,
        quantidade:
          registros.length,
        message:
          tipo === 'rap'
            ? 'Importação de RAP concluída com sucesso.'
            : 'Importação de Empenhos concluída com sucesso.',
      });
    } catch (importError: any) {
      console.error(
        'Erro durante a importação:',
        importError,
      );

      /*
       * Remove qualquer dado parcial.
       */
      await supabase
        .from(tabelaDestino)
        .delete()
        .eq('carga_id', cargaId);

      /*
       * Mantém a carga para auditoria,
       * porém marcada como erro.
       */
      await supabase
        .from('bi_cargas')
        .update({
          status: 'erro',
          quantidade_registros: 0,
          mensagem_erro:
            importError?.message ||
            'Erro durante a importação.',
        })
        .eq('id', cargaId);

      return responder(res, 500, {
        error:
          'A importação não foi concluída. Nenhum registro parcial foi mantido.',
      });
    }
  } catch (error: any) {
    if (
      error?.message ===
      'NAO_AUTENTICADO'
    ) {
      return responder(res, 401, {
        error:
          'Sua sessão expirou. Entre novamente no SGOF.',
      });
    }

    if (
      error?.message ===
      'ACESSO_NEGADO'
    ) {
      return responder(res, 403, {
        error:
          'Seu usuário não possui permissão para importar dados.',
      });
    }

    console.error(
      'Erro inesperado em bi-importar:',
      error,
    );

    return responder(res, 500, {
      error:
        'O servidor não conseguiu processar a importação.',
    });
  }
}
