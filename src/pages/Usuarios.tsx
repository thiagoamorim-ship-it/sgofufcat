import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
  Users,
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import type {
  PerfilUsuario,
  UsuarioPerfil,
} from '../lib/auth';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function carregarUsuarios() {
    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('id, nome, email, perfil, ativo')
      .order('nome', { ascending: true });

    if (queryError) {
      setError('Não foi possível carregar os usuários.');
      setLoading(false);
      return;
    }

    setUsuarios((data ?? []) as UsuarioPerfil[]);
    setLoading(false);
  }

  useEffect(() => {
    void carregarUsuarios();
  }, []);

  async function atualizarUsuario(
    usuario: UsuarioPerfil,
    alteracoes: {
      perfil?: PerfilUsuario;
      ativo?: boolean;
    },
  ) {
    setSavingId(usuario.id);
    setError('');
    setSuccess('');

    const { error: updateError } = await supabase
      .from('profiles')
      .update(alteracoes)
      .eq('id', usuario.id);

    if (updateError) {
      setError('Não foi possível atualizar o usuário.');
      setSavingId(null);
      return;
    }

    setUsuarios((atuais) =>
      atuais.map((item) =>
        item.id === usuario.id
          ? { ...item, ...alteracoes }
          : item,
      ),
    );

    setSuccess('Usuário atualizado com sucesso.');
    setSavingId(null);

    window.setTimeout(() => {
      setSuccess('');
    }, 2500);
  }

  return (
    <div className="space-y-6">
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
            Gerencie os perfis e a situação de acesso dos usuários
            autorizados ao SGOF.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void carregarUsuarios()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Atualizar
        </button>
      </div>

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
                {usuarios.filter((usuario) => usuario.ativo).length}
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
                {
                  usuarios.filter(
                    (usuario) =>
                      usuario.perfil === 'administrador',
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

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
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Usuários autorizados
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Perfis cadastrados no SGOF
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
            <table className="w-full min-w-[760px]">
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
                {usuarios.map((usuario) => {
                  const saving = savingId === usuario.id;

                  return (
                    <tr
                      key={usuario.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#002B49] text-xs font-bold text-white">
                            {(usuario.nome ||
                              usuario.email)
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {usuario.nome ||
                                'Usuário SGOF'}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {usuario.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={usuario.perfil}
                          disabled={saving}
                          onChange={(event) =>
                            void atualizarUsuario(
                              usuario,
                              {
                                perfil: event.target
                                  .value as PerfilUsuario,
                              },
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
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
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void atualizarUsuario(
                              usuario,
                              {
                                ativo: !usuario.ativo,
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
                              size={14}
                              className="animate-spin"
                            />
                          ) : usuario.ativo ? (
                            <UserX size={14} />
                          ) : (
                            <UserCheck size={14} />
                          )}

                          {usuario.ativo
                            ? 'Bloquear'
                            : 'Ativar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
            Somente administradores podem consultar e alterar
            os perfis dos usuários do SGOF.
          </p>
        </div>
      </div>
    </div>
  );
}
