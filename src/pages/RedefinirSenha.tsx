import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function RedefinirSenha() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password || !confirmPassword) {
      setError('Preencha os dois campos de senha.');
      return;
    }

    if (password.length < 8) {
      setError('A nova senha deve possuir pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas informadas não são iguais.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        setError(
          'Não foi possível redefinir a senha. Solicite um novo link de recuperação.',
        );
        return;
      }

      setSuccess(true);

      await supabase.auth.signOut();
    } catch {
      setError(
        'Não foi possível conectar ao serviço de autenticação.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">

        {/* Identidade do sistema */}
        <section className="relative hidden overflow-hidden bg-[#002B49] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20" />
          <div className="absolute -bottom-40 left-20 h-96 w-96 rounded-full bg-cyan-400/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#002B49]">
                SGO
              </div>

              <div>
                <p className="font-bold">SGOF</p>
                <p className="text-xs text-blue-200">
                  HU-UFCAT
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
              <LockKeyhole size={14} />
              USO INTERNO • HU-UFCAT
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
              SGOF • HU-UFCAT
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">
              Segurança de
              <span className="block text-blue-200">
                acesso ao sistema
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">
              Defina uma nova senha para continuar utilizando o
              Sistema de Gestão Orçamentária e Financeira.
            </p>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-blue-200"
              />

              <div>
                <p className="text-sm font-semibold">
                  Proteja suas credenciais
                </p>

                <p className="mt-1 text-sm leading-5 text-blue-100">
                  Utilize uma senha exclusiva e não compartilhe suas
                  credenciais de acesso ao SGOF.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-blue-200">
            Desenvolvido por{' '}
            <span className="font-semibold text-white">
              Thiago Batista Amorim
            </span>
          </div>
        </section>

        {/* Redefinição */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002B49] text-xs font-bold text-white">
                  SGO
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    SGOF
                  </p>

                  <p className="text-xs text-slate-500">
                    HU-UFCAT
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {!success ? (
                <>
                  <div className="mb-7">
                    <p className="text-sm font-semibold text-blue-600">
                      Segurança da conta
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Redefinir senha
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Informe e confirme sua nova senha de acesso ao
                      SGOF.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Nova senha
                      </label>

                      <div className="relative">
                        <LockKeyhole
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            setError('');
                          }}
                          placeholder="Digite a nova senha"
                          className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (current) => !current,
                            )
                          }
                          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
                          aria-label={
                            showPassword
                              ? 'Ocultar senha'
                              : 'Mostrar senha'
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Utilize pelo menos 8 caracteres.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Confirmar nova senha
                      </label>

                      <div className="relative">
                        <LockKeyhole
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) => {
                            setConfirmPassword(
                              event.target.value,
                            );
                            setError('');
                          }}
                          placeholder="Digite novamente a senha"
                          className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002B49] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#003d66] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={17} />
                          Salvar nova senha
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 size={28} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    Senha redefinida
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Sua nova senha foi cadastrada com sucesso.
                    Utilize-a para entrar novamente no SGOF.
                  </p>

                  <a
                    href="/login"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#002B49] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#003d66]"
                  >
                    Ir para o login
                  </a>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
              Desenvolvido por{' '}
              <span className="font-semibold text-slate-600">
                Thiago Batista Amorim
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
