import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL;

const supabaseSecretKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    'Variáveis do Supabase não configuradas no servidor.',
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

type CriarUsuarioBody = {
  nome?: string;
  email?: string;
  perfil?: 'administrador' | 'usuario';
};

type ExcluirUsuarioBody = {
  userId?: string;
};

async function autenticarAdministrador(
  req: VercelRequest,
) {
  const authorization =
    req.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    return {
      error: 'Sessão não informada.',
      status: 401,
      user: null,
    };
  }

  const accessToken =
    authorization.replace('Bearer ', '').trim();

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(
    accessToken,
  );

  if (userError || !user) {
    return {
      error: 'Sessão inválida ou expirada.',
      status: 401,
      user: null,
    };
  }

  const {
    data: perfilSolicitante,
    error: perfilError,
  } = await supabaseAdmin
    .from('profiles')
    .select('id, perfil, ativo')
    .eq('id', user.id)
    .single();

  if (
    perfilError ||
    !perfilSolicitante ||
    perfilSolicitante.perfil !==
      'administrador' ||
    perfilSolicitante.ativo !== true
  ) {
    return {
      error:
        'Você não possui permissão para realizar esta operação.',
      status: 403,
      user: null,
    };
  }

  return {
    error: null,
    status: 200,
    user,
  };
}

async function criarUsuario(
  req: VercelRequest,
  res: VercelResponse,
) {
  const autenticacao =
    await autenticarAdministrador(req);

  if (
    autenticacao.error ||
    !autenticacao.user
  ) {
    return res
      .status(autenticacao.status)
      .json({
        error: autenticacao.error,
      });
  }

  const body =
    (req.body ?? {}) as CriarUsuarioBody;

  const nome = String(
    body.nome ?? '',
  ).trim();

  const email = String(
    body.email ?? '',
  )
    .trim()
    .toLowerCase();

  const perfil =
    body.perfil === 'administrador'
      ? 'administrador'
      : 'usuario';

  if (nome.length < 3) {
    return res.status(400).json({
      error:
        'Informe o nome completo do usuário.',
    });
  }

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    );

  if (!emailValido) {
    return res.status(400).json({
      error:
        'Informe um endereço de e-mail válido.',
    });
  }

  const {
    data: novoUsuario,
    error: createError,
  } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          nome,
        },
        redirectTo:
          `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/redefinir-senha`,
      },
    );

  if (createError) {
    const mensagem =
      createError.message?.toLowerCase() ?? '';

    if (
      mensagem.includes(
        'already been registered',
      ) ||
      mensagem.includes(
        'already registered',
      )
    ) {
      return res.status(409).json({
        error:
          'Já existe um usuário cadastrado com este e-mail.',
      });
    }

    console.error(
      'Erro ao criar usuário:',
      createError,
    );

    return res.status(400).json({
      error:
        'Não foi possível criar o usuário.',
    });
  }

  if (!novoUsuario.user) {
    return res.status(500).json({
      error:
        'O Supabase não retornou o usuário criado.',
    });
  }

  const {
    error: updateProfileError,
  } = await supabaseAdmin
    .from('profiles')
    .update({
      nome,
      email,
      perfil,
      ativo: true,
    })
    .eq('id', novoUsuario.user.id);

  if (updateProfileError) {
    console.error(
      'Erro ao atualizar perfil:',
      updateProfileError,
    );

    await supabaseAdmin.auth.admin.deleteUser(
      novoUsuario.user.id,
    );

    return res.status(500).json({
      error:
        'Não foi possível concluir o cadastro do usuário.',
    });
  }

  return res.status(201).json({
    status: 'ok',
    usuario: {
      id: novoUsuario.user.id,
      nome,
      email,
      perfil,
      ativo: true,
    },
  });
}

async function excluirUsuario(
  req: VercelRequest,
  res: VercelResponse,
) {
  const autenticacao =
    await autenticarAdministrador(req);

  if (
    autenticacao.error ||
    !autenticacao.user
  ) {
    return res
      .status(autenticacao.status)
      .json({
        error: autenticacao.error,
      });
  }

  const body =
    (req.body ?? {}) as ExcluirUsuarioBody;

  const userId = String(
    body.userId ?? '',
  ).trim();

  if (!userId) {
    return res.status(400).json({
      error:
        'Usuário não informado.',
    });
  }

  /*
   * O administrador não pode excluir
   * a própria conta.
   */
  if (
    userId === autenticacao.user.id
  ) {
    return res.status(400).json({
      error:
        'Você não pode excluir a sua própria conta.',
    });
  }

  /*
   * Localiza o perfil que será excluído.
   */
  const {
    data: perfilAlvo,
    error: perfilAlvoError,
  } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, nome, email, perfil, ativo',
    )
    .eq('id', userId)
    .single();

  if (
    perfilAlvoError ||
    !perfilAlvo
  ) {
    return res.status(404).json({
      error:
        'Usuário não encontrado.',
    });
  }

  /*
   * Se o usuário for administrador ativo,
   * verifica se existe outro administrador
   * ativo antes de permitir a exclusão.
   */
  if (
    perfilAlvo.perfil ===
      'administrador' &&
    perfilAlvo.ativo === true
  ) {
    const {
      count,
      error: countError,
    } = await supabaseAdmin
      .from('profiles')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq(
        'perfil',
        'administrador',
      )
      .eq('ativo', true);

    if (countError) {
      console.error(
        'Erro ao contar administradores:',
        countError,
      );

      return res.status(500).json({
        error:
          'Não foi possível validar os administradores do sistema.',
      });
    }

    if (
      (count ?? 0) <= 1
    ) {
      return res.status(400).json({
        error:
          'Não é possível excluir o último administrador ativo.',
      });
    }
  }

  /*
   * Exclui a conta do Supabase Auth.
   *
   * Como profiles.id possui:
   * references auth.users(id)
   * on delete cascade
   *
   * o registro correspondente em profiles
   * também será removido automaticamente.
   */
  const {
    error: deleteError,
  } =
    await supabaseAdmin.auth.admin.deleteUser(
      userId,
    );

  if (deleteError) {
    console.error(
      'Erro ao excluir usuário:',
      deleteError,
    );

    return res.status(500).json({
      error:
        'Não foi possível excluir o usuário.',
    });
  }

  return res.status(200).json({
    status: 'ok',
    message:
      'Usuário excluído com sucesso.',
    usuario: {
      id: perfilAlvo.id,
      nome: perfilAlvo.nome,
      email: perfilAlvo.email,
    },
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    if (req.method === 'POST') {
      return await criarUsuario(
        req,
        res,
      );
    }

    if (req.method === 'DELETE') {
      return await excluirUsuario(
        req,
        res,
      );
    }

    return res.status(405).json({
      error: 'Método não permitido.',
    });
  } catch (error) {
    console.error(
      'Erro interno na API de usuários:',
      error,
    );

    return res.status(500).json({
      error:
        'Erro interno ao processar a operação.',
    });
  }
}
