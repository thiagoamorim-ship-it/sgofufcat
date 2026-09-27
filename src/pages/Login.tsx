import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError('Informe seu e-mail e sua senha.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(
          'Não foi possível entrar. Verifique o e-mail e a senha informados.',
        );
        return;
      }

      window.location.href = '/';
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

        {/* Apresentação */}
        <section className="relative hidden overflow-hidden bg-[#002B49] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20" />
          <div className="absolute -bottom-40 left-20 h-96 w-96 rounded-full bg-cyan-400/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#002B49]">
                SGO
              </div>

              <div>
                <p className="font-bold">
                  SGOF
                </p>

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
              Sistema de Gestão
              <span className="block text-blue-200">
                Orçamentária e Financeira
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">
              Ambiente interno de apoio às rotinas orçamentárias,
              financeiras e fiscais do HU-UFCAT.
            </p>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-blue-200"
              />

              <div>
                <p className="text-sm font-semibold">
                  Ambiente restrito
                </p>

                <p className="mt-1 text-sm leading-5 text-blue-100">
                  O acesso ao SGOF é destinado exclusivamente a
                  usuários previamente autorizados.
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

        {/* Login */}
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

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <LockKeyhole size={13} />
                USO INTERNO • HU-UFCAT
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold text-blue-600">
                  Acesso ao sistema
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Bem-vindo ao SGOF
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Informe suas credenciais para acessar o ambiente
                  interno.
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    E-mail
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError('');
                      }}
                      placeholder="seu.email@instituicao.gov.br"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError('');
                      }}
                      placeholder="Digite sua senha"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
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
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={17} />
                      Entrar
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0"
                  />

                  <p>
                    Acesso restrito a usuários autorizados. Não
                    compartilhe suas credenciais de acesso.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400 lg:hidden">
              Desenvolvido por{' '}
              <span className="font-semibold text-slate-600">
                Thiago Batista Amorim
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
