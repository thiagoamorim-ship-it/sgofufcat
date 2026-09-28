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
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={saving || excluindoId === usuario.id}
                                onClick={() =>
                                  void atualizarUsuario(
                                    usuario,
                                    { ativo: !usuario.ativo },
                                  )
                                }
                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                                  usuario.ativo
                                    ? 'border border-red-200 text-red-600 hover:bg-red-50'
                                    : 'border border-green-200 text-green-700 hover:bg-green-50'
                                }`}
                              >
                                {saving ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : usuario.ativo ? (
                                  <UserX size={14} />
                                ) : (
                                  <UserCheck size={14} />
                                )}
                                {usuario.ativo ? 'Bloquear' : 'Ativar'}
                              </button>

                              <button
                                type="button"
                                disabled={saving || excluindoId === usuario.id}
                                onClick={() => void excluirUsuario(usuario)}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
