import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserRound,
  UserX,
  Users,
  X,
} from 'lucide-react';

import { supabase } from '../lib/supabase';

import type {
  PerfilUsuario,
  UsuarioPerfil,
} from '../lib/auth';

export default function Usuarios() {
  const [usuarios, setUsuarios] =
    useState<UsuarioPerfil[]>([]);

  const [loading, setLoading] = useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalOpen, setModalOpen] =
    useState(false);

  const [criando, setCriando] =
    useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const [novoPerfil, setNovoPerfil] =
    useState<PerfilUsuario>('usuario');

  async function carregarUsuarios() {
    setLoading(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id ?? null);

    const {
      data,
      error: queryError,
    } = await supabase
      .from('profiles')
      .select(
        'id, nome, email, perfil, ativo',
      )
      .order('nome', {
        ascending: true,
      });

    if (queryError) {
      setError(
        'Não foi possível carregar os usuários.',
      );

      setLoading(false);
      return;
    }

    setUsuarios(
      (data ?? []) as UsuarioPerfil[],
    );

    setLoading(false);
  }

  useEffect(() => {
    void carregarUsuarios();
  }, []);

  function abrirModal() {
    setNome('');
    setEmail('');
    setNovoPerfil('usuario');
    setError('');
    setSuccess('');
    setModalOpen(true);
  }

  function fecharModal() {
    if (criando) {
      return;
    }

    setModalOpen(false);
  }

  async function criarUsuario(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const nomeLimpo = nome.trim();
    const emailLimpo =
      email.trim().toLowerCase();

    if (nomeLimpo.length < 3) {
      setError(
        'Informe o nome completo do usuário.',
      );

      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailLimpo,
      );

    if (!emailValido) {
      setError(
        'Informe um endereço de e-mail válido.',
      );

      return;
    }

    setCriando(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError(
          'Sua sessão expirou. Entre novamente no SGOF.',
        );

        return;
      }

      const response = await fetch(
        '/api/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            nome: nomeLimpo,
            email: emailLimpo,
            perfil: novoPerfil,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            'Não foi possível criar o usuário.',
        );

        return;
      }

      setModalOpen(false);

      setNome('');
      setEmail('');
      setNovoPerfil('usuario');

      setSuccess(
        'Usuário criado. O convite de acesso foi enviado para o e-mail informado.',
      );

      await carregarUsuarios();

      window.setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (requestError) {
      console.error(
        'Erro ao cadastrar usuário:',
        requestError,
      );

      setError(
        'Não foi possível comunicar com o servidor.',
      );
    } finally {
      setCriando(false);
    }
  }

  async function atualizarUsuario(
    usuario: UsuarioPerfil,
    alteracoes: {
      perfil?: PerfilUsuario;
      ativo?: boolean;
    },
  ) {
    if (usuario.id === currentUserId) {
      setError(
        'Por segurança, você não pode alterar o perfil ou bloquear a própria conta nesta tela.',
      );

      return;
    }

    setSavingId(usuario.id);
    setError('');
    setSuccess('');

    const { error: updateError } =
      await supabase
        .from('profiles')
        .update(alteracoes)
        .eq('id', usuario.id);

    if (updateError) {
      setError(
        'Não foi possível atualizar o usuário.',
      );

      setSavingId(null);
      return;
    }

    setUsuarios((atuais) =>
      atuais.map((item) =>
        item.id === usuario.id
          ? {
              ...item,
              ...alteracoes,
            }
          : item,
      ),
    );

    setSuccess(
      'Usuário atualizado com sucesso.',
    );

    setSavingId(null);

    window.setTimeout(() => {
      setSuccess('');
    }, 2500);
  }

  const totalAtivos =
    usuarios.filter(
      (usuario) => usuario.ativo,
    ).length;

  const totalAdministradores =
    usuarios.filter(
      (usuario) =>
        usuario.perfil ===
        'administrador',
    ).length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <ShieldCheck size={14} />
            ADMINISTRAÇÃO
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Usuários
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Gerencie os usuários autorizados,
            perfis e acessos ao SGOF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              void carregarUsuarios()
            }
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            Atualizar
          </button>

          <button
            type="button"
            onClick={abrirModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#002B49] px-4 text-sm font-semibold text-white transition hover:bg-[#003d66]"
          >
            <Plus size={17} />
            Novo usuário
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users size={19} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                USUÁRIOS
              </p>

              <p className="text-xl font-bold text-slate-900">
                {usuarios.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <UserCheck size={19} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                ATIVOS
              </p>

              <p className="text-xl font-bold text-slate-900">
                {totalAtivos}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <UserCog size={19} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                ADMINISTRADORES
              </p>

              <p className="text-xl font-bold text-slate-900">
                {totalAdministradores}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          {error}
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          {success}
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Usuários autorizados
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Contas cadastradas no SGOF
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center">
            <div className="text-center">
              <Loader2
                size={25}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Carregando usuários...
              </p>
            </div>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Users
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              Nenhum usuário encontrado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">
                    Usuário
                  </th>

                  <th className="px-5 py-3">
                    Perfil
                  </th>

                  <th className="px-5 py-3">
                    Situação
                  </th>

                  <th className="px-5 py-3 text-right">
                    Ação
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {usuarios.map(
                  (usuario) => {
                    const saving =
                      savingId ===
                      usuario.id;

                    const propriaConta =
                      usuario.id ===
                      currentUserId;

                    return (
                      <tr
                        key={usuario.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#002B49] text-xs font-bold text-white">
                              {(
                                usuario.nome ||
                                usuario.email
                              )
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-800">
                                  {usuario.nome ||
                                    'Usuário SGOF'}
                                </p>

                                {propriaConta && (
                                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                    SUA CONTA
                                  </span>
                                )}
                              </div>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  usuario.email
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={
                              usuario.perfil
                            }
                            disabled={
                              saving ||
                              propriaConta
                            }
                            onChange={(
                              event,
                            ) =>
                              void atualizarUsuario(
                                usuario,
                                {
                                  perfil:
                                    event
                                      .target
                                      .value as PerfilUsuario,
                                },
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="usuario">
                              Usuário
                            </option>

                            <option value="administrador">
                              Administrador
                            </option>
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          {usuario.ativo ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Bloqueado
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {propriaConta ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <ShieldCheck
                                size={14}
                              />
                              Protegida
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                saving
                              }
                              onClick={() =>
                                void atualizarUsuario(
                                  usuario,
                                  {
                                    ativo:
                                      !usuario.ativo,
                                  },
                                )
                              }
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                                usuario.ativo
                                  ? 'border border-red-200 text-red-600 hover:bg-red-50'
                                  : 'border border-green-200 text-green-700 hover:bg-green-50'
                              }`}
                            >
                              {saving ? (
                                <Loader2
                                  size={
                                    14
                                  }
                                  className="animate-spin"
                                />
                              ) : usuario.ativo ? (
                                <UserX
                                  size={
                                    14
                                  }
                                />
                              ) : (
                                <UserCheck
                                  size={
                                    14
                                  }
                                />
                              )}

                              {usuario.ativo
                                ? 'Bloquear'
                                : 'Ativar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <p className="text-sm leading-6 text-blue-800">
            Somente administradores
            podem cadastrar usuários,
            alterar perfis e controlar
            o acesso ao SGOF. A própria
            conta administrativa fica
            protegida contra bloqueio
            ou alteração acidental.
          </p>
        </div>
      </div>

      {/* Modal novo usuário */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <UserRound
                    size={20}
                  />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Novo usuário
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Autorize um novo
                  usuário a acessar o
                  SGOF.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={criando}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Fechar"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={criarUsuario}
            >
              <div className="space-y-5 p-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nome completo
                  </label>

                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(event) =>
                      setNome(
                        event.target
                          .value,
                      )
                    }
                    disabled={criando}
                    placeholder="Nome do usuário"
                    autoComplete="name"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    E-mail
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(
                        event,
                      ) =>
                        setEmail(
                          event.target
                            .value,
                        )
                      }
                      disabled={
                        criando
                      }
                      placeholder="usuario@dominio.gov.br"
                      autoComplete="email"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="perfil"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Perfil de acesso
                  </label>

                  <select
                    id="perfil"
                    value={novoPerfil}
                    onChange={(event) =>
                      setNovoPerfil(
                        event.target
                          .value as PerfilUsuario,
                      )
                    }
                    disabled={criando}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
                  >
                    <option value="usuario">
                      Usuário
                    </option>

                    <option value="administrador">
                      Administrador
                    </option>
                  </select>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Administradores
                    podem gerenciar
                    usuários e permissões
                    do sistema.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-700"
                    />

                    <p className="text-xs leading-5 text-blue-800">
                      O usuário receberá
                      um convite no
                      endereço informado
                      para configurar o
                      acesso ao SGOF.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button
                  type="button"
                  onClick={
                    fecharModal
                  }
                  disabled={criando}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={criando}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#002B49] px-5 text-sm font-semibold text-white transition hover:bg-[#003d66] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {criando ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Criar usuário
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
