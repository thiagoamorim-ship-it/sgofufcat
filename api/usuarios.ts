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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido.',
    });
  }

  try {
    /*
     * 1. Obtém o token enviado pelo usuário
     * autenticado no SGOF.
     */
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        error: 'Sessão não informada.',
      });
    }

    const accessToken =
      authorization.replace('Bearer ', '').trim();

    /*
     * 2. Confirma no Supabase quem é o usuário
     * correspondente ao token.
     */
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      accessToken,
    );

    if (userError || !user) {
      return res.status(401).json({
        error: 'Sessão inválida ou expirada.',
      });
    }

    /*
     * 3. Verifica se o solicitante é um
     * administrador ativo.
     */
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
      return res.status(403).json({
        error:
          'Você não possui permissão para criar usuários.',
      });
    }

    /*
     * 4. Valida os dados recebidos.
     */
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

    /*
     * 5. Cria a conta.
     *
     * Não definimos senha administrativa.
     * O usuário receberá o convite para
     * definir seu próprio acesso.
     */
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

    /*
     * O trigger on_auth_user_created já cria
     * automaticamente o registro em profiles.
     *
     * Aqui atualizamos nome e perfil escolhido
     * pelo administrador.
     */
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

      /*
       * Evita deixar uma conta incompleta
       * caso a criação do profile falhe.
       */
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
  } catch (error) {
    console.error(
      'Erro interno ao criar usuário:',
      error,
    );

    return res.status(500).json({
      error:
        'Erro interno ao criar o usuário.',
    });
  }
}
